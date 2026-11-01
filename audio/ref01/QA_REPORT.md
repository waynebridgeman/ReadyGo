# REF01 automated audio quality review

**Source:** 19 trimmed WAV clips from the ReadyGo REF01 production package; GO08 ("And go!") excluded.

**Format check:** all 19 files are 48,000 Hz, mono, signed 16-bit PCM WAV.

**Signal analysis (full-clip):**
- Peak amplitudes range from approximately **−13.2 dBFS to −6.8 dBFS**, leaving peak headroom.
- Whole-file RMS ranges approximately **−27.8 dBFS to −25.6 dBFS** (about 2.2 dB spread). This metric includes trailing silence and is **not perceptual loudness normalization**.
- No samples above 99.9% full scale were found in the supplied 19-file package.
- Each file contains nonzero audio and has the required PCM header.

**Limitations:**
- These checks do not confirm the naturalness of each referee delivery, whether the initial "G" is clipped, or whether perceived loudness is consistent.
- The nominal 12 ms offset in the production manifest is an approximate waveform trim reference, **not a verified perceptual, acoustic, or hardware output-onset measurement**. Soft attacks may take longer to become clearly audible.
- The app's reported response times remain experimental until audio-output delay and camera measurement delay are calibrated on the intended device.

Manual listening QA and iPhone timing tests remain release blockers. Automated CI now rejects missing, malformed, silent, or digitally clipped REF01 recordings.
