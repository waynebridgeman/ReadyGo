# REF01 audio integration (v0.5.0 draft)

Place the 19 WAV assets from ReadyGo_REF01_Production_19_GO.zip under `audio/ref01/` with names `GO01_trimmed.wav` through `GO20_trimmed.wav`, excluding `GO08_trimmed.wav`. The application preloads them at session start, selects randomly, and avoids immediately repeating the same take. If no clips load, browser speech remains a fallback.

## Important validation
- The recorded GO start is scheduled using Web Audio clock and a nominal 35 ms lead. This is **not** calibrated acoustic output latency. Do not claim millisecond-accurate reaction measurements until device-level validation.
- Setup commands still use speech synthesis. Their timing must be reviewed to avoid overlap with GO.
- Camera tracking and fallback remain unchanged. The experimental whole-frame fallback must not be presented as reliable hand/wrist timing.
- Test all session lengths 10–100 on iPhone, including automatic 2-second trial advancement, early movement, stop/restart, and missing assets.
- This branch contains the playback code, not yet the binary WAV assets. Add those before merging.
