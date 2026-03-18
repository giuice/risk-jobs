# Phase 2: Engine and Results - Research

**Researched:** 2026-03-17
**Status:** Ready for planning

## What Planning Needs To Respect

- The app remains a single self-contained `index.html` with inline CSS and JS only. Dev-only verification scripts are acceptable outside the shipped app, but runtime code must stay dependency-free.
- `ENGINE` must stay pure. No DOM access, no element lookups, no view toggling, and no animation logic inside the calculation layer.
- Phase 2 is about correct result generation and a functional results reveal. Full glitch/CRT spectacle, scanlines, and screenshot-grade polish remain Phase 3 work.
- The existing profession list and four seniority buckets are already locked. Phase 2 should build on those structures instead of replacing the input model.

## Upstream Data Note

- The public visualizer at `https://karpathy.ai/jobs/` is backed by the open repository `https://github.com/karpathy/jobs`, which exposes the underlying occupation and AI-exposure data files directly.
- For future score refreshes or list expansion, prefer the repo artifacts such as `scores.json`, `occupations.json`, and `site/data.json` over scraping the live visualization UI.
- Planning implication: the current app can keep its curated subset for v1, but the Karpathy repo is the canonical upstream reference if the occupation list or exposure scores need to be reconciled later.

## Key Planning Findings

### 1. The roadmap's "distinct adjusted score" phrase is not literally achievable

The locked base-score table contains repeated values (`9`, `8`, `7.5`, `8`, etc.), so the fixed formula from `.planning/PROJECT.md` cannot produce 84 globally unique adjusted scores or shelf-life values across 21 x 4 combinations.

Planning implication:
- Treat the requirement as "every combination must produce a deterministic, valid output row that is included in the verification matrix."
- Preserve profession-specific output by making the roast composition specific to the profession and seniority, even when numeric outcomes collide.
- Verification should surface collisions as expected behavior under the locked score table, not as engine failures.

### 2. `RES-04` conflicts with Phase 3 scope and should be handled minimally

`REQUIREMENTS.md` still says results appear with a glitch/CRT reveal, but `.planning/ROADMAP.md` and `.planning/phases/02-engine-and-results/02-CONTEXT.md` explicitly defer the heavy visual treatment to Phase 3.

Planning implication:
- Phase 2 should implement a lightweight reveal only: class-based opacity/transform entrance plus the gauge-needle transition.
- Do not spend plan budget on scanlines, glitch text, or animation-heavy spectacle in this phase.

## Recommended Engine Shape

The cleanest Phase 2 split is a pure result-model pipeline plus a thin UI adapter.

Because Phase 1 locked the input as a four-button years-of-experience range selector, `CALC-01` should be implemented as an explicit mapping from the chosen range id to the seniority bucket used by the formula, not as a direct `selectedSeniority` shortcut in the UI.

Recommended pure functions in `ENGINE`:
- `getOccupationById(occupationId)` -> occupation record or `null`
- `getSeniorityByExperienceId(experienceId)` -> seniority record or `null`
- `calculateAdjustedScore(baseScore, slevel)` -> clamped `0..10`
- `calculateShelfLifeYears(adjustedScore)` -> linear, punishing, readable output
- `splitShelfLife(shelfLifeYears)` -> `{ years, months, days, totalDays }`
- `getRiskBand(adjustedScore)` -> `{ key, label, colorVar, needlePercent, needleAngle }`
- `buildRoast(occupation, seniority, riskBand)` -> placeholder but specific string
- `buildResultModel(occupationId, experienceId)` -> full result payload consumed by UI
- `buildResultMatrix()` -> all 84 result rows for verification

Recommended result payload shape:

```js
{
  occupation: {
    id: "software-developers",
    name: "Software Developers / Engineers",
    baseScore: 9
  },
  seniority: {
    id: "senior",
    label: "SENIOR",
    range: "6-9 yrs",
    slevel: 2
  },
  adjustedScore: 6,
  shelfLifeYears: 4.8,
  countdown: {
    years: 4,
    months: 9,
    days: 18,
    totalDays: 1752
  },
  risk: {
    key: "critical",
    label: "CRITICAL",
    needlePercent: 72,
    needleAngle: 39,
    colorVar: "--neon-pink"
  },
  roast: "Your code still compiles, but the invoice already belongs to the model."
}
```

Why this matters for planning:
- UI code only needs to render a stable object.
- The same object can drive the DOM, the verification matrix, and later sharing/i18n work.
- The 21 x 4 verification script can validate one interface instead of poking at scattered helpers.

## Formula And Numeric Recommendations

Recommended score formula:
- Keep the existing formula exactly: `adjustedScore = clamp(baseScore - (slevel * 1.5), 0, 10)`.

Recommended shelf-life mapping:
- Use a linear conversion based on adjusted score only.
- Recommended implementation target: `shelfLifeYears = clamp((10 - adjustedScore) * 1.2, 0, 12)`.

Why this mapping is a good planning target:
- It stays readable and monotonic.
- It keeps the range short and brutal: high-risk jobs can hit `0.0` years, low-risk outputs top out at `12.0`.
- It avoids hidden profession overrides that would make later debugging and verification harder.

