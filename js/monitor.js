import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/+esm";

// CONFIGURATION 
const CONFIG = {
    // 1. Thresholds
    EAR_THRESHOLD_CLOSED: 0.22,     // Default "eyes closed" EAR (calibrated later)
    PERCLOS_THRESHOLD: 0.15,        // 15% eye closure over time = drowsy (Industry Std)
    MICROSLEEP_THRESHOLD_MS: 400,   // Single blink longer than this = warning

    // 2. Windows & Timing
    CALIBRATION_DURATION_MS: 60000, // 60 Seconds strict calibration
    WINDOW_SIZE_MS: 60000,          // Rolling window for PERCLOS (1 minute)
    DEBUG_LOG_INTERVAL: 60
};

// --- STATE MANAGEMENT ---
const state = {
    model: null,
    isModelLoaded: false,
    webcamRunning: false,

    // Calibration
    isCalibrating: false,
    calibrationStartTime: 0,
    calibrationData: {
        earSum: 0,
        frameCount: 0,
        blinkCount: 0,
        blinkDurations: []
    },
    userBaseline: {
        ear: 0.28,             // Default fallback
        blinkRate: 15,         // Blinks per minute
        avgBlinkDuration: 150  // ms
    },

    // Real-time Metrics
    lastFrameTime: 0,

    // Blink Detection State Machine
    blinkState: 'OPEN', // OPEN -> CLOSING -> CLOSED -> OPENING
    currentBlinkStart: 0,

    // Circular Buffers for Temporal Analysis
    history: {
        timestamps: [],    // Time of each frame
        isClosed: [],      // Boolean: was eye closed in this frame?
        blinks: []         // Timestamp of every completed blink
    },

    // Status
    drowsinessScore: 0, // 0-100
    isAlerting: false,
    reason: ""
};

// --- DOM ELEMENTS (Unchanged) ---
const DOM = {
    video: document.getElementById("webcam"),
    canvas: document.getElementById("output_canvas"),
    ctx: document.getElementById("output_canvas").getContext("2d", { willReadFrequently: true }),
    btnToggle: document.getElementById("toggle-cam"),
    statusText: document.getElementById("system-status"),
    statusDot: document.getElementById("status-dot"),
    alertnessDisplay: document.getElementById("alertness-level-display"),
    overlays: {
        alert: document.getElementById("drowsy-alert"),
        calibration: document.getElementById("calibration-overlay"),
        progressBar: document.getElementById("calibration-progress"),
        darkness: document.getElementById("darkness-overlay")
    },
    debug: document.getElementById("debug-console")
};

// --- AUDIO SYSTEM (Unchanged) ---
const AudioSys = {
    ctx: null,
    osc: null,
    lfo: null,
    gain: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    },

    speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.2;
            utterance.pitch = 1.1;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    },

    startSiren() {
        if (state.isAlerting || this.osc) return;
        this.init();
        if (!this.ctx) return;

        this.osc = this.ctx.createOscillator();
        this.lfo = this.ctx.createOscillator();
        this.lfoGain = this.ctx.createGain();
        this.gain = this.ctx.createGain();

        this.lfo.type = 'triangle';
        this.lfo.frequency.value = 4;
        this.lfoGain.gain.value = 300;

        this.osc.type = 'sawtooth';
        this.osc.frequency.value = 800;

        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.osc.frequency);
        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);

        this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.1);

        this.lfo.start();
        this.osc.start();
    },

    stopSiren() {
        const now = this.ctx ? this.ctx.currentTime : 0;
        if (this.gain) {
            try { this.gain.gain.linearRampToValueAtTime(0, now + 0.1); } catch (e) { }
        }
        setTimeout(() => {
            if (this.osc) { try { this.osc.stop(); this.osc.disconnect(); } catch (e) { } this.osc = null; }
            if (this.lfo) { try { this.lfo.stop(); this.lfo.disconnect(); } catch (e) { } this.lfo = null; }
        }, 150);
    }
};

// LOGGING 
function log(msg, error = false) {
    console.log(`[WakeGuard] ${msg}`);
}

// INITIALIZATION
async function initModel() {
    try {
        log("Loading AI Vision Model...");
        DOM.statusText.textContent = "Loading AI...";
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm");
        state.model = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "CPU"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        });
        state.isModelLoaded = true;
        log("AI Model Ready.");
        DOM.statusText.textContent = "Standby";
        DOM.btnToggle.onclick = toggleCamera;
    } catch (e) {
        log("Model Failed: " + e.message, true);
        alert("Failed to load AI. Please refresh.");
    }
}

