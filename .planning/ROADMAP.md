# Roadmap: AI Job Death Clock

## Overview

A single HTML file progresses through four build layers: scaffold and deployable skeleton first (validates GitHub Pages path and file structure), then calculation engine wired to a functional UI (the product core), then visual polish to make the results page screenshot-worthy, and finally bilingual content and share mechanics to enable the viral distribution loop. Each phase completes a coherent, testable capability before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [~] **Phase 1: Scaffold** - Deployed skeleton on GitHub Pages with input form, CSS variables, and file section structure established
- [~] **Phase 2: Engine and Results** - Calculation engine produces correct outputs; results page shows countdown, gauge, and roast; 84-row verification harness complete
- [x] **Phase 3: Visual Polish** - Cyberpunk aesthetics fully realized: neon glow, scanlines, glitch animation, responsive layout (completed 2026-03-18)
- [~] **Phase 4: Content, i18n, and Sharing** - Bilingual roasts and UI strings, language toggle, URL hash state, social share buttons live

## Phase Details

### Phase 1: Scaffold
**Goal**: A deployable skeleton exists at the GitHub Pages URL with the correct file structure, both HTML views toggling correctly, and the base CSS variable system in place
**Depends on**: Nothing (first phase)
**Requirements**: INP-01, INP-02, INP-03, INP-04, DEP-01, DEP-02, DEP-03, VIS-01
**Success Criteria** (what must be TRUE):
  1. The site loads at the GitHub Pages URL without errors
  2. User sees a form with a profession dropdown (21 options) and a years-of-experience input on the same screen
  3. Clicking a Calculate button transitions the view from input to results (and Try Again returns to input)
  4. HTML file is self-contained with no external JS dependencies; page works if Google Fonts CDN fails (monospace fallback)
  5. Internal file section comments (DATA, ENGINE, I18N, UI, SHARE, BOOT) are in place and the ENGINE section contains zero DOM access
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Create index.html scaffold with CSS variables, occupation data, card grid UI, and view toggling
- [x] 01-02-PLAN.md — Deploy to GitHub Pages and verify live site

### Phase 2: Engine and Results
**Goal**: Entering any profession and years of experience produces a correct, formula-driven countdown, gauge position, and roast message — all verified against the full 21x4 output matrix before any copy is finalized
**Depends on**: Phase 1
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, RES-01, RES-02, RES-03, RES-04, RES-05
**Success Criteria** (what must be TRUE):
  1. Every combination of occupation (21) and seniority level (4) produces a distinct, non-negative adjusted score and a corresponding shelf-life value
  2. The countdown timer displays years, months, and days computed from the shelf-life output
  3. The SVG gauge needle animates to the correct position on results reveal
  4. A roast message (placeholder text is acceptable) appears and is specific to the profession/seniority combination
  5. User can click "Try Again" to return to the input form and receive a fresh result for a different input
**Plans**: 3 plans
Plans:
- [x] 02-01-PLAN.md — Build the pure result-model engine, risk-band mapping, and placeholder roast composition in `index.html`
- [x] 02-02-PLAN.md — Replace the placeholder results screen with countdown, gauge, reveal wiring, and clean retry flow
- [x] 02-03-PLAN.md — Add the Node-only 21x4 verification harness and generated result-matrix artifact

### Phase 3: Visual Polish
**Goal**: The results page is visually dramatic enough to screenshot and share — neon glow, scanlines, glitch reveal, and responsive layout all validated including on mobile
**Depends on**: Phase 2
**Requirements**: VIS-02, VIS-03, VIS-04, VIS-05
**Success Criteria** (what must be TRUE):
  1. Text on results headings has visible neon glow using multi-layer text-shadow via CSS custom properties
  2. A scanline overlay creates a CRT monitor effect across the full page
  3. The results section performs a glitch/CRT reveal animation when it appears (no layout jank)
  4. All animations use only transform/opacity (no box-shadow or text-shadow animation) and respect prefers-reduced-motion
  5. The page is fully usable at 375px viewport width with no horizontal scroll or overlapping elements
**Plans**: 2 plans
Plans:
- [ ] 03-01-PLAN.md — Add neon glow text-shadow, CRT scanline overlay, glitch reveal animation, and reduced-motion guard
- [ ] 03-02-PLAN.md — Add mobile responsive layout at 480px breakpoint and visual verification checkpoint

### Phase 4: Content, i18n, and Sharing
**Goal**: The app is fully bilingual with complete roast content and working social share buttons that link to the specific result — ready to launch
**Depends on**: Phase 3
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, SHR-01, SHR-02, SHR-03, SHR-04, SHR-05
**Success Criteria** (what must be TRUE):
  1. Clicking the language toggle switches all visible UI text between English and PT-BR instantly with no page reload
  2. Language preference set via toggle persists after a page reload (localStorage)
  3. Every occupation/seniority combination has a distinct roast message in both English and PT-BR (minimum 20 variants per language, target 80)
  4. Sharing on Twitter/X, WhatsApp, and LinkedIn opens a pre-filled message containing the user's result
  5. A shared URL (with hash) opens directly to the correct results view — the input form does not appear first
**Plans**: 3 plans
Plans:
- [x] 04-01-PLAN.md — Create bilingual content catalogs, localized roast helpers, static OG/Twitter metadata, and the Phase 4 verifier
- [x] 04-02-PLAN.md — Wire the live language toggle, instant rerendering, and localStorage-backed language persistence
- [ ] 04-03-PLAN.md — Add hash-based result hydration and social share buttons for X, WhatsApp, and LinkedIn

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold | 2/2 | Complete   | 2026-03-17 |
| 2. Engine and Results | 3/3 | Complete   | 2026-03-18 |
| 3. Visual Polish | 2/2 | Complete   | 2026-03-18 |
| 4. Content, i18n, and Sharing | 2/3 | In Progress | - |
