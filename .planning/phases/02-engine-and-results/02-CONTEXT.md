# Phase 2: Engine and Results - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the real result engine for the existing input flow. Given a locked profession base score and seniority bucket, the app must compute adjusted score, convert it into a countdown, map it to a risk gauge, and show a darkly funny roast in the existing results view. This phase prioritizes correctness and strong product framing; screenshot-grade visual polish, bilingual copy, and social sharing remain later phases.

</domain>

<decisions>
## Implementation Decisions

### Formula Inputs
- Use the occupation base score table from `.planning/PROJECT.md` exactly as written for v1.0; do not reopen score tuning in Phase 2 unless explicitly requested by the user.
- Use the existing four seniority buckets from Phase 1 exactly as implemented: `0-2`, `3-5`, `6-9`, `10+`.
- ENGINE remains the source of truth; UI should render returned result data rather than embedding formula logic in DOM handlers.

### Shelf-Life Mapping
- Use a linear shelf-life conversion derived from the adjusted score rather than tiered bands or role-specific overrides.
- Keep the mapping readable and defensible: a higher adjusted score must always mean less time left, with no exceptions or hidden special cases.
- Clamp outputs to a non-negative range, then convert the resulting fractional years into years / months / days for display.
- Favor a short, brutal output range over a long, soft one; the countdown should feel credible but still sting.

### Gauge Meaning and Results Hierarchy
- The gauge represents automation danger based on adjusted score, not the countdown value; countdown and gauge should complement each other instead of duplicating the same message.
- Use a continuous needle position with clearly named risk bands running from lower risk to doomed.
- Results hierarchy is fixed: countdown first as the hero number, gauge second as the instant severity read, roast third as the punchline, and Try Again last as the escape hatch.
- Functional reveal is enough in Phase 2; save heavy glitch / CRT spectacle for Phase 3.

### Roast Structure
- Use generated placeholder roasts built from structured pieces instead of writing 84 bespoke messages in Phase 2.
- Each result should still feel specific to profession and seniority: profession-flavored setup, risk-band core line, and seniority-aware closer.
- Tone should be darkly funny, futuristic, and mean-but-winking rather than nihilistic or randomly cruel.
- Keep the placeholder system easy to replace and expand in Phase 4 when the full bilingual roast library is written.

### Claude's Discretion
- Exact numeric constants for the linear shelf-life formula, as long as the curve stays readable and punishing at the high end.
- Exact risk-band labels and thresholds, as long as they are clear first and stylish second.
- Exact placeholder roast templates and how the multi-part message is assembled.
- Exact DOM structure for the results view, provided the hierarchy remains countdown -> gauge -> roast -> Try Again.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core Product Specs
- `.planning/PROJECT.md` — Product vision, occupation base scores, formula inputs, tone, and hard constraints for the app.
- `.planning/REQUIREMENTS.md` — Phase 2 requirement IDs `CALC-01` through `CALC-04` and `RES-01` through `RES-05`.
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria, including the `21 x 4` verification requirement.

### Prior Decisions
- `.planning/phases/01-scaffold/01-CONTEXT.md` — Locked interaction decisions and Phase 1 implementation constraints that Phase 2 must preserve.
- `.planning/STATE.md` — Current project position, carried-forward concerns, and the explicit instruction not to re-ask already-decided planning questions.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `index.html` `OCCUPATIONS` and `SENIORITY_LEVELS`: existing source data for formula inputs and UI rendering.
- `index.html` `calculateAdjustedScore()` and `calculateShelfLife()`: placeholder engine functions already located in the pure ENGINE section.
- `index.html` `selectedOccupation`, `selectedSeniority`, `showResults()`, and `showInput()`: current state and view-switching hooks ready to be wired to real result data.
- `index.html` `#results-content`: existing placeholder results container that can be replaced with the real Phase 2 output.

### Established Patterns
- Single-file architecture: inline HTML, CSS, and JS only.
- Section comment architecture is part of the contract: `DATA`, `ENGINE`, `I18N`, `UI`, `SHARE`, `BOOT`.
- ENGINE purity is already established and must continue: calculations return values and do not touch the DOM.
- UI selection currently uses `data-id` attributes plus direct DOM class toggling; Phase 2 should extend this pattern rather than introduce a new framework-style architecture.

### Integration Points
- CTA click already gates on both selections and currently flips to the results view; Phase 2 should compute result data before reveal.
- Try Again already returns to the input view; Phase 2 should ensure each new run starts from clean result state.
- Existing CSS variables and results container can support a functional result layout now, with presentation polish deferred to Phase 3.

</code_context>

<specifics>
## Specific Ideas

- The user does not want to restate decisions that already exist in planning docs; prior planning files are authoritative unless explicitly overridden.
- Product intent: an outstanding futuristic interface that presents a real automation-risk signal with dark humor.
- The math should feel believable enough to ground the joke; the visuals and copy should sharpen the sting without making the output feel arbitrary.
- Results should feel like a sentence being revealed: countdown lands first, gauge confirms it, roast twists the knife.

</specifics>

<deferred>
## Deferred Ideas

- Full neon / glitch / CRT spectacle and screenshot-grade motion polish belong to Phase 3.
- Final bilingual roast content and share-ready messaging belong to Phase 4.

</deferred>

---

*Phase: 02-engine-and-results*
*Context gathered: 2026-03-17*
