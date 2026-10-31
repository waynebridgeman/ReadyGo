READYGO v0.4 — Integrated prototype

WHAT'S NEW
- Brings the training engine and camera mode together.
- Progressive Training and Competition Simulation.
- Strict Progression and Aggressive Referee styles.
- Stateful command sequences with repeats and returns to earlier setup commands.
- Camera Mode with ready-position calibration and hand landmark tracking (MediaPipe loaded from a CDN).
- Experimental frame-motion fallback if the hand landmark model cannot load.
- Audio-only mode for auditory discipline; it does not score physical reaction time or false starts.
- English command audio plus a multilingual language selector scaffold.

IMPORTANT LIMITATIONS
- Browser speech synthesis is still a temporary voice placeholder, not authentic referee recordings.
- Generated background noise is not real competition crowd audio.
- Camera tracking is a prototype, not a certified measurement system. Results depend on camera angle, lighting, device performance, and hand visibility.
- Reaction timing is referenced to the browser speech-synthesis start event, not verified acoustic onset. Do not treat it as competition-grade timing.
- Only English command flow is fully implemented in this prototype. Other language selections are scaffolding and need native referee validation.
- The fallback motion detector is experimental and is not hand/wrist tracking.
- MediaPipe requires internet access in the browser to load its model assets.

DEPLOY
1. Extract the ZIP.
2. Upload index.html to the root of your existing GitHub Pages repository, replacing the old index.html.
3. Commit the change.
4. Wait for the Pages deployment to complete, then hard-refresh the site (Ctrl+Shift+R).

For camera access, use the HTTPS GitHub Pages URL and allow camera permission.
