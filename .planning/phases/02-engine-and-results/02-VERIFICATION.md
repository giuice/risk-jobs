---
phase: 02-engine-and-results
verified: 2026-03-17T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
human_verification:
  - test: "Load index.html in a browser, select a profession and a years-of-experience range, click the CTA, and observe the results reveal"
    expected: "Cards appear with staggered fade-in (opacity + translate), gauge needle rotates from -90deg to target angle with 900ms cubic-bezier animation; no CRT scanlines or glitch text (those are Phase 3)"
    why_human: "CSS transitions and requestAnimationFrame needle animation cannot be observed via grep; visual smoothness and absence of jank require browser rendering"
  - test: "On the results screen, verify the roast message is meaningfully different for at least two distinct profession + seniority combinations (e.g., software-developers/senior vs medical-transcriptionists/junior)"
    expected: "Each combination shows an opener specific to the profession, a middle specific to the risk band, and a closer specific to the seniority level — 84 unique composite strings"
    why_human: "String composition correctness can be verified programmatically (and was, via the vm harness), but the tone and specificity ('playful-cruel') judgment requires human reading"
  - test: "Click Try Again, select a different profession and seniority, click CTA again"
    expected: "All result fields reset to stub values before the new result renders; gauge needle returns to -90deg before animating to the new position; no stale values leak between runs"
    why_human: "DOM reset between runs requires visual confirmation that no flicker of stale data appears during the requestAnimationFrame gap"
---

# Phase 2: Engine and Results Verification Report

**Phase Goal:** Entering any profession and years of experience produces a correct, formula-driven countdown, gauge position, and roast message — all verified against the full 21x4 output matrix before any copy is finalized
**Verified:** 2026-03-17T00:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | Every combination of occupation (21) and seniority level (4) produces a non-negative adjusted score and shelf-life value | VERIFIED | `node scripts/verify-phase-2-results.js` exits 0: 84 rows, all adjustedScore 0..10, shelfLifeYears 0..12; known-output checks pass for 3 anchor cases |
| 2  | Countdown timer displays years, months, and days computed from shelf-life | VERIFIED | DOM targets `#countdown-years`, `#countdown-months`, `#countdown-days` exist and are populated in `showResults(result)` via `String(result.countdown.years/months/days)`; `software-developers/years-6-9` yields 4y 9m 22d correctly |
| 3  | SVG gauge needle animates to the correct position on results reveal | VERIFIED | `#gauge-needle` `<g>` element present, `rotate(-90deg)` reset on reveal, `rotate(result.risk.needleAngle + 'deg')` set inside `requestAnimationFrame`; `transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1)` confirmed in CSS |
| 4  | Roast message appears and is specific to the profession/seniority combination | VERIFIED | `buildRoast` composes `ROAST_OPENERS[occupation.id] + ROAST_MIDDLES[riskBand.key] + ROAST_CLOSERS[seniority.id]`; 21 openers * 5 middles * 4 closers = 420 possible combinations, 84 unique per matrix; vm harness asserts every `roast` is a non-empty string |
| 5  | User can click Try Again to return to input form and receive a fresh result | VERIFIED | Try Again handler calls `resetResultState()` then `showInput()`; `resetResultState()` nulls `lastResult`, removes `results-visible`, resets all 8 DOM targets to stub values, resets needle to `rotate(-90deg)` |

