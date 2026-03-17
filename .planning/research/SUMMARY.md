# Project Research Summary

**Project:** AI Job Death Clock (risk-jobs)
**Domain:** Dark humor viral single-page calculator — AI job displacement risk
**Researched:** 2026-03-17
**Confidence:** MEDIUM-HIGH (stack and architecture are HIGH; features and pitfalls are MEDIUM)

## Executive Summary

This is a dark humor, single-page web calculator that takes a user's profession and years of experience as inputs and returns a dramatic, cyberpunk-styled prediction of how long before AI replaces them. The product is purely client-side: a single `index.html` file with embedded CSS and JS, zero dependencies, zero build step, deployable to GitHub Pages in minutes. Research consistently points to this constraint as a feature, not a limitation — the closest competitors (willrobotstakemyjob.com, deathclock.com) are visually inert and lack Portuguese-language support, which represents the primary market gap to exploit. The core differentiation is visual drama (glitch effects, neon gauge, countdown timer) combined with profession-specific roast messages and bilingual EN/PT-BR support.

The recommended build approach is a strict layered architecture inside the single file: DATA (lookup tables) → ENGINE (pure calculation functions with no DOM access) → I18N (language toggle + string resolution) → UI (DOM writes) → SHARE (URL construction) → BOOT (event binding). This prevents the single biggest architectural failure mode — mixing calculation logic with DOM access — which makes the file unmaintainable after the first few features. Build order follows the dependency graph: scaffold first, then data and engine, then UI wiring, then CSS/animations, then i18n, then content (roasts), then share mechanics. Each layer is independently testable in the browser console before the next is added.

The two most consequential risks are: (1) roast message copy written before the full 21-occupation x 4-seniority output matrix is validated — edge cases produce contradictory tone when scores near zero or go negative; and (2) share buttons that link to the homepage rather than a specific result — this kills the viral mechanic entirely. Both are avoidable with deliberate phase sequencing: generate and review the full matrix before writing a single line of copy, and design URL hash encoding before implementing any share buttons. A third risk specific to the PT-BR market is CSS animation performance on mid-range Android; animating only `transform`/`opacity` (GPU-composited) instead of `box-shadow`/`text-shadow` (paint-triggering) solves this.

## Key Findings

### Recommended Stack

The entire product is HTML5 + CSS3 + ES2022 Vanilla JS with zero external libraries. No framework, no build step, no bundler. This is the deliberate choice: React/Vue would add 30-100KB and a build step for what amounts to five interactive elements. GSAP would add 27KB for effects achievable with CSS `@keyframes`. The only external resource is Google Fonts (JetBrains Mono via CDN) for the monospace terminal aesthetic — with system `monospace` as a viable fallback. The cyberpunk visual system relies on well-supported CSS features: multi-layer `text-shadow` for neon glow, `clip-path` + `::before`/`::after` pseudo-elements for glitch text, `stroke-dasharray`/`stroke-dashoffset` on inline SVG for the animated gauge. All are documented in MDN and supported across all modern browsers.

**Core technologies:**
- HTML5 + CSS3: Page structure, animations, theming — universal, no build step, single file deployment
- Vanilla JS (ES2022): Calculation engine, DOM, i18n — zero dependencies means zero failure modes from third-party packages
- Inline SVG: Risk gauge meter — resolution-independent, CSS-animatable without a library
- CSS Custom Properties: Theming system — neon colors defined once in `:root`, referenced everywhere
- Google Fonts (JetBrains Mono): Terminal aesthetic — CDN-loaded, system monospace fallback if offline

**Explicit exclusions:** React, Vue, GSAP, html2canvas, i18next, Bootstrap, Tailwind, Webpack, Vite.

See `.planning/research/STACK.md` for CSS technique details and social sharing implementation patterns.

### Expected Features

The product follows the "Death Clock" format — dramatic countdown display + subject-specific formula + dark aesthetic — combined with the profession personalization depth of willrobotstakemyjob.com, which neither competitor provides simultaneously. The gap is specifically: visual drama + two-dimensional personalization + Portuguese-language market. The entire distribution model is social sharing, so anything that adds friction before the share moment (accounts, email capture, multi-step quizzes) is an anti-feature.