Recommended countdown breakdown:
- Convert fractional years into `totalDays = Math.round(shelfLifeYears * 365)`.
- Derive display units with:
  - `years = Math.floor(totalDays / 365)`
  - `months = Math.floor((totalDays % 365) / 30)`
  - `days = (totalDays % 365) % 30`

Planning note:
- Exact calendar precision is not required here. A stable `365/30` approximation is good enough for a humorous countdown and easy to verify.

## Gauge Model Recommendation

The gauge should represent automation danger from the adjusted score, not from the countdown.

Recommended banding:

| Adjusted Score | Band Key | Label | Needle Percent |
|----------------|----------|-------|----------------|
| `0 - <2.5` | `low` | `LOW RISK` | `10` |
| `2.5 - <4.5` | `watch` | `WATCHLIST` | `30` |
| `4.5 - <6.5` | `exposed` | `EXPOSED` | `50` |
| `6.5 - <8.5` | `critical` | `CRITICAL` | `72` |
| `8.5 - 10` | `doomed` | `DOOMED` | `92` |

Recommended rendering contract:
- Use inline SVG in `index.html`.
- Keep the gauge mostly static; animate only the needle with CSS transition on `transform`.
- Store the target angle or percent in the result model so the UI only applies it.

## Roast Placeholder System Recommendation

Phase 2 should not write the final bilingual roast library. The best temporary system is a structured composition model:

- `ROAST_OPENERS[occupation.id]` -> profession-flavored opener
- `ROAST_MIDDLES[riskBand.key]` -> severity punchline
- `ROAST_CLOSERS[seniority.id]` -> seniority-aware closer

Composition pattern:

```js
return [
  ROAST_OPENERS[occupation.id],
  ROAST_MIDDLES[riskBand.key],
  ROAST_CLOSERS[seniority.id]
].join(" ");
```

Why this is the right planning target:
- It produces profession-specific output for all 84 combinations now.
- It avoids spending Phase 2 scope on writing 84 bespoke messages.
- It keeps Phase 4 replacement straightforward because the final content layer can swap the arrays/maps without changing engine/UI contracts.

## UI Integration Recommendation

Recommended results-view contract:
- Replace the placeholder block with stable DOM targets for the countdown, gauge, and roast rather than repeatedly rebuilding the whole results pane with opaque `innerHTML`.
- Populate the result model before revealing the results screen.
- Add a light reveal class such as `.results-ready` or `.results-visible` to trigger countdown/gauge/roast entrance styles.
- On "Try Again", clear the reveal class, reset any needle inline style/state, and clear the last result object so a new run starts cleanly.

Suggested DOM targets:
- `#result-job-name`
- `#countdown-years`
- `#countdown-months`
- `#countdown-days`
- `#risk-label`
- `#risk-score`
- `#gauge-needle`
- `#roast-message`

Recommended UI boundary:
- `showResults(result)` should accept a result object and only render/toggle classes.
- The click handler for `#cta-btn` should call `buildResultModel(selectedOccupation, selectedExperience)` first, then pass the object to `showResults(result)`.

## Verification Architecture

Phase 2 needs verification that matches the real constraint set: no test framework, no build step, no external dependencies, and a required 21 x 4 matrix check.

Recommended verification strategy:
- Create a Node-only verification script at `scripts/verify-phase-2-results.js`.
- The script should read `index.html`, extract the `DATA` and `ENGINE` sections, evaluate them in a sandbox, and run the full 84-combination matrix without needing a browser or third-party packages.

The script should assert:
- `OCCUPATIONS.length === 21`
- `SENIORITY_LEVELS.length === 4`
- every combination returns a result object
- every `adjustedScore` is between `0` and `10`
- every `shelfLifeYears` is between `0` and `12`
- every countdown object contains integer `years`, `months`, and `days`
- every risk payload has a label and numeric gauge target
- every roast string is non-empty
- expected collisions in numeric outputs are allowed, but every occupation/seniority pair appears in the matrix

Recommended optional artifact:
- Have the script write `.planning/phases/02-engine-and-results/02-result-matrix.json` for manual inspection and future debugging.

## Manual-Only Behaviors Worth Calling Out

These behaviors are easier to validate with a browser during execution than with a pure Node script:
- the input view hides and results view appears after clicking the CTA
- the gauge needle visibly transitions on reveal
- the "Try Again" flow clears prior result state before the next reveal

Planning implication:
- At least one plan should include explicit acceptance criteria for the DOM hooks and CSS class changes that make these behaviors inspectable even without browser automation.

## Recommended Plan Split

The strongest plan decomposition for this phase is:

1. Engine foundation
- Build the full pure result pipeline and roast placeholders in `index.html`.
- Establish a stable result object that both UI and verification can consume.

2. Results rendering and reveal
- Replace the placeholder results markup with the real countdown, gauge, and roast layout.
- Wire CTA and Try Again flows to render/reset real result state.

3. Matrix verification harness
- Add `scripts/verify-phase-2-results.js` and any small supporting docs/output files needed for the 21 x 4 check.
- Verify the engine contract directly from the shipped `index.html`.

This split keeps file conflicts low, isolates the pure-engine work from DOM work, and gives the phase a real proof-of-correctness artifact instead of relying on ad hoc browser clicking.
