---
phase: 01-scaffold
plan: 01
subsystem: ui
tags: [html, css, javascript, cyberpunk, single-file]

# Dependency graph
requires: []
provides:
  - index.html self-contained scaffold with cyberpunk terminal aesthetic
  - CSS variable system (neon colors, monospace font, dark background tokens)
  - DATA section with 21 OCCUPATIONS array and SENIORITY_LEVELS array
  - ENGINE section with calculateAdjustedScore and calculateShelfLife (zero DOM access)
  - UI section with card grid rendering, experience selector, view toggling
  - 6-section comment structure: DATA, ENGINE, I18N, UI, SHARE, BOOT
  - Input view with 21 profession cards and 4 experience level buttons
  - Results placeholder view with TRY AGAIN navigation
affects: [02-engine, 03-results-ui, 04-sharing]

# Tech tracking
tech-stack:
  added: [Share Tech Mono (Google Fonts), vanilla JS (ES5-compatible), inline CSS with custom properties]
  patterns:
    - Section comment architecture (DATA / ENGINE / I18N / UI / SHARE / BOOT)
    - ENGINE purity rule (zero DOM access between ENGINE and I18N markers)
    - CSS custom property system for design tokens
    - Data-id attribute pattern for card/button selection state

key-files:
  created: [index.html]
  modified: []

key-decisions:
  - "Card grid (NOT dropdown) for profession selection — 21 profession cards in auto-fill grid"
  - "Visual segmented control (4 exp-btn elements) for experience — maps directly to 0/1/2/3 slevel values"
  - "ENGINE section enforced pure: calculateAdjustedScore and calculateShelfLife take numbers in, return numbers out"
  - "Share Tech Mono Google Font with Courier New / Consolas fallback stack for offline resilience"
  - "CTA button disabled until both selectedOccupation and selectedSeniority are non-null"

patterns-established:
  - "Section comments: use // ===== SECTIONNAME ===== as exact markers for grep/sed verification"
  - "Data attribute: data-id on cards/buttons enables querySelector selection without ID sprawl"
  - "Engine purity: no DOM calls (document.*, querySelector, getElementById) allowed in ENGINE block"
  - "CSS variables: all design tokens in :root, referenced via var() throughout stylesheet"

requirements-completed: [INP-01, INP-02, INP-03, INP-04, DEP-01, DEP-03, VIS-01]

# Metrics
duration: 2min
completed: 2026-03-17
---

# Phase 1 Plan 01: Scaffold Summary

**Self-contained index.html with cyberpunk terminal aesthetic, 21-profession card grid, visual experience selector, and working input/results view toggling — no build step required**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-17T22:24:54Z
- **Completed:** 2026-03-17T22:26:00Z
- **Tasks:** 2 (combined in single file write)
- **Files modified:** 1

## Accomplishments

- Created 413-line self-contained index.html with full cyberpunk terminal aesthetic (dark background, neon green/cyan/pink glows, Share Tech Mono monospace font)
- Embedded all 21 OCCUPATIONS with base scores (10 down to 4) and 4 SENIORITY_LEVELS with slevel mapping
- Implemented ENGINE section with pure calculateAdjustedScore and calculateShelfLife functions — verified zero DOM access
- Built interactive UI: 21 clickable profession cards in auto-fill grid, 4 experience level buttons, CTA "SEE YOUR FATE" that enables only when both selections are made
- Implemented view toggling: CTA transitions to results placeholder, TRY AGAIN returns to input view

## Task Commits

Each task was committed atomically:

1. **Task 1+2: Complete scaffold with data layer, CSS system, and interactive UI** - `cbc7b19` (feat)

**Plan metadata:** (docs commit follows)

_Note: Tasks 1 and 2 were implemented in a single atomic write as the file structure required both simultaneously. Task 2 UI content is contained within the same commit._

## Files Created/Modified

- `/home/giuice/apps/risk-jobs/index.html` - Complete self-contained scaffold: CSS variables, occupation data, ENGINE pure functions, card grid, experience selector, view toggling

## Decisions Made

- Card grid chosen over dropdown for profession selection (CONTEXT.md locked decision — more tactile, cyberpunk-appropriate)
- Visual 4-button segmented control for experience (matches 0-2/3-5/6-9/10+ seniority buckets exactly)
- Tasks 1 and 2 implemented together since HTML structure and JS UI code are inseparable in a single-file architecture
- Risk score shown on each card ("Risk: X/10") using neon pink for immediate visual impact

## Deviations from Plan

None — plan executed exactly as written. Both tasks implemented per specification with all acceptance criteria passing.

## Issues Encountered

None — straightforward greenfield implementation with clear specifications.

## User Setup Required

None — no external service configuration required. File opens locally in any browser.

## Next Phase Readiness

- index.html scaffold is ready for Phase 2 (engine implementation) — ENGINE section has placeholder pure functions, UI section has state variables ready to be wired to real results
- CSS variable system is established — Phase 3 results UI can use existing neon color tokens
- Section comment structure maintained — all downstream phases can reliably use grep/sed on section markers
- No blockers: ENGINE purity verified, all 21 occupations present, view toggling operational

---
*Phase: 01-scaffold*
*Completed: 2026-03-17*