**Must have for launch (v1):**
- Profession dropdown (20+ occupations + "Other") — without this the formula cannot run
- Years of experience input — seniority adjustment is the key personalization dimension
- Risk score calculation engine (seniority-adjusted formula) — the product core
- Countdown timer display ("X years, Y months, Z days") — the Death Clock pattern; lands harder than a percentage
- Risk gauge / meter visual (animated on reveal) — spatial drama, slot-machine dopamine hit
- Profession-specific roast messages (minimum 20 variants, ideally 80) — the actual content that drives shares
- Cyberpunk terminal visual design (neon glows, monospace, scanlines) — genre expectation; generic design = no shares
- Share buttons (Twitter/X, WhatsApp, LinkedIn) — the distribution mechanism
- Bilingual EN/PT-BR — doubles addressable audience at zero runtime cost (embedded strings)
- Try Again / Reset flow — keeps users on page, enables "try for a friend" behavior

**Should have (add after v1 validation):**
- Glitch/CRT animation on results reveal — enhances shareability but not required to validate core thesis
- Screenshot-friendly result card layout — improves visual quality of shared screenshots
- Salary/replacement cost data per occupation — economic contextualization increases provocation
- URL-based locale auto-detection — quality of life; manual toggle is sufficient for v1

**Defer to v2+:**
- Server-side OG image generation — requires server or Cloudflare Worker; high complexity
- Additional languages (ES, FR) — only if traffic data shows demand
- Additional occupations beyond core Karpathy list — scope creep risk

**Anti-features (explicitly do not build):** User accounts, AI-generated roast messages, free-text job input, 5+ question quiz flow, leaderboards, email capture, PWA, dark mode toggle, comments section, exact replacement dates.

See `.planning/research/FEATURES.md` for competitor analysis and full prioritization matrix.

### Architecture Approach

The architecture is a single `index.html` file organized into strict internal layers separated by comment headers. The key constraint is clean layer separation: the ENGINE layer (pure calculation functions) must have zero DOM access, and UI functions must accept data objects rather than calling calculation functions directly. This enforces unidirectional data flow and makes each layer independently testable in the browser console. The app has only two mutable state variables: `currentLang` (string) and `lastResult` (object or null). No state management library is needed.

**Major components:**
1. DATA layer — `OCCUPATIONS[]`, `ROASTS{}`, `I18N{}` frozen at top of script block; editable as plain configuration
2. ENGINE layer — `getSeniority()`, `calculate()`, `getShelfLife()` as pure functions; no DOM access ever
3. I18N layer — single `currentLang` variable + `t(key)` translator + `applyLang()` querySelector loop
4. UI layer — `showResults()`, `renderGauge()`, `renderCountdown()`, `renderRoast()` accept data objects, write to DOM
5. SHARE layer — `buildShareText()` + per-platform `window.open()` functions; reads `lastResult`
6. BOOT — `init()` binds all event listeners at `DOMContentLoaded`

**View switching pattern:** Both input and results sections exist in the DOM at all times. CSS class toggle (`.hidden`) switches views — avoids innerHTML replacement which destroys event listeners.

See `.planning/research/ARCHITECTURE.md` for build order sequence and anti-patterns.

### Critical Pitfalls

1. **Humor tone collapse at formula edge cases** — Roast copy written before the output matrix is generated leads to contradictions (roast says "doomed" but score is low, or scores go negative). Prevention: generate and review the full 21x4 output matrix, clamp scores to 0-10, then write all copy. Address in Phase 2 before any content writing.

2. **Share buttons link to homepage, not result** — Without URL hash encoding, every shared link opens a blank input form. Kills the viral mechanic. Prevention: encode `#prof=X&exp=Y` in the URL hash; auto-display results on page load if hash is present. Design this before implementing share buttons.

3. **Broken Open Graph previews on GitHub Pages** — Relative og:image paths break when served from `/repo-name/` path. Prevention: use absolute URLs for all og:image paths, add `.nojekyll` file, test with Twitter Card Validator before launch. Address in Phase 1 by deploying skeleton early.

4. **CSS animation jank on mid-range Android** — The PT-BR market heavily uses mid-range Android devices. Animating `box-shadow`/`text-shadow` triggers paint rather than GPU compositing. Prevention: animate only `transform`/`opacity`; use `will-change: transform`; honor `prefers-reduced-motion`. Address in Phase 3 before effects are polished.