**Score: 5/5 truths verified**

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | Pure ENGINE pipeline + results UI + CTA/retry wiring | VERIFIED | 742 lines (exceeds 520 minimum from plan 02-02); all 8 engine helpers present; all 9 DOM targets present; no DOM access inside ENGINE block |
| `scripts/verify-phase-2-results.js` | Node-only 84-row verification harness | VERIFIED | 161 lines (exceeds 80 minimum); exits 0; prints "Phase 2 matrix verified: 84 rows, 67 numeric collision(s) (expected under locked score table)" |
| `.planning/phases/02-engine-and-results/02-result-matrix.json` | Deterministic 84-row result artifact | VERIFIED | 1855 lines; contains `"matrixSize": 84`, `"occupationCount": 21`, `"seniorityCount": 4`, `"numericCollisionCount"` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `OCCUPATIONS` and `SENIORITY_LEVELS` | `buildResultModel` | `getOccupationById` / `getSeniorityByExperienceId` lookup helpers | WIRED | Both functions present in ENGINE block; `getSeniorityByExperienceId` matches on `level.experienceId === experienceId`; `experienceId` fields on all 4 seniority levels confirmed |
| Experience-range selection (`selectedExperience`) | `calculateAdjustedScore` | `buildResultModel` resolves seniority via `getSeniorityByExperienceId(experienceId)` before score math | WIRED | `getSeniorityByExperienceId(experienceId)` call at line 562 inside `buildResultModel`; null-guard returns null if lookup fails |
| `calculateAdjustedScore` | `calculateShelfLifeYears` and `getRiskBand` | `adjustedScore` value passed through pipeline | WIRED | `calculateShelfLifeYears(adjustedScore)` and `getRiskBand(adjustedScore)` called sequentially inside `buildResultModel` |
| `buildResultMatrix` | `OCCUPATIONS x SENIORITY_LEVELS` | Nested iteration over both locked arrays | WIRED | `OCCUPATIONS.forEach` outer loop, `SENIORITY_LEVELS` inner loop (via `flatMap`/`map` pattern); matrix size asserted as 84 by vm harness |
| CTA click handler | `buildResultModel` | `buildResultModel(selectedOccupation, selectedExperience)` then `showResults(result)` | WIRED | Lines 728-731: `var result = buildResultModel(selectedOccupation, selectedExperience); if (result) { showResults(result); }` |
| `showResults(result)` | Results DOM targets | `textContent` assignments + needle transform | WIRED | All 8 targets populated: `result-job-name`, `countdown-years`, `countdown-months`, `countdown-days`, `risk-label`, `risk-score`, `roast-message`, plus needle `rotate(result.risk.needleAngle + 'deg')` |
| Try Again click handler | Fresh rerun state | `resetResultState()` and `showInput()` | WIRED | Lines 733-736: `resetResultState(); showInput();` |
| `scripts/verify-phase-2-results.js` | `index.html` ENGINE/DATA | Regex extraction of `===== DATA =====` and `===== ENGINE =====` blocks | WIRED | Both section markers found in script (2 occurrences of ENGINE pattern confirmed) |
| `buildResultMatrix` | `02-result-matrix.json` | Script writes normalized rows with `matrixSize`, `numericCollisionCount`, `rows` | WIRED | JSON artifact exists with all required top-level fields |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CALC-01 | 02-01, 02-03 | System maps years of experience to seniority level (0-2=Junior, 3-5=Mid, 6-9=Senior, 10+=Architect) | SATISFIED | `experienceId` fields on all 4 seniority records; `getSeniorityByExperienceId` implements the mapping |
| CALC-02 | 02-01, 02-03 | System calculates adjusted exposure score: BaseScore - (Slevel x 1.5) | SATISFIED | `calculateAdjustedScore`: `Math.max(0, Math.min(10, baseScore - (slevel * 1.5)))` at line 535 |
| CALC-03 | 02-01, 02-03 | System converts adjusted score to shelf life (estimated years until replacement) | SATISFIED | `calculateShelfLifeYears`: `Math.max(0, Math.min(12, (10 - adjustedScore) * 1.2))` at line 539 |
| CALC-04 | 02-01, 02-03 | Adjusted score is clamped to 0-10 range | SATISFIED | `Math.min(10, ...)` and `Math.max(0, ...)` in `calculateAdjustedScore`; vm harness asserts `adjustedScore >= 0 && <= 10` for all 84 rows |
| RES-01 | 02-02 | User sees countdown timer showing years, months, and days until AI replacement | SATISFIED | DOM targets `countdown-years`, `countdown-months`, `countdown-days` populated from `result.countdown` |
| RES-02 | 02-02 | User sees animated risk gauge meter (safe to doomed scale) | SATISFIED | SVG gauge with `viewBox="0 0 240 160"`, `#gauge-needle` with CSS transition, SAFE/DOOMED edge labels present |
| RES-03 | 02-01, 02-02, 02-03 | User sees playful-cruel roast message specific to profession and seniority | SATISFIED | `buildRoast` composites profession-specific opener + risk-band middle + seniority closer; `#roast-message` populated |
| RES-04 | 02-02 | Results appear with dramatic glitch/CRT reveal animation | PARTIAL — see human verification | Lightweight opacity/transform staggered reveal implemented; plan 02-02 explicitly deferred glitch/CRT to Phase 3 (which carries VIS-03/VIS-04); ROADMAP Phase 2 SC does not require CRT — only "SVG gauge needle animates to correct position"; REQUIREMENTS.md marks this `[x] Complete` |
| RES-05 | 02-02 | User can click Try Again to reset and try another profession | SATISFIED | `resetResultState()` + `showInput()` fully implemented; DOM reset verified at lines 698-711 |

