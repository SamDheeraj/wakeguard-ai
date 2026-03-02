import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ThumbsUp, Crosshair, Target, Radio } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FaceLandmarker, GestureRecognizer, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { PageTransition } from '../components/PageTransition';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- MediaPipe Logic ---
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

// Eye indices for EAR calculation (MediaPipe Face Mesh)
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

function calculateEAR(landmarks: any[], indices: number[]) {
    // Euclidean distance helper
    const dist = (p1: any, p2: any) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    // Vertical distances
    const v1 = dist(landmarks[indices[1]], landmarks[indices[5]]);
    const v2 = dist(landmarks[indices[2]], landmarks[indices[4]]);

    // Horizontal distance
    const h = dist(landmarks[indices[0]], landmarks[indices[3]]);

    return (v1 + v2) / (2.0 * h);
}

function useMediaPipe(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    isActive: boolean,
    onDrowsy: () => void,
    onResetGesture: () => void,
    isAlarmActive: boolean,
    setError: (error: string | null) => void
) {
    const [vigilance, setVigilance] = useState(100);
    const [ear, setEar] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const requestRef = useRef<number>(0);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);
    const lastVideoTimeRef = useRef<number>(-1);
    const lastStateUpdateRef = useRef<number>(0);

    // Refs for stable access in animation loop
    const isAlarmActiveRef = useRef(isAlarmActive);
    const onDrowsyRef = useRef(onDrowsy);
    const onResetGestureRef = useRef(onResetGesture);

    useEffect(() => {
        isAlarmActiveRef.current = isAlarmActive;
        onDrowsyRef.current = onDrowsy;
        onResetGestureRef.current = onResetGesture;
    }, [isAlarmActive, onDrowsy, onResetGesture]);

    // Drowsiness tracking
    const drowsyFramesRef = useRef(0);
    const DROWSY_THRESHOLD = 0.3; // Increased sensitivity (was 0.26)
    const DROWSY_FRAMES_LIMIT = 30; // Approx 1-1.5 seconds at 30fps

    useEffect(() => {
        const initMediaPipe = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "/wasm"
                );

                faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO"
                });

                setIsLoaded(true);
            } catch (err) {
                console.error("MediaPipe Init Error:", err);
                setError(err instanceof Error ? err.message : "Failed to initialize AI models");
            }
        };

        if (isActive && !faceLandmarkerRef.current) {
            initMediaPipe();
        }

        return () => {
            // Cleanup if needed
        };
    }, [isActive, setError]);

    const processVideo = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current || !gestureRecognizerRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;

            // Prepare canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Face Detection (Drowsiness)
            const faceResult = faceLandmarkerRef.current.detectForVideo(video, performance.now());

            if (faceResult.faceLandmarks.length > 0) {
                const landmarks = faceResult.faceLandmarks[0];

                // Draw face mesh - Cyberpunk Style
                const drawingUtils = new DrawingUtils(ctx);
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: '#00f3ff20', lineWidth: 0.5 });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#00f3ff' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#00f3ff' });

                // Draw target box around face
                // Simplified bounding box logic for visual effect
                const x = landmarks[1].x * canvas.width;
                const y = landmarks[1].y * canvas.height;
                ctx.strokeStyle = '#00f3ff';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - 50, y - 70, 100, 140);

                // Calculate EAR
                const leftEAR = calculateEAR(landmarks, LEFT_EYE);
                const rightEAR = calculateEAR(landmarks, RIGHT_EYE);
                const avgEAR = (leftEAR + rightEAR) / 2.0;

                // Drowsiness Logic
                if (avgEAR < DROWSY_THRESHOLD) {
                    drowsyFramesRef.current++;
                } else {
                    drowsyFramesRef.current = Math.max(0, drowsyFramesRef.current - 1);
                }

                // Update Vigilance Score (Visual only) - THROTTLED
                const now = performance.now();
                if (now - lastStateUpdateRef.current > 100) { // Update max 10 times per second
                    const vigilanceScore = Math.max(0, 100 - (drowsyFramesRef.current / DROWSY_FRAMES_LIMIT) * 100);
                    setVigilance(vigilanceScore);
                    setEar(avgEAR);
                    lastStateUpdateRef.current = now;
                }

                // Trigger Alarm
                if (drowsyFramesRef.current > DROWSY_FRAMES_LIMIT && !isAlarmActiveRef.current) {
                    onDrowsyRef.current();
                }
            }

            // 2. Gesture Detection (Reset)
            if (isAlarmActiveRef.current) {
                const gestureResult = gestureRecognizerRef.current.recognizeForVideo(video, performance.now());
                if (gestureResult.gestures.length > 0) {
                    const gesture = gestureResult.gestures[0][0];
                    console.log("Detected Gesture:", gesture.categoryName, gesture.score);

                    if ((gesture.categoryName === "Thumb_Up" || gesture.categoryName === "Thumbs_Up") && gesture.score > 0.5) {
                        onResetGestureRef.current();
                        drowsyFramesRef.current = 0; // Reset drowsiness counter
                        setVigilance(100);
                    }

                    // Draw hands
                    const drawingUtils = new DrawingUtils(ctx);
                    for (const landmarks of gestureResult.landmarks) {
                        drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, { color: "#00f3ff", lineWidth: 3 });
                        drawingUtils.drawLandmarks(landmarks, { color: "#ffffff", lineWidth: 2 });
                    }
                }
            }
        }

        requestRef.current = requestAnimationFrame(processVideo);
    }, [videoRef, canvasRef]); // Dependencies reduced to stable refs

    useEffect(() => {
        if (isActive && isLoaded) {
            // Start Webcam
            navigator.mediaDevices.getUserMedia({ video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT } }).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener("loadeddata", processVideo);
                }
            }).catch(err => {
                console.error("Webcam Error:", err);
                setError("Failed to access webcam: " + err.message);
            });
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isActive, isLoaded, processVideo, videoRef, setError]);

    return { vigilance, isLoaded, ear };
}

