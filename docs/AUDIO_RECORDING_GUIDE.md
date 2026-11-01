# ReadyGo human referee recording guide

## Why
For v1.0, **19 GO recordings from REF01 are the starting point, not the whole library**. The app needs natural human setup commands, resets, true timing variability, and different referee voices. Avoid generating pretend human-referee claims from synthetic speech.

## Recommended v1.0 English audio target

| Asset | Per referee | Three-referee total |
|---|---:|---:|
| GO (isolated) | 20 unique takes | 60 |
| Setup / adjustments (8 phrases × 4 takes) | 32 | 96 |
| Reset / interruption (4 phrases × 3 takes) | 12 | 36 |
| **Total individual utterances** | **64** | **192** |

REF01 already has **19 of its 20 isolated GO takes**. We can start with **REF02 and REF03**; the remaining setup/rest commands from REF01 can be captured later without blocking v0.6.

This is a target rather than a fixed quota: quality, natural pacing and distinct referee styles matter more than hitting a particular count.

### Standard English phrase list (review with active competition referees)
Record each *as its own file*, without baked-in silence or preceding/following phrases:

| Code | Spoken command | Category | Takes per referee |
|---|---|---|---:|
| GO | "GO!" | Trigger | 20 |
| READY | "Ready." | Setup | 4 |
| SET | "Set." | Setup | 4 |
| CENTER | "Center." | Setup | 4 |
| ELBOW | "Elbow down." | Adjustment | 4 |
| WRIST | "Wrist." | Adjustment | 4 |
| CLOSE | "Close your hands." | Adjustment | 4 |
| DONT_MOVE | "Don't move." | Discipline | 4 |
| SHOULDERS | "Square your shoulders." | Adjustment | 4 |
| RESET | "Reset." | Reset | 3 |
| BACK | "Bring it back." | Reset | 3 |
| STOP | "Stop." | Interruption | 3 |
| AGAIN | "Again." | Repeat | 3 |

**Important:** Official command choice and order vary by league and referee. Treat this as a training library, not an assertion of universal competition rules. Before publication, verify each phrase and sequence with active referees from the targeted competition formats; avoid irrelevant instructions.

### Delivery variations
- Neutral, controlled, sharp, explosive, quiet-but-clear, and legitimately shouted.
- Authentic delivery variation, not artificial random pitch/speed adjustments that sound robotic.
- Some abrupt GO starts and some deliberate sustained vowels; preserve attack and onset.
- Record multiple natural setups with repeated corrections; the **engine** assembles phrases with randomized pauses.
- **GO-only files must contain GO only.** Do not include "And GO", "Ready GO" or a countdown in a trigger file. Those belong in separate phrase categories and require their own GO onset metadata if supported.

## Capture procedure
1. Obtain each referee's permission to record and to distribute their performance as part of ReadyGo. Keep a simple written release; do not imply affiliation with a federation or event.
2. On iPhone, use Voice Memos or another lossless-capable app, ideally an external mic. Record in a quiet indoor space, with a consistent mic distance and no automatic noise suppression when possible.
3. Keep each referee's session continuous at the raw capture stage; call out an identifying slate *between takes*, not inside utterance files.
4. Record 3–5 warm-up commands; vary intensity as in a real armwrestling match. Watch for plosives clipping close microphones.
5. Export originals without modifications (M4A/WAV accepted). **Do not manually trim GO consonants.** We'll keep originals archival and create normalized/trimmed production copies.
6. Filename originals `REF02_GO_take01.m4a`, `REF02_READY_take01.m4a`, etc. Make a new referee ID for each distinct voice.
7. Upload a batch of 10–25 recordings when convenient. Keep a note of actual spoken phrase, variation, referee ID and consent.
8. Review initial takes for intelligibility and unusual room noise before recording the full library.

## Processing & QA policy
- Source files stay untouched; derived production WAVs: **mono, 48 kHz, 16-bit PCM**.
- Trim only leading dead silence using waveform listening confirmation with a 10–15 ms protective margin.
- Store **GO onset offset in milliseconds per file**, *after* production trimming; do not assume every take has 12 ms.
- Use peak and loudness QA. Compare perceived level using LUFS (where supported), but preserve natural dynamic differences.
- Flag clipped plosives, unintelligible phrases, excessive reverb, lip smacks, electrical hum, and background chatter in cue files.
- Randomization excludes flagged/rejected/uncalibrated takes from Camera Mode's timing-critical GO pool.
- Measure real device-output onset and camera-frame latency separately. Audio trimming alone cannot certify reaction-time measurement.

## Venue audio (independent source)
Record or license with permission at least 6–12 ambience beds of 30–90 seconds: crowd murmur, side-table chatter, match announcer distant, chair movement, applause, and moderately loud competition ambience. Avoid identifiable conversations, copyrighted event audio and unauthorized recordings.
Keep ambience as a **separate audio layer**; never mix it permanently into referee command files. Make sure GO is still discernible.

## Priority recording order
1. REF02: 10 GO + READY / SET / CENTER / ELBOW / DONT_MOVE (3 takes each).
2. REF02: remaining GO and reset/adjustment set, then verify one complete sequence.
3. REF03: repeat same process with genuinely different voice and cadence.
4. REF01: record setup, correction and reset phrases to complete original referee.
5. Capture crowd beds and optional REF04 voices only after the core three are usable.

## Next action for contributors
Use the checklist above to record REF02's **first 10 isolated GO takes** and **15 setup takes**. Upload original media without cleanup. This is enough to exercise the new multi-referee engine and identify issues early, well before the full library is complete.
