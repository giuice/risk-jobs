# Phase 1: Scaffold - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a deployable single HTML file on GitHub Pages with: a working profession card grid (21 options), a visual experience input, view toggling between input and results screens, base CSS variable system for cyberpunk terminal aesthetic, and commented section structure (DATA, ENGINE, I18N, UI, SHARE, BOOT). The ENGINE section must contain zero DOM access.

</domain>

<decisions>
## Implementation Decisions

### Profession Selector
- Visual card grid layout — 21 profession cards displayed in a grid the user clicks to select
- Modern, pleasurable interaction — cards should feel tactile and responsive on click/tap

### Experience Input
- Must be mouse-driven and visual — no standard number input field
- Innovative interaction pattern (slider, range, or similar visual mechanism)
- Constraint: must map to the 0-2 / 3-5 / 6-9 / 10+ year buckets used by the formula

### Calculation Trigger
- Big dramatic CTA button — "See Your Fate" / doomsday energy
- Button appears after both profession and experience are selected
- Should feel like pressing a self-destruct switch (fits cyberpunk theme)

### Card Content
- Claude's Discretion — pick the best visual approach for what each profession card displays (title only, title + icon, title + risk hint, etc.) based on what looks best in the cyberpunk aesthetic

### Claude's Discretion
- Experience input mechanism — choose the most innovative mouse-driven approach (slider, visual range, etc.) that feels fun and fits the cyberpunk theme
- Card content — choose what appears on each profession card for maximum visual impact
- View transition between input → results — simple show/hide is fine for scaffold, Phase 3 adds polish

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/PROJECT.md` — Core vision, occupation data table with base scores, formula definition, and key decisions
- `.planning/REQUIREMENTS.md` — Full requirement list with IDs; Phase 1 requirements: INP-01 through INP-04, DEP-01 through DEP-03, VIS-01
- `.planning/ROADMAP.md` §Phase 1 — Success criteria (5 items) including GitHub Pages deployment, form with 21-option dropdown, view toggling, self-contained HTML, and section comment structure

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None yet — this phase establishes the patterns (CSS variable system, section comments, view toggling)

### Integration Points
- GitHub Pages deployment (repo: giuice/risk-jobs, branch TBD)
- Single HTML file at repo root (index.html)

</code_context>

<specifics>
## Specific Ideas

- User wants the input experience to feel modern and maximally pleasurable — prioritize delight over convention
- Card grid should feel like choosing your doom — the cyberpunk aesthetic should be present from the scaffold, not bolted on later
- The CTA button should have dramatic energy — it's the moment of commitment before seeing your "death sentence"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-scaffold*