function useAlarm(isActive: boolean) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);

    useEffect(() => {
        if (isActive) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);

            // Siren effect
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 2; // 2Hz siren
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 300;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            gain.gain.setValueAtTime(0.5, ctx.currentTime);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();

            oscillatorRef.current = osc;

            return () => {
                osc.stop();
                osc.disconnect();
                lfo.stop();
                lfo.disconnect();
                gain.disconnect();
            };
        }
    }, [isActive]);
}

const AlarmOverlay = () => {
    useAlarm(true);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
        >
            {/* Flashing Red Background */}
            <motion.div
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-red-600 z-0"
            />

            {/* Glitch Effect Overlay */}
            <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-10 mix-blend-overlay pointer-events-none" />

            <div className="relative z-10 text-center max-w-2xl p-12 border-2 border-red-500 bg-black/80 shadow-[0_0_100px_rgba(220,38,38,0.5)]">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(220,38,38,0.8)]"
                >
                    <AlertTriangle className="w-16 h-16 text-black" />
                </motion.div>

                <h2 className="text-6xl font-black text-red-500 mb-4 tracking-tighter font-['Orbitron'] glitch-text">
                    CRITICAL ALERT
                </h2>
                <p className="text-white text-2xl mb-12 font-mono uppercase tracking-widest">
                    // PILOT UNRESPONSIVE //
                </p>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 px-8 py-4 bg-red-600 text-black font-bold text-xl uppercase tracking-widest hover:bg-red-500 transition-colors cursor-pointer animate-pulse">
                        <ThumbsUp className="w-8 h-8" />
                        <span>Initiate Manual Reset</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const RotatingRing = ({ size, duration, reverse = false, color = "border-cyan-500" }: { size: string, duration: number, reverse?: boolean, color?: string }) => (
    <motion.div
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed ${color} opacity-30 pointer-events-none`}
        style={{ width: size, height: size }}
    />
);

export const Monitor = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isAlarmActive, setIsAlarmActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { vigilance, isLoaded, ear } = useMediaPipe(
        videoRef,
        canvasRef,
        true,
        () => setIsAlarmActive(true),
        () => setIsAlarmActive(false),
        isAlarmActive,
        setError
    );

    const [showLoadingWarning, setShowLoadingWarning] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (!isLoaded && !error) {
            timeout = setTimeout(() => {
                setShowLoadingWarning(true);
            }, 10000); // Show warning after 10 seconds
        }
        return () => clearTimeout(timeout);
    }, [isLoaded, error]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-white p-8 text-center bg-black">
                <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4 font-['Orbitron'] text-red-500">SYSTEM FAILURE</h2>
                <p className="text-gray-400 max-w-md mb-8 font-mono">
                    &gt; ERROR_CODE: {error}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-cyan-600 text-black font-bold uppercase tracking-widest hover:bg-cyan-500 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                    Reboot System
                </button>
            </div>
        );
    }

    return (
        <PageTransition className="relative h-screen overflow-hidden flex flex-col pt-20 bg-black">
            {/* Background Grid */}
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

            {/* Main Feed Container */}
            <div className="flex-1 relative m-4 md:m-8 border-2 border-cyan-500/30 bg-black/50 overflow-hidden relative group">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500 z-20" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500 z-20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-500 z-20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500 z-20" />

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700 grayscale contrast-125"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />

                {/* HUD Overlay - Sci-Fi Cockpit */}
                <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-10">
                    {/* Rotating Rings */}
                    <RotatingRing size="600px" duration={20} />
                    <RotatingRing size="500px" duration={15} reverse color="border-cyan-500/50" />

                    {/* Top Bar */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4 bg-black/80 border border-cyan-500/50 px-6 py-2 skew-x-[-20deg]">
                            <div className="skew-x-[20deg] flex items-center gap-4">
                                <div className={cn("w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor]", isLoaded ? "bg-green-500 text-green-500" : "bg-yellow-500 text-yellow-500")} />
                                <span className="text-sm font-bold text-cyan-400 tracking-[0.2em] font-['Orbitron']">
                                    {isLoaded ? "SYSTEM_ONLINE" : showLoadingWarning ? "CONNECTING..." : "INITIALIZING..."}
                                </span>
                            </div>
                        </div>

                        <div className="bg-black/80 border border-cyan-500/50 px-6 py-2 skew-x-[20deg]">
                            <div className="skew-x-[-20deg] flex items-center gap-2">
                                <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
                                <span className="font-mono text-lg text-cyan-400 font-bold">
                                    LIVE_FEED_60FPS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center Crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
                        <Crosshair className="w-16 h-16 text-cyan-500" />
                    </div>

                    {/* Bottom Stats Panel */}
                    <div className="max-w-3xl mx-auto w-full relative">
                        <div className="absolute -inset-4 bg-cyan-500/5 blur-xl rounded-full" />
                        <div className="bg-black/80 border-t-2 border-b-2 border-cyan-500/50 p-6 backdrop-blur-md relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-cyan-900/30 border border-cyan-500/50">
                                        <Target className="w-6 h-6 text-cyan-400 animate-[spin_3s_linear_infinite]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-['Orbitron'] tracking-wider">VIGILANCE_LEVEL</h3>
                                        <p className="text-xs text-cyan-500 font-mono">NEURAL_LINK_ACTIVE</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn("text-6xl font-black tracking-tighter font-mono neon-text-cyan", vigilance > 50 ? "text-cyan-400" : "text-red-500 neon-text-magenta")}>
                                        {vigilance.toFixed(0)}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-4 bg-black border border-cyan-500/30 relative">
                                <motion.div
                                    className={cn("h-full relative overflow-hidden", vigilance > 50 ? "bg-cyan-500" : "bg-red-500")}
                                    style={{ width: `${vigilance}%` }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] w-full animate-[shimmer_1s_infinite]" />
                                </motion.div>
                                {/* Ticks */}
                                <div className="absolute inset-0 flex justify-between px-1">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-px h-full bg-black/50" />
                                    ))}
                                </div>
                            </div>

                            {/* Debug Info */}
                            <div className="flex justify-between items-center pt-4 mt-2">
                                <div className="flex gap-4 font-mono text-xs text-cyan-600">
                                    <span>CPU: 12%</span>
                                    <span>MEM: 450MB</span>
                                    <span>NET: 1.2GB/s</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-cyan-600 tracking-widest">EAR_METRIC:</span>
                                    <span className={cn("font-mono text-sm font-bold", ear < 0.3 ? "text-red-500 animate-pulse" : "text-cyan-400")}>
                                        {ear.toFixed(3)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isAlarmActive && <AlarmOverlay />}
            </AnimatePresence>
        </PageTransition>
    );
};
