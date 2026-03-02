# WakeGuard AI (Vanilla JS Version)

A premium, privacy-focused driver drowsiness detection system running entirely in the browser.

## Features
- **Real-time Drowsiness Detection**: Uses MediaPipe Face Landmarker to track eye openness (EAR).
- **Smart Alerts**: Filters out normal blinks and triggers a siren only for sustained drowsiness.
- **Premium Design**: Modern, "Tech Gradient" aesthetic with smooth animations.
- **Privacy First**: All processing happens locally on your device. No video is sent to the cloud.

## How to Run
Since this is a static HTML/JS application, you need a local server to access the camera (due to browser security restrictions on `file://` URLs).

### Option 1: Python (Recommended)
If you have Python installed:
1.  Open a terminal in this folder.
2.  Run:
    ```bash
    python3 -m http.server
    ```
3.  Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: VS Code Live Server
If you use VS Code:
1.  Install the "Live Server" extension.
2.  Right-click `index.html` and select "Open with Live Server".

## File Structure
- `index.html`: Main entry point and layout.
- `style.css`: All styling (Neon/Tech theme).
- `js/monitor.js`: Core AI logic, camera handling, and audio system.
- `js/app.js`: UI navigation and interactions.