5. **Single file becomes unmaintainable spaghetti** — Ad-hoc growth of a 1500-line file with mixed concerns. Prevention: establish section comment structure from day one (DATA → ENGINE → I18N → UI → SHARE → BOOT); keep ENGINE functions DOM-free. Address in Phase 1 scaffold.

## Implications for Roadmap

Research suggests five natural phases driven by dependency order and pitfall prevention:

### Phase 1: Scaffold and Foundation
**Rationale:** Both critical infrastructure pitfalls (broken OG paths, file structure spaghetti) must be prevented on day one. Deploying a skeleton early validates the GitHub Pages base path before any real content depends on it. Establishing the internal file structure now prevents architectural debt that compounds across all later phases.
**Delivers:** Deployed skeleton at GitHub Pages URL; validated OG meta tags; established file sections with comment structure; `:root` CSS variables defined; both HTML sections (input, results) in DOM with `.hidden` toggling; `DOMContentLoaded` boot scaffolded.
**Addresses:** Profession dropdown placeholder, visual theme skeleton, lang toggle placeholder.
**Avoids:** Broken OG previews (Pitfall 2), file structure collapse (Pitfall 5).
**Research flag:** Standard patterns — no deep research needed. Patterns are well-documented.

### Phase 2: Calculation Engine and Data
**Rationale:** The ENGINE is the product core and has no UI dependencies. Building and validating it first — in isolation, tested from the browser console — ensures the mathematical foundation is correct before any presentation layer depends on it. Critically, the full output matrix must be reviewed here before any roast copy is written (Pitfall 1).
**Delivers:** `OCCUPATIONS[]` data table with base scores; `getSeniority()`, `calculate()`, `getShelfLife()` pure functions; full 21x4 output matrix generated and reviewed; score clamping to 0-10; basic wiring of Calculate button to show placeholder results.
**Uses:** Vanilla JS ENGINE patterns from ARCHITECTURE.md; occupation data from FEATURES.md.
**Implements:** DATA layer + ENGINE layer.
**Avoids:** Humor tone collapse (Pitfall 1).
**Research flag:** Scoring formula values (base scores per occupation, seniority adjustment magnitude) are a design decision, not a research question — no research phase needed.

### Phase 3: Visual Design and Animations
**Rationale:** CSS/animation work is a dedicated pass after functionality is confirmed. Doing it here — before content and i18n — allows the design system to be fully established before strings and roast messages populate it. Animation performance constraints (Pitfall 3) must be baked into the design from the start, not retrofitted.
**Delivers:** Full cyberpunk visual theme (neon glows, scanlines, monospace typography); animated SVG gauge; countdown display styling; glitch text effect on results reveal; `@keyframes` for all animations; `prefers-reduced-motion` media query; responsive mobile layout tested at 375px; validated on mid-range Android Chrome.
**Uses:** CSS techniques from STACK.md (neon glow, SVG gauge, glitch effect, CSS custom properties).
**Avoids:** Animation performance jank (Pitfall 3).
**Research flag:** Standard CSS patterns — no research needed. All techniques are MDN-documented.

### Phase 4: Content and I18N
**Rationale:** Content (roast messages) depends on the validated output matrix from Phase 2 and must be rendered through the visual system established in Phase 3. Bilingual support is built alongside content to avoid doubling the writing effort in a separate pass. This phase is the most labor-intensive but has the lowest technical complexity.
**Delivers:** Complete `ROASTS{}` corpus (minimum 20, target 80 bilingual variants, written after matrix review); complete `I18N{}` object for all UI chrome strings; `t()` translator function; `applyLang()` DOM update loop; language toggle wiring; `localStorage` persistence of language choice; all `data-i18n` attributes on HTML elements.
**Uses:** i18n pattern from STACK.md and ARCHITECTURE.md; bilingual feature from FEATURES.md.
**Implements:** I18N layer + content DATA.
**Avoids:** PT-BR roast messages missing (noted in PITFALLS.md checklist).
**Research flag:** No technical research needed. Content quality (writing) is the real work here.