// CAMERA CONTROL 
async function toggleCamera() {
    if (!state.isModelLoaded) { alert("Please wait for AI to load."); return; }

    if (state.webcamRunning) {
        // STOP
        state.webcamRunning = false;
        DOM.btnToggle.innerText = "Start Camera";
        DOM.statusText.textContent = "Standby";
        DOM.statusDot.className = "status-dot";
        DOM.video.pause();
        if (DOM.video.srcObject) {
            DOM.video.srcObject.getTracks().forEach(t => t.stop());
            DOM.video.srcObject = null;
        }
        DOM.ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
        AudioSys.stopSiren();
        resetUI();
    } else {
        // START
        try {
            AudioSys.init();
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            DOM.video.srcObject = stream;
            DOM.video.setAttribute("playsinline", true);
            await DOM.video.play();

            state.webcamRunning = true;
            DOM.btnToggle.innerText = "Stop Camera";
            DOM.statusText.textContent = "Active Monitoring";
            DOM.statusDot.className = "status-dot active";

            // RESET STATE
            state.blinkState = 'OPEN';
            state.history.timestamps = [];
            state.history.isClosed = [];
            state.history.blinks = [];
            state.isAlerting = false;

            log("Camera Started. AI Loop Beginning.");
            requestAnimationFrame(predictLoop);

        } catch (e) {
            log("Camera Error: " + e.message, true);
            alert("Camera Access Denied.");
        }
    }
}

// MAIN PREDICTION LOOP
async function predictLoop() {
    if (!state.webcamRunning) return;

    try {
        if (DOM.video.videoWidth > 0 && DOM.canvas.width !== DOM.video.videoWidth) {
            DOM.canvas.width = DOM.video.videoWidth;
            DOM.canvas.height = DOM.video.videoHeight;
        }
        DOM.ctx.drawImage(DOM.video, 0, 0, DOM.canvas.width, DOM.canvas.height);

        const now = performance.now();
        state.lastFrameTime = now;

        let results = null;
        if (state.model) {
            results = state.model.detectForVideo(DOM.video, now);
        }

        if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            const ear = calculateEAR(landmarks);

            // Draw
            drawEye(landmarks, [33, 160, 158, 133, 153, 144]);
            drawEye(landmarks, [362, 385, 387, 263, 373, 380]);

            // CORE LOGIC SWITCH
            if (!state.isCalibrating && state.userBaseline.ear === 0.28) { // Default value check
                startCalibration(now);
            }

            if (state.isCalibrating) {
                runCalibration(ear, now);
            } else {
                runAdvancedMonitoring(ear, now);
            }

        } else {
            // No Face
            AudioSys.stopSiren();
            DOM.ctx.fillStyle = "red";
            DOM.ctx.font = "bold 30px Arial";
            DOM.ctx.fillText("NO FACE DETECTED", DOM.canvas.width / 2 - 140, DOM.canvas.height / 2);

            // If we lose face during calibration, we should probably pause/abort, 
            // but for now let's just ignore the frame.
            if (state.isCalibrating) {
                DOM.ctx.fillText("KEEP FACE VISIBLE", DOM.canvas.width / 2 - 130, DOM.canvas.height / 2 + 50);
            }
        }
    } catch (e) {
        console.error("Loop Error:", e);
    }

    requestAnimationFrame(predictLoop);
}

// --------------------------------------------------------------------------
// --- ADVANCED LOGIC: CALIBRATION ---
// --------------------------------------------------------------------------

function startCalibration(now) {
    state.isCalibrating = true;
    state.calibrationStartTime = now;
    state.calibrationData = { earSum: 0, frameCount: 0, blinkCount: 0, blinkDurations: [] };
    DOM.overlays.calibration.classList.remove('hidden');
    log("Starting 60s Calibration...");
}

function runCalibration(ear, now) {
    const elapsed = now - state.calibrationStartTime;
    const progress = Math.min((elapsed / CONFIG.CALIBRATION_DURATION_MS) * 100, 100);

    // 1. Collect EAR Data
    state.calibrationData.earSum += ear;
    state.calibrationData.frameCount++;

    // 2. Track Blinks (Simplistic Check for Calibration)
    // We use a hardcoded safe threshold for calibration detection to just count them
    // Users are asked to look normally.
    const isClosed = ear < 0.22;
    trackBlinkEvent(isClosed, now, true); // record blink data into temp state

    // 3. UI Updates
    DOM.overlays.progressBar.style.width = `${progress}%`;
    DOM.ctx.fillStyle = "yellow";
    DOM.ctx.font = "20px Arial";
    DOM.ctx.fillText(`CALIBRATING: ${Math.round(progress)}%`, 20, 60);
    DOM.ctx.fillText(`BLINKS: ${state.calibrationData.blinkCount}`, 20, 90);

    // 4. Complete
    if (elapsed >= CONFIG.CALIBRATION_DURATION_MS) {
        finishCalibration();
    }
}

