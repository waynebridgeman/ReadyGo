# ReadyGo v0.5.0 (release candidate, not yet deployed)

ReadyGo is a browser-based armwrestling referee-cue training app designed for mobile Safari and modern desktop browsers. This branch is a **development release**, not a native iOS application. The live `main` branch remains at the previous release.

## Modes
- **Camera Mode:** live camera, MediaPipe hand/wrist landmarks, ready-position calibration, false-start detection, approximate visual reaction-time scoring and on-camera session feedback. Requires active landmark tracking. A whole-frame fallback exists for visual diagnostics but cannot generate valid scores.
- **Audio-Only Mode:** referee listening/discipline and explosive-hit practice. Does **not** measure physical reaction time or false starts. Switching to Audio-Only turns off the camera.

## Referee audio
- REF01 includes **19 genuine GO recordings** at `audio/ref01/GO01.wav` through `GO20.wav`, excluding `GO08.wav` (which contained "And go!").
- WAV assets are preloaded before each session, shuffled across trials and never repeated on immediately consecutive selections. Browser speech can fall back when the recorded files fail to load.
- The audible GO and on-screen GO indicators are scheduled together. The REF01 clips have an estimated 12 ms lead-in after trimming, **not** verified microphone-level or hardware-calibrated latency.
- Setup commands remain temporary English speech synthesis. Other languages are disabled until verified native audio exists.

## Sessions
- Select 10, 20, ... 100 trials.
- Two-second automatic advancement after each completed attempt. No manual Next Trial click.
- Progressive and competition timing profiles, strict and aggressive setup sequences, and optional synthesized background noise.

## Development testing
- `node tests/smoke.cjs`: validates JS syntax, GO assets, endurance options, and hand-scoring guard.
- `node tests/session.cjs`: deterministic Audio-Only 10-trial simulation with recorded playback, speech fallback, and stop behavior.
- `npm install && node tests/browser.cjs`: headless Chrome test of WAV loading/playback, automatic progression, stopping, and simulated hand-landmark false/valid starts.

The GitHub Actions pull-request workflow runs all three checks. Browser hand landmarks in the test are simulated; the tests do **not** certify real camera tracking or response-time accuracy.

## Before merge
1. Test a 10-trial and 100-trial session on physical iPhone Safari (camera permissions, audio routing, volume, screen lock, and stop/restart).
2. Verify actual GO onset and audio-output latency with a controlled timing reference; compare timestamps to camera capture latency.
3. Manually listen to each of the 19 WAV recordings for clipped consonants and loudness disparities.
4. Verify MediaPipe tracking, calibration, false starts, hand occlusion, and device heating/battery impact.

**Keep pull request #1 as a draft until these device-level checks pass.**
