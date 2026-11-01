# ReadyGo — armwrestling referee recognition trainer

**Production:** v0.5.0 public beta at https://waynebridgeman.github.io/ReadyGo/

**Development:** v0.6 mobile usability, audio-library foundation, and referee recording studio. Preview is separately deployed under `/beta/v060/`; `main` production homepage is unchanged by the v0.6 work.

## Two core training modes
- **Camera Mode:** live camera, hand/wrist landmark tracking and center calibration, false starts and approximate movement reaction timing, displayed over the camera. Never replace this with frame-wide motion scoring.
- **Audio-Only:** auditory focus and explosive-hit practice. Never report physical reaction time or false starts.

Sessions run 10–100 trials in steps of 10, with automatic two-second progression and no manual next-trial interaction. The 19 approved-to-develop REF01 recorded GO cues form the current baseline, with `GO08` intentionally excluded.

## Roadmap / new voices
- [Roadmap to v1.0](docs/ROADMAP_TO_V1.md)
- [Human referee recording script and guide](docs/AUDIO_RECORDING_GUIDE.md)
- [Versioned audio catalog](audio/catalog.json)
- [Referee Recording Studio](recorder/) — records locally in browser and exports a ZIP of original takes plus JSON metadata. It does not upload audio automatically.

### Recording next
Begin with REF02: 10 isolated GO commands, 3 takes each of READY, SET, CENTER, ELBOW DOWN and DON'T MOVE. Separate files, natural delivery, quiet room, speaker permission. The studio creates filenames and exports all takes together. REF03 and complete setup/reset coverage follow.

**The new audio catalog is a staging specification, not yet the runtime playback source.** The existing REF01 engine stays intact until new referee sequences have been recorded, verified and integrated.

## Automated checks
```bash
node tests/smoke.cjs
node tools/validate-audio-catalog.cjs
node tests/session.cjs
npm install
node tests/browser.cjs
```

GitHub Actions runs these for pull requests. Chrome simulator tests do not replace physical iPhone acceptance tests.

## Shipping discipline
Develop on feature branches; review tests and audio QA; publish separate HTTPS beta; perform physical iPhone testing; then merge. Audio-output/camera latency still need external calibration before making claims about millisecond-accurate or competition-certified timing. Authentically recorded human voices must not be represented as synthetic, and synthetic voice placeholders must be clearly disclosed.
