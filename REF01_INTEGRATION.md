# REF01 integration — v0.5.0 draft

## Asset status: COMPLETE
The branch contains 19 individually trimmed, mono WAV assets under `audio/ref01/`: `GO01.wav`–`GO07.wav` and `GO09.wav`–`GO20.wav`. `GO08.wav` ("And go!") is deliberately excluded.

The audio engine preloads each clip, selects a randomized take without immediate repetition, and schedules GO playback using Web Audio. The REF01 production manifest estimates 12 ms from each WAV's first sample to the audible GO onset. This is a **waveform-based estimate only**, not an output-hardware calibration. Web Audio output timestamps are used where available, with performance-clock estimation as the fallback.

## Automated tests: PASSING (Chrome simulated)
- JavaScript syntax and all 19 WAV presence and RIFF/WAVE headers.
- Audio-Only 10-trial simulation, fallback speech, no false-start or reaction-time scoring.
- Chrome loads/decodes 19 WAVs and plays a recorded GO.
- Automatic two-second transition and clean cancellation after Stop.
- Simulated MediaPipe hand landmarks: early displacement produces FALSE START and post-GO displacement produces a valid timed result.
- Camera access turns off on switch to Audio-Only.

## Release blockers: PHYSICAL DEVICE VALIDATION
- Check 10 and 100 trial sessions in iPhone Safari, including speaker versus Bluetooth output and volume adjustments.
- Confirm GO audible onset and reaction-time reference with an external fixture/high-speed reference; mobile audio and camera latency can affect scores.
- Manually listen to all 19 WAV files for trimmed consonant attacks and level consistency.
- Test actual MediaPipe GPU/CPU fallback, camera calibration, hand tracking near the table, occlusion, lighting, and low-power conditions.
- Validate microphone/camera permissions and reliable cleanup on backgrounding/returning to app.

**Do not merge this PR into main until the real-device checks are completed.** The automated test's hand movement is synthetic, not a physical-camera accuracy result.
