# WakeGuard AI

A real-time driver drowsiness detection system that runs entirely in your browser — no installation, no server, no data leaving your device.

---

## The Problem

Drowsy driving kills. According to road safety studies, driver fatigue is responsible for a significant percentage of highway accidents — many of them fatal. The scary part is that most drivers don't even realize they're falling asleep until it's too late. Unlike drunk driving, there's no obvious physical sign, no smell, nothing. The body just shuts down.

Long-distance truck drivers, night shift workers, and even regular commuters are at risk. Existing solutions like dedicated hardware fatigue sensors or in-car camera systems are expensive, often locked behind premium vehicles, and not accessible to the average person.

## How WakeGuard Solves It

WakeGuard uses your device's webcam and MediaPipe's Face Landmarker model to continuously monitor your eye openness while you drive. It calculates the Eye Aspect Ratio (EAR) — a measurement based on the distance between eyelid landmarks — to determine if your eyes are closing beyond a normal blink.

If your eyes stay closed for longer than a safe threshold, it triggers a loud siren alert to snap you back to attention.

The key decisions behind this:
- **Runs in the browser** — no app to install, works on any laptop or tablet with a webcam
- **No server involved** — all processing happens locally using WebAssembly, so your video feed is never transmitted anywhere
- **Blink filtering** — normal blinks don't trigger the alarm, only sustained eye closure does
- **Free and accessible** — hosted on GitHub Pages, open to anyone

## Features

- Real-time eye tracking using MediaPipe Face Landmarker
- EAR-based drowsiness detection with blink filtering
- Siren alert for sustained eye closure
- Fully client-side — no backend, no data collection
- Works on any modern browser with webcam support

## Tech Stack

- MediaPipe Face Landmarker (WASM, runs in-browser)
- Vanilla JavaScript
- HTML + CSS

## Live Demo

Hosted on GitHub Pages: [samdheeraj.github.io/wakeguard-ai](https://samdheeraj.github.io/wakeguard-ai)

## Project Structure

```
wakeguard-ai/
├── index.html       # main UI
├── style.css        # styling
└── js/
    ├── monitor.js   # detection logic, camera, audio
    └── app.js       # UI and navigation
```

## Notes

- Works best in good lighting
- Tested on Chrome and Edge (Firefox may have occasional issues with MediaPipe WASM)
- Allow camera permissions when prompted