### Phase 5: Sharing and Polish
**Rationale:** Share mechanics are last because `buildShareText()` depends on `lastResult` being populated (requires Phase 2+3+4 to be complete), and URL hash encoding must be designed before share buttons are built (Pitfall 4). Polish (OG image, favicon, cross-browser check) is the final gate before launch.
**Delivers:** URL hash encoding (`#prof=X&exp=Y`); auto-display results on page load from hash; `buildShareText()` with i18n-aware output; Twitter/X, WhatsApp, LinkedIn share buttons with pre-filled text; validated share previews tested via Twitter Card Validator; `.nojekyll` confirmed; OG tags with absolute URLs; cross-browser smoke test (Chrome, Firefox, Safari mobile).
**Uses:** Share URL patterns from STACK.md; Web Share API as progressive enhancement.
**Implements:** SHARE layer.
**Avoids:** Share linking to homepage (Pitfall 4); broken OG previews (Pitfall 2 — final validation).
**Research flag:** URL hash encoding and share intent URLs are standard patterns — no research needed.

### Phase Ordering Rationale

- **Scaffold before engine:** GitHub Pages base path validation and file structure must exist before any other layer is built into them.
- **Engine before visuals:** Pure functions with no DOM dependencies can be tested in isolation; visual layer must not be built before the data it will render is validated.
- **Output matrix before content:** Pitfall 1 (tone collapse) is only avoidable by reviewing all formula outputs before writing a single roast message — this hard dependency forces Phase 2 before Phase 4.
- **Visuals before content:** Rendering pipeline must accept and style content before content is written at scale; otherwise roast messages are written into an unknown visual context.
- **Share last:** `lastResult` dependency and URL hash design require all preceding layers to be stable.

### Research Flags

Phases with standard patterns (research phase not needed):
- **Phase 1:** GitHub Pages + HTML scaffold — well-documented
- **Phase 2:** Vanilla JS calculation patterns — established, no external dependencies
- **Phase 3:** CSS animation techniques — all MDN-documented
- **Phase 4:** i18n via data attributes — established convention; content writing is labor, not research
- **Phase 5:** Share intent URLs + URL hash — standard patterns

No phase requires `/gsd:research-phase` — the entire stack is deliberately constraint-minimal and pattern-established. The scoring formula (base scores per occupation) is a design/data decision that should be reviewed with the project owner, not researched externally.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero external dependencies; all patterns are MDN-documented browser standards with no versioning uncertainty |
| Features | MEDIUM | Based on training knowledge of competitor sites (willrobotstakemyjob.com, deathclock.com) through Aug 2025; live site verification was not possible; recommend manual competitor spot-check |
| Architecture | HIGH | Constraint set (single file, no framework, no API) narrows solution space to well-understood patterns; no uncertainty |
| Pitfalls | MEDIUM | GitHub Pages OG path behavior and Android compositing model are documented; viral quiz drop-off rates are from training data, not primary research |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Occupation base scores:** The specific risk scores per profession (0-10) are not researched — they are design decisions. These values drive all formula outputs and roast message tone calibration. The project owner or domain knowledge must provide or approve these before Phase 2 can be completed.
- **Competitor live feature verification:** External web fetch was disabled during FEATURES.md research. willrobotstakemyjob.com and deathclock.com should be manually checked before launch to confirm the competitive gap claim (visual drama + PT-BR market) is still accurate.
- **Roast message quality:** Writing quality is identified as the highest-value variable in the product. The research identifies the quantity target (80 variants) and structure (occupation x seniority), but the actual writing is not a research question — it requires creative investment. Budget this as the primary effort in Phase 4.

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — CSS text-shadow, clip-path, box-shadow, Custom Properties, stroke-dasharray, @keyframes
- Web Share API specification
- Open Graph Protocol specification
- GitHub Pages documentation — `.nojekyll`, base path behavior
- Web platform compositing model — transform/opacity GPU compositing

### Secondary (MEDIUM confidence)
- Training knowledge of willrobotstakemyjob.com — feature set and UX patterns (Aug 2025)
- Training knowledge of deathclock.com — countdown format and viral mechanics (Aug 2025)
- BuzzFeed quiz completion rate research — multi-step dropoff (~15% per step)
- Viral quiz and dark pattern engagement literature

### Tertiary (LOW confidence)
- Competitor live site features — could not verify; manual check recommended before launch

---
*Research completed: 2026-03-17*
*Ready for roadmap: yes*