**Note on RES-04:** REQUIREMENTS.md marks RES-04 as `[x] Complete` for Phase 2 and ROADMAP Phase 2 Success Criteria make no mention of CRT/glitch effects (that language appears in Phase 3 SC #3). Plan 02-02 explicitly stated "no scanlines, no glitch text, no CRT spectacle" as intentional Phase 2 scope. The current implementation delivers a staggered opacity/transform reveal which satisfies the ROADMAP's Phase 2 contract. Full CRT/glitch treatment is deferred to Phase 3, which is the correct sequencing. The "dramatic" qualifier in RES-04 requires human judgment.

---

### Anti-Patterns Found

No anti-patterns detected.

| File | Pattern | Severity | Notes |
|------|---------|----------|-------|
| `index.html` | No TODOs, FIXMEs, placeholder returns, or empty handlers | — | Clean |
| `scripts/verify-phase-2-results.js` | No anti-patterns | — | Clean |

---

### Human Verification Required

#### 1. Results Reveal Animation

**Test:** Load `index.html` in a browser, select a profession and years-of-experience range, click the CTA button.
**Expected:** Three result cards appear in staggered sequence (countdown at 0ms, gauge at 80ms, roast at 160ms) using opacity + translateY transition; gauge needle rotates from -90deg (fully left/safe) to the computed angle with a 900ms cubic-bezier ease; no CRT scanlines or glitch text (those are Phase 3).
**Why human:** CSS transitions and the `requestAnimationFrame` needle animation require browser rendering to observe. Visual smoothness, absence of jank, and correct stagger timing cannot be verified via static analysis.

#### 2. Roast Message Specificity

**Test:** Select three distinct combinations (e.g., `medical-transcriptionists/0-2 yrs`, `software-developers/6-9 yrs`, `other/10+ yrs`) and read the roast messages.
**Expected:** Each message is unique and composed of a profession-specific opener, a risk-band-appropriate middle, and a seniority-specific closer. The tone is "playful-cruel" per project requirements.
**Why human:** The vm harness asserts non-empty strings for all 84 combinations, but qualitative tone and specificity judgment requires a human reader.

#### 3. Try Again State Reset (Visual)

**Test:** Get a result, note the values, click Try Again, select different inputs, click CTA again.
**Expected:** All fields visibly reset to `--` or `0` before the new result renders; no stale job name, countdown, or roast text is briefly visible during the `requestAnimationFrame` gap.
**Why human:** The `resetResultState()` implementation is verified by code inspection, but the visual appearance of the transition between results requires browser observation to confirm no flicker.

---

### Gaps Summary

No automation-verifiable gaps. All 5 ROADMAP Phase 2 Success Criteria are met:
- 84-row matrix verified by Node harness with correct known-output anchor values
- Countdown DOM targets populated from engine output
- SVG gauge needle wired to `result.risk.needleAngle` with CSS transition
- Roast messages composited and rendered for all 84 combinations
- Try Again flow fully implemented with complete DOM reset

The three items above require human visual verification of browser-rendered behavior. They are not blockers — the code is correctly wired — but they cannot be confirmed by static analysis alone.

---

_Verified: 2026-03-17T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