function finishCalibration() {
    state.isCalibrating = false;
    DOM.overlays.calibration.classList.add('hidden');

    const d = state.calibrationData;

    // Avg EAR
    const avgEAR = d.earSum / d.frameCount;

    // Avg Blink Duration
    const avgDur = d.blinkDurations.length > 0
        ? d.blinkDurations.reduce((a, b) => a + b, 0) / d.blinkDurations.length
        : 150; // default fallout

    // Blink Rate (Blinks per min)
    // We ran for CONFIG.CALIBRATION_DURATION_MS (60s), so count is the rate.
    const rate = d.blinkCount;

    // Set Baseline
    state.userBaseline = {
        ear: avgEAR,
        blinkRate: Math.max(rate, 5), // Min safe floor
        avgBlinkDuration: avgDur
    };

    // Set dynamic threshold based on baseline (e.g. 75% of open eyes)
    // But never higher than 0.28 or lower than 0.18 for safety
    state.userBaselineEAR = avgEAR; // Keep legacy variable for generic reference
    CONFIG.EAR_THRESHOLD_CLOSED = Math.min(Math.max(avgEAR * 0.75, 0.18), 0.28);

    log(`Calibration Done. EAR: ${avgEAR.toFixed(3)}, Rate: ${rate} bpm, Dur: ${avgDur.toFixed(0)}ms`);
    AudioSys.speak("Calibration Complete. Active Monitoring Started.");
}


// ADVANCED LOGIC: MONITORING (PERCLOS + TEMPORAL)


function runAdvancedMonitoring(ear, now) {
    // 1. Detect Eye State
    const isClosed = ear < CONFIG.EAR_THRESHOLD_CLOSED;

    // 2. Update Temporal History (Circular Buffers)
    updateHistoryBuffers(now, isClosed);

    // 3. Track Individual Blinks
    const currentBlinkDuration = trackBlinkEvent(isClosed, now, false);

    // 4. Calculate Metrics
    const perclos = calculatePerclos(); // 0.0 to 1.0
    const blinkRate = calculateBlinkRate(now); // blinks/min

    // 5. Visualize Debug Data on Canvas
    // DOM.ctx.fillStyle = isClosed ? "red" : "lime";
    // DOM.ctx.fillText(`EAR: ${ear.toFixed(3)}`, 20, 30);
    DOM.ctx.fillStyle = "white";
    DOM.ctx.fillText(`PERCLOS: ${(perclos * 100).toFixed(1)}%`, 20, 30);
    DOM.ctx.fillText(`RATE: ${blinkRate.toFixed(1)} bpm`, 20, 60);

    // 6. Evaluate Drowsiness (The Decision Logic)
    evaluateDrowsiness(perclos, blinkRate, currentBlinkDuration);
}

function updateHistoryBuffers(now, isClosed) {
    // Add new frame
    state.history.timestamps.push(now);
    state.history.isClosed.push(isClosed);

    // Clean old frames > WINDOW_SIZE_MS
    while (state.history.timestamps.length > 0 &&
        (now - state.history.timestamps[0]) > CONFIG.WINDOW_SIZE_MS) {
        state.history.timestamps.shift();
        state.history.isClosed.shift();
    }
}

function trackBlinkEvent(isClosed, now, isCalibration) {
    // State machine to capture full blinks and duration
    let duration = 0;

    if (state.blinkState === 'OPEN' && isClosed) {
        state.blinkState = 'CLOSED';
        state.currentBlinkStart = now;
    } else if (state.blinkState === 'CLOSED') {
        duration = now - state.currentBlinkStart;

        if (!isClosed) {
            // Blink Finished
            state.blinkState = 'OPEN';

            // Register Blink
            if (duration > 50) { // Filter noise < 50ms
                if (isCalibration) {
                    state.calibrationData.blinkCount++;
                    state.calibrationData.blinkDurations.push(duration);
                } else {
                    state.history.blinks.push(now);
                    // Filter old blinks
                    while (state.history.blinks.length > 0 &&
                        (now - state.history.blinks[0]) > CONFIG.WINDOW_SIZE_MS) {
                        state.history.blinks.shift();
                    }
                }
            }
        }
    }
    return duration; // Returns current closure duration if closed, else 0
}

