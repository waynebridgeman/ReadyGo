# ReadyGo roadmap — v0.6 to 1.0

## Product promise
Help armwrestlers practice **hearing the referee, holding center without false starts, and reacting decisively to the audible GO**. Mobile-first. Natural human referee speech. Useful feedback without claiming competition-grade precision until device calibration is established.

## Non-negotiables
- **Camera Mode remains available in every release.** Always display the live camera while training; track the hand/wrist near a calibrated ready position, not whole-body frame motion.
- False start = hand/wrist displacement from calibrated center **before the audible GO**. Report valid, false, missed and untracked trials separately.
- Camera overlay must show current command, GO, false/valid status, and approximate reaction timing.
- **Audio-Only** trains listening discipline and explosive response but reports **no measured physical reaction time or false starts**.
- Sessions allow 10–100 trials in 10-trial steps, auto-advance after 2 seconds, and never require a Next Trial click.
- Never misrepresent timing precision or mislabel a synthetic voice as a referee recording.
- Maintain staged development branch, automated checks, separate HTTPS beta, physical iPhone acceptance test, then production promotion.

## v0.6 — Practical training and audio foundations
**User experience**
- Simplified mobile setup with one obvious Start action, a camera-first large visual stage, legible overlays and minimum on-screen chrome during drills.
- Clear status for camera permissions, hand visibility, calibration, real-audio availability and GO timing confidence.
- Preflight checklist before Camera Mode: camera visible, hand detected, center calibrated, ref audio loaded.
- Larger targets and safe-area spacing for iPhone; dark/high-contrast visual language.
- Session completion summary: valid, false, missed, average and median approximate reaction times, untracked/uncalibrated trials; Audio-Only gets auditory session completion only.
- Separate UI views for Setup / Session / Summary so controls are not cramped around the camera.

**Audio architecture**
- Introduce versioned audio catalog with referee identity, command type, take, locale, source, onset metadata, safety and QA state.
- Randomize **whole referee voices** and natural setup sequences; never abruptly switch voices mid-sequence unless simulation explicitly enables multiple referees.
- Cache/preload near-term assets. Real spoken setup phrases replace browser TTS as they arrive; do not require an entire future library to keep REF01 functional.
- Enforce event-based command sequencing, cancellable playback, GO cue timestamp, and randomized real pauses instead of word-duration assumptions.
- Provide ingestion and QA checks for future WAV recordings without touching existing working assets.

## v0.7 — Authentic competition environment
- At least **three distinct human referee profiles** with complete setup and GO phrase sets, including resets and repeats.
- High-quality authentic crowd/venue ambience recorded with permission, mixing presets from clean through noisy.
- Referee delivery variety (calm, loud, clipped, drawn-out, abrupt), intelligibility levels and dynamic cadence.
- Endurance and competition drill presets with false-start feedback and believable reset flow.
- Use measured loudness matching, safe peak headroom, no aggressive leveling that removes referee individuality.

## v0.8 — Trustworthy camera measurements
- Track wrist + stable hand landmarks, camera frame timestamps and direction of movement away from center.
- Hold calibration for several frames, display confidence, and mark trials **UNTRACKED** on occlusion, motion blur or lost hands.
- Test sensitivity at tabletop angles and left/right handed use; prevent noisy false triggers using temporal hysteresis.
- Record visual response timestamps in the same clock domain as scheduled audio where possible, note browser-output latency uncertainty.
- Device-level repeatability test on iPhone; avoid marketing a certified reaction time absent external calibration.

## v0.9 — Polish and prelaunch
- Visual system: purposeful dark arena aesthetic, red for stop/false-start, green for valid, accessible contrast; subtle purposeful animation.
- True mobile responsive design, safe-area insets, large tap targets and optional screen wake lock (where supported).
- Home-screen installation/PWA and offline-ready audio only after explicit caching tests and update/eviction controls.
- Local-only training history & trends, export CSV, deliberate privacy controls and no camera video upload.
- Accessibility: captions/command text optional (hidden for strict audio recognition drills), reduced motion, volume warnings.
- Battery/thermal stress and 100-trial endurance testing on physical iPhone.

## v1.0 release criteria
- All core modes and trial lengths pass reproducible iPhone acceptance tests.
- No missed/truncated commands, speech overlap, ghost timers, or misleading reaction scores in the chosen test matrix.
- Three human referee voices offer complete, consistent setup-to-GO workflows; environmental audio has verified rights.
- True hand/wrist center calibration, reliable false-start discrimination and clear invalid/untracked trial handling.
- Polished Setup → Train → Results UX with legible controls; usable at normal training distance from the table.
- Recorded GO timing uncertainty is accurately disclosed; any more precise accuracy claim requires external calibration.
- Automated syntax, asset, session, Chrome and iPhone checks green and release notes/rollback prepared.

## Decisions
- v1.0 English-first authentic full referee pack; additional supported languages only after native-referee audio and sport-specific validation.
- PWA/iPhone web app is the primary shipping surface until native-device requirements justify Swift/Android builds.
- Preserve REF01's 19 GO takes (GO08 excluded) as the known working baseline.

## Scope guard
Prefer completing a smaller, reliable set of features before adding badges, leaderboards, social features, sign-in, server accounts, paywalls or unsupported reaction-time claims.
