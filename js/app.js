// Navigation Logic
// --- State Management ---
const pages = ['login-page', 'education-page', 'reflex-page', 'monitor-page'];
let currentState = 'login-page';

function showPage(pageId) {
    pages.forEach(id => {
        const pageElement = document.getElementById(id);
        if (pageElement) {
            pageElement.classList.remove('active');
        }
    });
    const targetPageElement = document.getElementById(pageId);
    if (targetPageElement) {
        targetPageElement.classList.add('active');
    }
    currentState = pageId;

    // Auto-init specific pages
    if (pageId === 'reflex-page') {
        startReflexTest();
    }
}

// --- Phase 1: Pre-Trip Verification ---
function startPreTrip() {
    const driverIdInput = document.getElementById('driver-id');
    const driverId = driverIdInput ? driverIdInput.value : ''; // Handle case where element might not exist
    if (driverId.length < 3) {
        alert("Please enter a valid Driver ID");
        return;
    }
    // Simulate login success
    localStorage.setItem('driverId', driverId);
    showPage('education-page');
}

function acknowledgeTip() {
    showPage('reflex-page');
}

// --- Phase 1.3: Reflex Test Logic (PVT) ---
const reflexScreen = document.getElementById('reflex-screen');
const reflexInstruction = document.getElementById('reflex-instruction');
const reflexSub = document.getElementById('reflex-sub');
const reflexResult = document.getElementById('reflex-result');
const reflexControls = document.getElementById('reflex-controls');
const proceedBtn = document.getElementById('proceed-btn');
const retryBtn = document.getElementById('retry-reflex');

let reflexStartTime;
let reflexTimer;
let isWaitingForReflex = false;

function handleReflexClick() {
    if (isWaitingForReflex) {
        // Clicked too early
        failReflex("Too early! Wait for green.");
        clearTimeout(reflexTimer);
        isWaitingForReflex = false;
    } else if (reflexScreen && reflexScreen.classList.contains('go')) { // Check reflexScreen exists
        // Correct click
        let reactionTime = performance.now() - reflexStartTime;
        endReflexTest(reactionTime);
    }
}

function startReflexTest() {
    // Reset UI
    if (reflexScreen) reflexScreen.className = 'reflex-screen waiting';
    if (reflexScreen) reflexScreen.onclick = handleReflexClick; // Ensure click handler is active
    if (reflexInstruction) reflexInstruction.textContent = 'Wait for Green...';
    if (reflexSub) reflexSub.textContent = 'Tap immediately when it turns green.';
    if (reflexResult) reflexResult.classList.add('hidden');
    if (reflexControls) reflexControls.classList.add('hidden');

    isWaitingForReflex = true;

    // Random delay between 2000ms and 5000ms
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;

    reflexTimer = setTimeout(() => {
        if (reflexScreen) reflexScreen.className = 'reflex-screen go';
        if (reflexInstruction) reflexInstruction.textContent = 'CLICK NOW!';
        reflexStartTime = performance.now();
        isWaitingForReflex = false;
    }, randomDelay);
}

function failReflex(reason) {
    if (reflexScreen) reflexScreen.className = 'reflex-screen ready'; // Redish
    if (reflexInstruction) reflexInstruction.textContent = 'TEST FAILED';
    if (reflexSub) reflexSub.textContent = reason;
    if (reflexControls) reflexControls.classList.remove('hidden');
    if (proceedBtn) proceedBtn.classList.add('hidden');
    if (retryBtn) retryBtn.classList.remove('hidden');
}

function endReflexTest(time) {
    if (reflexScreen) reflexScreen.className = 'reflex-screen';
    if (reflexScreen) reflexScreen.onclick = null; // Disable clicks

    // Display result
    if (reflexResult) {
        reflexResult.textContent = Math.floor(time) + ' ms';
        reflexResult.classList.remove('hidden');
    }

    if (time <= 600) {
        if (reflexInstruction) reflexInstruction.textContent = 'PASSED';
        if (reflexSub) reflexSub.textContent = 'Your reflexes are sharp.';
        if (reflexControls) reflexControls.classList.remove('hidden');
        if (proceedBtn) proceedBtn.classList.remove('hidden');
        if (retryBtn) retryBtn.classList.add('hidden');
    } else {
        if (reflexInstruction) reflexInstruction.textContent = 'FAILED';
        if (reflexSub) reflexSub.textContent = 'Reaction too slow (>600ms). Unsafe to drive.';
        if (reflexControls) reflexControls.classList.remove('hidden');
        if (proceedBtn) proceedBtn.classList.add('hidden');
        if (retryBtn) retryBtn.classList.remove('hidden');
    }
}

function completePhase1() {
    // Check if we are returning from a "Fail-Safe" check in monitoring
    if (window.failSafeCallback) {
        window.failSafeCallback();
        window.failSafeCallback = null;
    }
    showPage('monitor-page');

    // Auto-start camera if available
    if (window.startCamera) {
        window.startCamera();
    } else {
        // Fallback or retry if module hasn't loaded yet
        setTimeout(() => {
            if (window.startCamera) window.startCamera();
        }, 1000);
    }
}

// Initial Setup
const dailyTips = [
    "Microsleeps can last significantly less than a second but detecting them early saves lives.",
    "Driving efficiently means no speeding, no hard braking, and staying awake.",
    "Fatigue is a major factor in 20% of all road accidents.",
    "Take a break every 2 hours when driving long distances."
];
const dailyTipElement = document.getElementById('daily-tip');
if (dailyTipElement) {
    dailyTipElement.textContent = dailyTips[Math.floor(Math.random() * dailyTips.length)];
}

// Make functions global for inline button clicks
window.startPreTrip = startPreTrip;
window.acknowledgeTip = acknowledgeTip;
window.handleReflexClick = handleReflexClick;
window.startReflexTest = startReflexTest;
window.completePhase1 = completePhase1;
window.showPage = showPage;

// Education Page Logic
const timeSlider = document.getElementById('time-slider');
const timeDisplay = document.getElementById('time-display');
const alertnessValue = document.getElementById('alertness-value');

if (timeSlider && timeDisplay && alertnessValue) { // Ensure all elements exist
    timeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        const ampm = val >= 12 ? 'PM' : 'AM';
        const displayVal = val % 12 || 12;
        timeDisplay.textContent = `${displayVal}:00 ${ampm} `;

        // Simple circadian logic
        if (val >= 23 || val <= 5) {
            alertnessValue.textContent = "Low";
            alertnessValue.className = "metric-value bad";
        } else if (val >= 13 && val <= 15) {
            alertnessValue.textContent = "Moderate";
            alertnessValue.className = "metric-value warn";
        } else {
            alertnessValue.textContent = "High";
            alertnessValue.className = "metric-value good";
        }
    });
}
