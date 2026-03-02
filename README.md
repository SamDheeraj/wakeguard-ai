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

==================================================
GITHUB PAGES HOSTING INSTRUCTIONS
==================================================

Once your code is on GitHub, here is exactly how to run this project perfectly 
live on the internet for free using GitHub Pages:

### Step 1: Enable GitHub Pages
Because your project is pure HTML, CSS, and Vanilla JavaScript (no complex backends), 
it runs directly on GitHub.

1. Go to your GitHub repository in your web browser.
2. Near the top right, click on the **Settings** tab.
3. On the left sidebar menu, scroll down to the 'Code and automation' section and click **Pages**.
4. Under the **"Build and deployment"** setup area:
   - For **Source**, ensure it says 'Deploy from a branch'.
   - Under **Branch**, change 'None' to **main**.
   - Leave the folder dropdown as '/ (root)'.
5. Click the **Save** button.

### Step 2: Wait for Deployment
1. GitHub will automatically start building your live website.
2. Click the **Actions** tab at the top of your repo. You will see a workflow running.
3. Wait 30 seconds to 1 minute until this turns into a green checkmark.

### Step 3: View Your Live Website
Once it completes:
1. Go back to the **Settings > Pages** menu.
2. At the top of the page, a new section will appear saying: 
   "Your site is live at: https://[YourUsername].github.io/[RepositoryName]"
3. Click that link!

### Why this works perfectly "as is"
Because this is a Vanilla HTML/JS/CSS app, GitHub immediately serves the `index.html` file 
right away, handling all the complex Mediapipe WebAssembly logic right in the browser. 
Furthermore, unlike opening an HTML file directly from your computer, GitHub provides an 
https:// secured URL, meaning the browser will securely perfectly allow webcam access 
identical to your local test environment.
