# REF01 audio integration (v0.5.0 draft)

Place the 19 WAV assets from ReadyGo_REF01_Production_19_GO.zip under `audio/ref01/` with names `GO01.wav` through `GO20.wav`, excluding `GO08.wav`. The application preloads them at session start, selects randomly, and avoids immediately repeating the same take. If no clips load, browser speech remains a fallback.

## Important validation
- The recorded GO start is scheduled using Web Audio clock and a nominal 35 ms lead. This is **not** calibrated acoustic output latency. Do not claim millisecond-accurate reaction measurements until device-level validation.
- Setup commands still use speech synthesis. Their timing must be reviewed to avoid overlap with GO.
- Camera tracking and fallback remain unchanged. The experimental whole-frame fallback must not be presented as reliable hand/wrist timing.
- Test all session lengths 10–100 on iPhone, including automatic 2-second trial advancement, early movement, stop/restart, and missing assets.
- This branch contains the playback code, not yet the binary WAV assets. Add those before merging.

## Review checklist (not yet device-tested)
- Verify all 19 WAV requests return HTTP 200 and decode in Safari.
- Verify recorded GO is audible and setup TTS does not overlap.
- Test early movement before GO, valid movement after GO, and no movement for 2.2 seconds.
- Test 10 and 100 trial sessions, automatic 2-second transition, and stop/restart mid-session.
- Test camera permission denial and MediaPipe model failure: scoring must not start.
- Compare measured reaction with external high-speed video or a controlled timing fixture before claiming accuracy.
- Keep PR as draft until manual tests pass.
