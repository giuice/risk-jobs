---
phase: 02-engine-and-results
plan: 01
subsystem: engine
tags: [pure-functions, risk-calculation, shelf-life, roast-composition, result-model]

# Dependency graph
requires:
  - phase: 01-scaffold
    provides: OCCUPATIONS and SENIORITY_LEVELS data structures, section comment architecture, single-file HTML constraint
provides:
  - Pure ENGINE pipeline in index.html with zero DOM access
  - buildResultModel(occupationId, experienceId) stable result contract
  - buildResultMatrix() returning 84-row verification matrix
  - RISK_BANDS, ROAST_OPENERS, ROAST_MIDDLES, ROAST_CLOSERS data constants
  - getOccupationById, getSeniorityByExperienceId, calculateAdjustedScore, calculateShelfLifeYears, splitShelfLife, getRiskBand pure helpers
affects: [02-02-results-rendering, 02-03-matrix-verification, phase-03-polish, phase-04-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Pure ENGINE section with zero DOM access enforced by section comment boundaries
    - experienceId field on SENIORITY_LEVELS as explicit bridge between UI range-picker and engine lookup
    - Structured roast composition (opener + middle + closer) enabling 84 unique strings from 30 source lines
    - Result model contract: occupation, seniority, adjustedScore, shelfLifeYears, countdown, risk, roast

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "experienceId added to SENIORITY_LEVELS records as explicit bridge — UI stores seniority id, engine lookup uses experienceId — avoids implicit coupling"
  - "Shelf-life formula locked at (10-adjustedScore)*1.2 clamped to 0..12 — brutal punishing range, monotonic, verifiable"
  - "Risk band needle positions: needleAngle = -90 + (needlePercent * 1.8) — maps 0-100% to -90deg..90deg semicircle"
  - "Roast composition pattern — 21 openers + 5 middles + 4 closers yields 84 unique outputs, replaceable in Phase 4"

patterns-established:
  - "ENGINE section contains zero DOM access — verified via regex in automated check"
  - "buildResultModel returns null on any missing lookup — callers must null-check before render"
  - "All countdown math uses 365-day year, 30-day month approximation — consistent and verifiable"

requirements-completed: [CALC-01, CALC-02, CALC-03, CALC-04, RES-03]

# Metrics
duration: 2min
completed: 2026-03-17
---

# Phase 2 Plan 1: Engine Foundation Summary

**Pure DOM-free result pipeline with clamped score math, linear shelf-life conversion, 5-band risk gauge, structured roast composition, and stable 84-row matrix builder embedded in index.html**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T01:16:25Z
- **Completed:** 2026-03-18T01:18:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Added `experienceId` bridge fields to all 4 SENIORITY_LEVELS records enabling explicit engine lookup by range selector value
- Built complete pure ENGINE section: 8 helpers (getOccupationById, getSeniorityByExperienceId, calculateAdjustedScore, calculateShelfLifeYears, splitShelfLife, getRiskBand, buildRoast, buildResultModel) plus buildResultMatrix — zero DOM access verified
- Verified all 3 known-output test cases and full 84-row matrix via Node vm sandbox

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand ENGINE pipeline with data constants and pure helpers** - `d10e4e1` (feat)
2. **Task 2: Compose result object and 84-row matrix builder** - `7b11147` (feat)

## Files Created/Modified

- `/home/giuice/apps/risk-jobs/index.html` - Added experienceId to SENIORITY_LEVELS, RISK_BANDS/ROAST_OPENERS/ROAST_MIDDLES/ROAST_CLOSERS constants, and 8 pure engine functions (533 lines total, up from 414)

## Decisions Made

- experienceId field added to SENIORITY_LEVELS as explicit bridge between the 4-button UI selector and the engine lookup — avoids UI code needing to know internal id-to-bucket mapping
- Shelf-life formula `(10-adjustedScore)*1.2` clamped to 0..12 — chosen in Phase 2 research as readable, monotonic, and punishing at high end
- needleAngle formula `-90 + (needlePercent * 1.8)` maps 0-100% range to a -90..90 degree semicircle for gauge display

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria and known-output checks passed on first attempt.

## Issues Encountered

None.

## Next Phase Readiness

- Plan 02-02 (results rendering) can import buildResultModel with the stable contract defined here
- Plan 02-03 (matrix verification) can use buildResultMatrix() directly from index.html ENGINE section
- Engine is fully verified via Node vm sandbox — no browser needed for correctness checks
- UI currently stores selectedSeniority as level.id (e.g. 'junior') — Plan 02-02 must map this to experienceId before calling buildResultModel, or switch the UI to store experienceId directly

---
*Phase: 02-engine-and-results*
*Completed: 2026-03-17*