function calculatePerclos() {
    if (state.history.isClosed.length === 0) return 0;

    let closedFrames = 0;
    for (let c of state.history.isClosed) {
        if (c) closedFrames++;
    }
    return closedFrames / state.history.isClosed.length;
}

function calculateBlinkRate(now) {
    // state.history.blinks contains timestamps of blinks in the last 60s
    // So the length is literally the rate per minute
    return state.history.blinks.length;
}

function evaluateDrowsiness(perclos, currentRate, currentClosedDuration) {
    // --- CRITERIA ---

    // 1. MICROSLEEP (Immediate Danger)
    if (currentClosedDuration > CONFIG.MICROSLEEP_THRESHOLD_MS) {
        triggerAlert("MICROSLEEP DETECTED!");
        return;
    }

    // 2. PERCLOS (Fatigue Trend)
    // Industry standard: > 0.15 (15%) is drowsy. > 0.30 is severe.
    if (perclos > CONFIG.PERCLOS_THRESHOLD) {
        // Visualize Danger
        const severity = Math.min((perclos - CONFIG.PERCLOS_THRESHOLD) * 10, 1); // 0-1 scale
        DOM.alertnessDisplay.className = "value bad";

        if (perclos > 0.25) {
            triggerAlert("HIGH FATIGUE (PERCLOS)");
            return;
        }
    }

    // 3. LOW BLINK RATE (Staring / Cognitive Failure)
    // If rate drops to < 50% of baseline
    if (state.userBaseline.blinkRate > 0 && currentRate < (state.userBaseline.blinkRate * 0.5)) {
        if (currentRate < 5) { // Absolute floor
            DOM.ctx.fillText("LOW BLINK RATE", 20, 120);
        }
    }

    // If we are here, we are safe(-ish)
    if (state.isAlerting) clearAlert();

    // Update UI Score (Inverse of PERCLOS basically)
    const safetyScore = Math.max(100 - (perclos * 400), 0);
    DOM.alertnessDisplay.textContent = `${Math.round(safetyScore)}%`;
    DOM.alertnessDisplay.className = safetyScore < 70 ? "value bad" : (safetyScore < 90 ? "value warn" : "value good");
}


// ALERT SYSTEM


function triggerAlert(reason) {
    if (!state.isAlerting) {
        state.isAlerting = true;
        state.reason = reason;
        DOM.overlays.alert.classList.remove('hidden');

        // Update Overlay Text
        const alertTitle = DOM.overlays.alert.querySelector('h1');
        if (alertTitle) alertTitle.textContent = reason;

        AudioSys.startSiren();
        AudioSys.speak("Wake up! " + reason);
    }
}

function clearAlert() {
    if (state.isAlerting) {
        state.isAlerting = false;
        DOM.overlays.alert.classList.add('hidden');
        AudioSys.stopSiren();
    }
}

function resetUI() {
    DOM.alertnessDisplay.textContent = "--";
    DOM.overlays.alert.classList.add('hidden');
    DOM.overlays.calibration.classList.add('hidden');
}


// --- MATH & UTILS ---
function calculateEAR(landmarks) {
    const leftEye = [33, 160, 158, 133, 153, 144];
    const rightEye = [362, 385, 387, 263, 373, 380];
    return (getEyeRatio(landmarks, leftEye) + getEyeRatio(landmarks, rightEye)) / 2;
}

function getEyeRatio(landmarks, indices) {
    const v1 = dist(landmarks[indices[1]], landmarks[indices[5]]);
    const v2 = dist(landmarks[indices[2]], landmarks[indices[4]]);
    const h = dist(landmarks[indices[0]], landmarks[indices[3]]);
    return (v1 + v2) / (2.0 * h);
}

function dist(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function drawEye(landmarks, indices) {
    DOM.ctx.beginPath();
    const w = DOM.canvas.width;
    const h = DOM.canvas.height;
    DOM.ctx.moveTo(landmarks[indices[0]].x * w, landmarks[indices[0]].y * h);
    for (let i = 1; i < indices.length; i++) {
        DOM.ctx.lineTo(landmarks[indices[i]].x * w, landmarks[indices[i]].y * h);
    }
    DOM.ctx.closePath();
    DOM.ctx.strokeStyle = '#39ff14';
    DOM.ctx.lineWidth = 2;
    DOM.ctx.stroke();
}

//  BOOTSTRAP 
window.startCamera = toggleCamera;
initModel();
