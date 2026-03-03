# WakeGuard AI

A browser-based driver drowsiness detection tool I built using MediaPipe and plain JavaScript. No backend, no sign-ups — just open it and it works.

The idea came from reading about how many road accidents happen because of drowsy driving. Most existing solutions are either expensive hardware or require server-side processing. This one runs entirely in the browser using your webcam, so nothing gets sent anywhere.

## What it does

- Tracks your eye openness in real time using MediaPipe Face Landmarker (EAR — Eye Aspect Ratio)
- Plays a siren alert if your eyes stay closed for too long (filters out normal blinks so it doesn't false-alarm every second)
- Everything runs locally on your device — no video is uploaded or stored
- Works on any modern browser with webcam access

## Running it locally

Because browsers block camera access on `file://` URLs, you need to serve it over HTTP. Two easy ways:

**Option 1 — Python (quickest)**
```bash
python3 -m http.server
```
Then open `http://localhost:8000` in your browser.

**Option 2 — VS Code Live Server**

Install the Live Server extension, right-click `index.html`, and hit "Open with Live Server".

## Live demo

Hosted on GitHub Pages: [samdheeraj.github.io/wakeguard-ai](https://samdheeraj.github.io/wakeguard-ai)

Since it's a pure HTML/JS/CSS project, GitHub Pages serves it perfectly. The `https://` URL means the browser allows webcam access without any issues.

## Project structure

```
wakeguard-ai/
├── index.html          # main UI
├── style.css           # styling
└── js/
    ├── monitor.js      # drowsiness detection logic, camera, audio
    └── app.js          # UI interactions
```

## Tech used

- MediaPipe Face Landmarker (WASM, runs in-browser)
- Vanilla JavaScript
- HTML/CSS

## Notes

- Tested on Chrome and Edge — Firefox has some issues with MediaPipe WASM sometimes
- Make sure to allow camera permissions when prompted
- Works best in decent lighting
