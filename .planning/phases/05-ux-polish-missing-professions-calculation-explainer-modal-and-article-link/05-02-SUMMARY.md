---
phase: 05-ux-polish-missing-professions-calculation-explainer-modal-and-article-link
plan: "02"
subsystem: ui
tags: [modal, dialog, share, i18n, facebook, instagram, article-link]

requires:
  - phase: 05-01
    provides: 31-occupation data expansion and phase-5 verifier harness

provides:
  - selection-card suspense (no risk score on card)
  - explainer-modal dialog with bilingual formula explanation
  - article-link to post-labor-economia-ptbr.html on results view
  - facebook and instagram share buttons on results view

affects: [index.html, verify-phase-5-ux-polish.js]

tech-stack:
  added: []
  patterns: [native-html-dialog-showModal, clipboard-api-copy, backdrop-click-close]

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Instagram share copies text to clipboard via navigator.clipboard API with graceful fallback to opening instagram.com"
  - "renderModalContent() called inside renderStaticLabels() so language switching automatically rerenders modal title and body"
  - "Native HTML <dialog> element used with showModal() — no z-index conflicts with body::after scanline overlay (top layer rendering)"

patterns-established:
  - "Modal pattern: <dialog> + showModal() + backdrop click closes + Escape key native behavior"
  - "Clipboard copy pattern: navigator.clipboard.writeText().then() with 2s button text feedback and openShareWindow fallback"

requirements-completed: [CARD-UX, MODAL, ARTICLE, SHARE-FB-IG]

duration: 10min
completed: 2026-03-18
---

# Phase 5 Plan 02: UX Polish — Modal, Article Link, FB/IG Sharing Summary

**Card risk spoiler removed, calculation explainer modal with bilingual content, article link, and Facebook/Instagram share buttons added to the results view of index.html.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-18T13:35:00Z
- **Completed:** 2026-03-18T13:45:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Removed `.card-risk` CSS rule and DOM creation from `renderCards()` — suspense preserved until results reveal
- Added `<dialog id="explainer-modal">` with native `showModal()` — bilingual formula explanation accessible via "HOW IS THIS CALCULATED?" button
- Added `#article-link` linking to `post-labor-economia-ptbr.html` with bilingual label from STRINGS
- Added `#share-facebook-btn` opening Facebook sharer and `#share-instagram-btn` copying share text to clipboard
- Added 6 new keys to both STRINGS.en and STRINGS.ptbr with full bilingual content
- Full verification suite (Phase 2, Phase 4, Phase 5 verifiers) green

## Task Commits

1. **Task 1: Remove card-risk spoiler, add STRINGS keys and share functions** - `2c61e47` (feat)
2. **Task 2: Add modal HTML, article link, FB/IG buttons, CSS, and BOOT listeners** - `2d46b02` (feat)

## Files Created/Modified

- `/home/giuice/apps/risk-jobs/index.html` - All UI changes: removed card-risk, added modal, article link, FB/IG buttons, CSS, BOOT event listeners, STRINGS keys, renderModalContent(), buildFacebookShareUrl(), buildInstagramCopyText()

## Decisions Made

- Instagram has no web share API — the button copies the share text to clipboard via `navigator.clipboard.writeText()` with 2-second "COPIED!" feedback, falling back to opening instagram.com if clipboard unavailable
- `renderModalContent()` is called inside `renderStaticLabels()` rather than separately in `applyLanguage()` to avoid duplication — since `applyLanguage()` already calls `renderStaticLabels()`, language switching triggers modal rerenders automatically
- Native `<dialog>` element used with `showModal()` — renders in top layer above the `body::after` scanline overlay (z-index 9999), no z-index conflicts needed

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Phase 5 is fully complete. All planned UX polish changes are shipped:
- 31 occupations with full i18n coverage (Plan 01)
- Card suspense preserved, explainer modal, article link, FB/IG sharing (Plan 02)
- Full regression suite (Phase 2, Phase 4, Phase 5) green

---
*Phase: 05-ux-polish-missing-professions-calculation-explainer-modal-and-article-link*
*Completed: 2026-03-18*
