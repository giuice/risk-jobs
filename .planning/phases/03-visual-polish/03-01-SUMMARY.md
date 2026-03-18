---
phase: 03-visual-polish
plan: 01
subsystem: ui
tags: [css, animations, neon-glow, scanlines, glitch, accessibility, prefers-reduced-motion]

# Dependency graph
requires:
  - phase: 02-engine-and-results
    provides: results view HTML structure, .page-title, .countdown-value, .results-card-heading, showResults() and resetResultState() JS functions
provides:
  - "--neon-glow-green, --neon-glow-pink, --neon-glow-cyan CSS custom properties in :root"
  - "body::after scanline overlay with repeating-linear-gradient, position: fixed, pointer-events: none"
  - "Glitch reveal animation on #results-view .page-title via @keyframes glitch-top/glitch-bot"
  - "prefers-reduced-motion guard suppressing all keyframe animations"
affects: [03-02-mobile-layout, phase-4-share]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Neon text-shadow as static CSS custom properties — never inside @keyframes"
    - "body::after pseudo-element for global overlay with pointer-events: none"
    - "Glitch via ::before/::after + clip-path: inset() keyframes, data-text attribute for ghost text"
    - "glitch-active class added inside requestAnimationFrame in showResults(), removed in resetResultState()"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Glitch animation applied only to #results-view .page-title — card headings (0.75rem) are too small; glitch reads as noise on tiny text"
  - "data-text must be set before glitch-active is added — pseudo-elements use content: attr(data-text), empty attr produces blank colored blocks"
  - "forwards fill mode collapses pseudo-elements after 0.6s duration — keeps ghost layers invisible after animation completes"
  - "steps(4) timing function produces mechanical digital glitch look appropriate for CRT aesthetic"

patterns-established:
  - "Pattern: CSS custom properties for multi-layer text-shadow values — apply statically on selectors, never animate"
  - "Pattern: position: fixed pseudo-element overlay with pointer-events: none and z-index: 9999 for viewport-covering effects"
  - "Pattern: One-shot CSS animation triggered by JS class addition inside requestAnimationFrame"

requirements-completed: [VIS-02, VIS-03, VIS-04]

# Metrics
duration: 1min
completed: 2026-03-18
---

# Phase 3 Plan 01: Visual Polish — Core Effects Summary

**Multi-layer neon text-shadow on headings, CRT scanline body overlay, and one-shot glitch reveal animation on results title, all with prefers-reduced-motion guard — pure CSS, no dependencies**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-18T09:05:14Z
- **Completed:** 2026-03-18T09:06:40Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Neon glow text-shadow applied to `.page-title` and `.countdown-value` (green) and `.results-card-heading` (cyan) via CSS custom properties `--neon-glow-green` and `--neon-glow-cyan` in `:root`
- `body::after` scanline overlay covers full viewport at all scroll positions with `repeating-linear-gradient`, `position: fixed`, `pointer-events: none`, `z-index: 9999`, and iOS Safari compositing fix (`-webkit-transform: translateZ(0)`)
- Glitch reveal animation on `#results-view .page-title` plays once per results display using `::before`/`::after` pseudo-elements with `clip-path: inset()` + `translateX` keyframes — no layout reflow, GPU-compositor-safe
- `prefers-reduced-motion: reduce` media query suppresses all keyframe animations and reduces reveal transition to near-instant (0.001ms)
- Engine verifier (`verify-phase-2-results.js`) passes unchanged — 84 rows, 67 expected numeric collisions

## Task Commits

Each task was committed atomically:

1. **Task 1: Add neon glow variables and scanline overlay CSS** - `29149af` (feat)
2. **Task 2: Add glitch reveal animation and reduced-motion guard** - `740df74` (feat)

## Files Created/Modified

- `index.html` - Added neon glow CSS custom properties, scanline overlay, glitch animation CSS and keyframes, reduced-motion guard, plus JS modifications in showResults() and resetResultState()

## Decisions Made

- Glitch animation applied only to `#results-view .page-title` (not card headings) — card headings at 0.75rem are too small for glitch to read as drama rather than noise
- `data-text` attribute set in JS before `glitch-active` class addition — CSS `content: attr(data-text)` requires the attribute to exist before animation starts
- `forwards` fill mode keeps glitch pseudo-elements collapsed after animation completes, maintaining clean display state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- VIS-02, VIS-03, VIS-04 complete — neon glow, scanlines, and glitch reveal all shipped
- Plan 02 (mobile responsive layout VIS-05) is next — the `@media (max-width: 480px)` breakpoint work
- No blockers

---
*Phase: 03-visual-polish*
*Completed: 2026-03-18*
