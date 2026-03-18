# Phase 3: Visual Polish - Research

**Researched:** 2026-03-17
**Domain:** Pure CSS animations — neon glow, scanlines, glitch reveal, responsive layout
**Confidence:** HIGH

---

## Summary

Phase 3 adds the visual layer that makes the results page screenshot-worthy: multi-layer neon text-shadow, a CSS scanline overlay, a glitch/CRT reveal animation, and responsive layout at 375px. Every technique is pure CSS, no new dependencies — this is critical because the project is a single self-contained HTML file with no build step.

The project already has the cyberpunk color variables (`--neon-green`, `--neon-cyan`, `--neon-pink`) and a staggered reveal system (`results-reveal` / `results-visible` classes with `opacity` + `transform` transitions). Phase 3 builds directly on top of these without breaking them.

The four requirements are independent and can be applied incrementally to `index.html`. The main risk is performance: neon glow via `text-shadow` animation is expensive — the requirement explicitly prohibits animating `text-shadow` or `box-shadow`. Glow must be static on headings; only `transform` / `opacity` may be animated. `prefers-reduced-motion` must suppress all keyframe animations.

**Primary recommendation:** Apply neon `text-shadow` as static declarations on heading selectors via CSS custom properties, use a single `:after` pseudo-element on `body` for scanlines, implement glitch reveal on `.page-title` and results headings via `::before`/`::after` with `clip-path` + `translateX`, and fix mobile layout with fluid units and a 640px breakpoint already present.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VIS-02 | Text on results headings has visible neon glow using multi-layer text-shadow via CSS custom properties | Multi-layer `text-shadow` pattern verified from CSS-Tricks. Add as static value on `.page-title`, `.countdown-value`, `.results-card-heading`. |
| VIS-03 | Scanline overlay creates CRT monitor effect across full page | `body::after` with `repeating-linear-gradient` + `position: fixed`, `pointer-events: none`. Pattern verified from multiple codepen sources. |
| VIS-04 | Results section performs a glitch/CRT reveal when it appears, no layout jank | CSS glitch via pseudo-elements + `clip-path: inset()` keyframes on `.page-title`. Triggered on result display. Runs once (not infinite). No layout reflow — only `clip-path` + `translateX`. |
| VIS-05 | Page fully usable at 375px with no horizontal scroll or overlapping elements | Existing `auto-fill` card grid and `flex-wrap` experience selector are mostly safe; `card-grid` min-width (160px) causes horizontal scroll at 375px — must reduce to `minmax(140px, 1fr)`. Container padding needs reduction. |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS (inline) | — | All visual effects | Project constraint: single HTML file, no external CSS |
| CSS custom properties | — | Neon color/glow variables | Already established in `:root`; Phase 3 extends them |

No new libraries. No npm install. All CSS goes inside the existing `<style>` block in `index.html`.

### Supporting

| Technique | Purpose | When to Use |
|-----------|---------|-------------|
| `text-shadow` (multi-layer, static) | Neon glow on headings | Apply to `.page-title`, `.countdown-value`, results headings |
| `repeating-linear-gradient` on `::after` | Scanline overlay | Single pseudo-element on `body`, `position: fixed`, covers full viewport |
| `clip-path: inset()` keyframes | Glitch reveal animation | On `::before`/`::after` of `.page-title`; triggered once on result display |
| `@media (prefers-reduced-motion: reduce)` | Accessibility | Wraps all `@keyframes` usage to disable when user prefers no motion |
| CSS `clamp()` | Fluid font sizing | Optional for countdown values to prevent overflow at 375px |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static `text-shadow` | Animating `text-shadow` | Animating text-shadow is GPU-expensive and explicitly prohibited by success criteria |
| CSS pseudo-element scanlines | SVG overlay or canvas | SVG/canvas add DOM nodes; pseudo-element is zero-markup, inline CSS only |
| `clip-path: inset()` glitch | JS-driven GSAP glitch | Requires external library; violates single-file constraint |
| `repeating-linear-gradient` | `background-image: url(data:...)` | SVG data URI works but gradient is simpler, smaller, and inline-safe |

**Installation:** None required.

---

## Architecture Patterns

### CSS Section Layout (within `<style>` block)

The existing style block ends at line 358. New CSS is added in clearly labelled sections following the existing comment convention:

```
/* ---- Neon Glow (VIS-02) ---- */
/* ---- Scanlines Overlay (VIS-03) ---- */
/* ---- Glitch Animation (VIS-04) ---- */
/* ---- Mobile Layout (VIS-05) ---- */
/* ---- Reduced Motion ---- */
```

### Pattern 1: Multi-Layer Neon Text-Shadow (VIS-02)

**What:** Static `text-shadow` with 4-6 layers — inner white layers for definition, outer colored layers for glow depth. Stored as CSS custom properties so all headings can share them.

**When to use:** On `.page-title`, `.countdown-value`, `.results-card-heading`, and optionally `.result-job-name`.

**Do not animate** `text-shadow` — only apply statically.

```css
/* Source: CSS-Tricks "How to Create Neon Text With CSS" */
:root {
  --neon-glow-green:
    0 0 4px #fff,
    0 0 8px #fff,
    0 0 16px var(--neon-green),
    0 0 32px var(--neon-green),
    0 0 60px var(--neon-green);
  --neon-glow-pink:
    0 0 4px #fff,
    0 0 8px #fff,
    0 0 16px var(--neon-pink),
    0 0 32px var(--neon-pink);
  --neon-glow-cyan:
    0 0 4px #fff,
    0 0 8px #fff,
    0 0 16px var(--neon-cyan),
    0 0 28px var(--neon-cyan);
}

.page-title {
  text-shadow: var(--neon-glow-green);
}

.countdown-value {
  text-shadow: var(--neon-glow-green);
}

.results-card-heading {
  text-shadow: var(--neon-glow-cyan);
}
```

**Layer count guidance:** 5 layers is the sweet spot — inner white (4px, 8px) + outer color (16px, 32px, 60px). More than 6 layers has no visible benefit and adds render cost.

### Pattern 2: Scanline Overlay (VIS-03)

**What:** Fixed `body::after` pseudo-element covering the full viewport, with a `repeating-linear-gradient` of alternating transparent/semi-opaque bands at 4px intervals. `pointer-events: none` ensures clicks pass through.

**When to use:** Applied globally to `body`. No JavaScript or DOM nodes required.

```css
/* Source: pattern from multiple CodePen implementations (codepen.io/meduzen, codepen.io/ynef) */
body::after {
  content: '';
  position: fixed;
  inset: 0;               /* top/right/bottom/left: 0 */
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.18) 2px,
    rgba(0, 0, 0, 0.18) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

**Opacity tuning:** `0.18` on the dark band is subtle — the effect reads as texture without obscuring text. Do not exceed `0.30` or the screen becomes muddy.

**`position: fixed` vs `position: absolute`:** Fixed is required so the overlay covers the full viewport as the user scrolls, not just the document height.

**`inset` shorthand:** `inset: 0` is equivalent to `top:0; right:0; bottom:0; left:0`. Browser support: all modern browsers including Safari 14.1+. Fallback: `top:0; left:0; width:100%; height:100%`.

### Pattern 3: Glitch/CRT Reveal Animation (VIS-04)

**What:** A once-playing (not `infinite`) glitch animation on `.page-title` using `::before`/`::after` duplicates with `clip-path: inset()` and `translateX` offsets. The animation is triggered when `results-view` becomes visible by adding a class to `.page-title`.

**When to use:** Applied to `.page-title` and triggered when results appear. Runs once (`animation-iteration-count: 1`), duration ~0.6s — enough to feel dramatic without blocking reading.

**No layout jank** because only `clip-path` and `transform: translateX` are animated — both are compositor-only properties in modern browsers.

```css
/* Source: CSS-Tricks glitch guide + ahmodmusa.com cyberpunk tutorial */
.page-title {
  position: relative;
}

.page-title::before,
.page-title::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  background: var(--bg-primary);
  overflow: hidden;
}

.page-title::before {
  color: var(--neon-cyan);
  clip-path: inset(0 0 60% 0);
}

.page-title::after {
  color: var(--neon-pink);
  clip-path: inset(55% 0 0 0);
}

/* Glitch plays once when .glitch-active is added */
.page-title.glitch-active::before {
  animation: glitch-top 0.6s steps(4) 1 forwards;
}

.page-title.glitch-active::after {
  animation: glitch-bot 0.6s steps(4) 1 forwards;
}

@keyframes glitch-top {
  0%   { clip-path: inset(0% 0 70% 0);  transform: translateX(-4px); }
  25%  { clip-path: inset(15% 0 50% 0); transform: translateX(3px);  }
  50%  { clip-path: inset(5% 0 65% 0);  transform: translateX(-2px); }
  75%  { clip-path: inset(20% 0 40% 0); transform: translateX(4px);  }
  100% { clip-path: inset(0 0 100% 0);  transform: translateX(0);    }
}

@keyframes glitch-bot {
  0%   { clip-path: inset(60% 0 0% 0);  transform: translateX(4px);  }
  25%  { clip-path: inset(70% 0 0 0);   transform: translateX(-3px); }
  50%  { clip-path: inset(55% 0 0 0);   transform: translateX(2px);  }
  75%  { clip-path: inset(75% 0 0 0);   transform: translateX(-4px); }
  100% { clip-path: inset(100% 0 0 0);  transform: translateX(0);    }
}
```

**JavaScript trigger pattern** (inside `showResults()`):

```javascript
// In showResults(), after DOM updates:
var title = document.querySelector('.page-title');
title.setAttribute('data-text', title.textContent);
title.classList.remove('glitch-active');
requestAnimationFrame(function() {
  title.classList.add('glitch-active');
});
```

The `data-text` attribute must match the element's text content so `content: attr(data-text)` produces the correct ghost text.

**`steps(4)` timing function** produces the mechanical, digital look appropriate for CRT/glitch — smooth easing would undermine the effect.

**`forwards` fill mode** ensures the pseudo-elements end in their final `100%` keyframe state (fully collapsed `clip-path`) rather than snapping back.

### Pattern 4: Mobile Responsive (VIS-05)

**What:** Fix the card grid and container layout so the page has no horizontal scroll at 375px.

**Problems identified in current code:**

1. `.card-grid` uses `minmax(160px, 1fr)` — at 375px with 20px body padding and 20px container padding, usable width is ~295px. Two 160px columns = 320px minimum, causing horizontal scroll.
2. `.container` has `padding: 20px` — at 375px this eats 40px. Body also has `padding: 20px`, totalling 80px of horizontal gutters. Safe content width is ~295px.
3. `.cta-btn` has `padding: 16px 48px` — at 375px width may overflow if font sizes are large.
4. `.exp-btn` has `min-width: 140px` — four buttons in a row at ~295px usable width = 600px minimum, but `flex-wrap: wrap` already handles this.

**Fixes:**

```css
/* ---- Mobile Layout (VIS-05) ---- */
@media (max-width: 480px) {
  body {
    padding: 12px;
  }

  .container {
    padding: 12px;
  }

  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
  }

  .card {
    padding: 12px 8px;
  }

  .card .card-name {
    font-size: 0.78rem;
  }

  .cta-btn {
    padding: 14px 24px;
    font-size: 1rem;
    width: 100%;
  }

  .exp-btn {
    min-width: 120px;
    padding: 12px 14px;
    font-size: 0.8rem;
  }

  .page-title {
    font-size: 1.3rem;
    letter-spacing: 1px;
  }

  .countdown-value {
    font-size: 2rem;
  }

  .countdown-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
}
```

Note: the existing `@media (max-width: 640px)` rule already collapses `.countdown-grid` to single column. Phase 3 changes this — at 375px, three columns in the countdown grid are possible at `2rem` font size and are more compact. Verify visually.

### Pattern 5: Reduced Motion (Accessibility)

All `@keyframes` animations must be suppressed under `prefers-reduced-motion: reduce`. Static effects (neon glow, scanlines) are fine — they are not motion-based.

```css
/* Source: CSS-Tricks prefers-reduced-motion almanac */
@media (prefers-reduced-motion: reduce) {
  .page-title.glitch-active::before,
  .page-title.glitch-active::after {
    animation: none;
  }

  /* Existing reveal transitions: reduce duration to near-zero */
  .results-panel.results-visible .results-reveal {
    transition-duration: 0.001ms;
  }
}
```

**Do not remove static effects (neon glow, scanlines)** under reduced-motion — these are not motion-based and users have no expectation they will disappear.

### Anti-Patterns to Avoid

- **Animating `text-shadow` or `box-shadow`:** These force paint on every frame. Success criteria explicitly forbids this. Neon glow must be static.
- **Using `position: absolute` for the scanline overlay:** The overlay will stop at document bottom during scroll. Must be `position: fixed`.
- **Infinite glitch animation:** Running glitch continuously on headings causes eye strain and may trigger photosensitivity issues. Run once on trigger only.
- **Modifying existing reveal transitions:** The `opacity` + `transform: translateY` staggered reveal from Phase 2 must remain intact. VIS-04 glitch is additive, not a replacement.
- **Setting `overflow: hidden` on `body`:** This breaks position-fixed elements (like the scanline overlay) in Safari on iOS. Prefer `overflow-x: hidden` on a wrapper element if scrolling is a concern.
- **Omitting `data-text` attribute:** The glitch pseudo-elements use `content: attr(data-text)` — if this attribute is missing, the ghost layers are empty and the effect disappears.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scanline pixel pattern | Custom SVG tiling or canvas drawing | `repeating-linear-gradient` on `body::after` | Zero DOM nodes, pure CSS, correct `z-index` stacking, no JS |
| Glitch text duplication | JavaScript string insertion | `content: attr(data-text)` on `::before`/`::after` | No DOM mutation, CSS-only, correct layer stacking |
| Reduced-motion detection | `window.matchMedia('prefers-reduced-motion')` JS check | CSS `@media (prefers-reduced-motion: reduce)` | CSS media query is synchronous, requires no JS, works before paint |
| Neon color variables | Inline `text-shadow` per element | Extend existing `:root` custom properties | DRY, matches existing code conventions, easy to tune |

**Key insight:** Every visual effect in this phase is achievable with pure CSS and zero new DOM nodes. Any approach that requires JavaScript to produce the visual (not trigger it) is wrong.

---

## Common Pitfalls

### Pitfall 1: `text-shadow` Performance Myth
**What goes wrong:** Developers animate `text-shadow` thinking it's "just CSS."
**Why it happens:** `text-shadow` looks like a visual property, but changing it forces paint on every frame — no GPU acceleration.
**How to avoid:** Never use `text-shadow` inside `@keyframes`. Store values as CSS custom properties and apply statically.
**Warning signs:** DevTools shows "paint" during animation frame.

### Pitfall 2: Scanline Overlay Blocks Interaction
**What goes wrong:** User cannot click cards or buttons because the scanline overlay intercepts events.
**Why it happens:** `position: fixed` with `z-index: 9999` places the overlay above all content.
**How to avoid:** Always include `pointer-events: none` on the overlay pseudo-element.
**Warning signs:** Clicks on cards do nothing; hover states don't trigger.

### Pitfall 3: Glitch Effect Missing `data-text`
**What goes wrong:** Pseudo-elements produce blank colored rectangles, not ghost text.
**Why it happens:** `content: attr(data-text)` resolves to empty string if the attribute is absent.
**How to avoid:** Set `data-text` attribute in `showResults()` before adding `glitch-active` class. Also set it statically in the HTML for the heading that shows before results (if applicable).
**Warning signs:** Glitch frames are solid color blocks with no text inside.

### Pitfall 4: Glitch Animation Runs on Input View Title
**What goes wrong:** `.page-title` glitch runs on page load or whenever JavaScript sets `glitch-active`, including when the input view is visible.
**Why it happens:** The class is added globally on `showResults()` without checking current view.
**How to avoid:** Only add `glitch-active` when entering results view. Remove it with `resetResultState()`.

### Pitfall 5: iOS Safari `position: fixed` + Scrolling
**What goes wrong:** The scanline overlay flickers or disappears during scroll on iOS Safari.
**Why it happens:** iOS Safari has a known quirk where `position: fixed` elements repaint during momentum scroll.
**How to avoid:** Adding `-webkit-transform: translateZ(0)` to the `body::after` overlay forces compositing layer promotion and eliminates the flicker.

### Pitfall 6: Card Grid Overflow at 375px
**What goes wrong:** Horizontal scrollbar appears at 375px even after fixing `minmax`.
**Why it happens:** Combined `padding` on `body` (20px each side) + `container` (20px each side) = 80px total horizontal gutters, leaving 295px. Default `minmax(160px, 1fr)` needs at least 332px (two columns + gap) to not overflow.
**How to avoid:** Reduce `minmax` to `130px` and reduce combined padding to 24px at the mobile breakpoint.

### Pitfall 7: `clip-path` not Hardware Accelerated in All Browsers
**What goes wrong:** Glitch animation is janky on lower-end Android devices.
**Why it happens:** `clip-path` is composited in Chrome/Edge but not always in older Firefox/Safari.
**How to avoid:** Keep the keyframe count low (4-6 steps), use `steps()` timing (fewer intermediate frames computed), and keep animation duration short (0.4-0.6s). Adding `will-change: clip-path` to the pseudo-elements can help but increases memory usage.

---

## Code Examples

### Complete Neon Glow Variables (VIS-02)

```css
/* Source: CSS-Tricks "How to Create Neon Text With CSS" — adapted for existing color variables */
:root {
  --neon-glow-green:
    0 0 4px #fff,
    0 0 8px rgba(0,255,65,0.8),
    0 0 16px var(--neon-green),
    0 0 32px var(--neon-green),
    0 0 60px rgba(0,255,65,0.4);
  --neon-glow-pink:
    0 0 4px #fff,
    0 0 8px rgba(255,46,151,0.8),
    0 0 16px var(--neon-pink),
    0 0 32px var(--neon-pink);
  --neon-glow-cyan:
    0 0 4px #fff,
    0 0 8px rgba(0,212,255,0.8),
    0 0 16px var(--neon-cyan),
    0 0 28px var(--neon-cyan);
}
```

### Complete Scanline Overlay (VIS-03)

```css
/* Source: CodePen pattern (codepen.io/meduzen/pen/zxbwRV, codepen.io/ynef/pen/yvvyGv) */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.18) 2px,
    rgba(0, 0, 0, 0.18) 4px
  );
  pointer-events: none;
  z-index: 9999;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
```

### showResults() Glitch Trigger (VIS-04)

```javascript
// In showResults(), after DOM updates and before requestAnimationFrame reveal:
var title = document.querySelector('#results-view .page-title');
title.setAttribute('data-text', title.textContent);
title.classList.remove('glitch-active');
requestAnimationFrame(function() {
  title.classList.add('glitch-active');
  // existing reveal:
  panel.classList.add('results-visible');
  needle.style.transform = 'rotate(' + result.risk.needleAngle + 'deg)';
});
```

### resetResultState() Cleanup (VIS-04)

```javascript
// In resetResultState(), add:
document.querySelector('#results-view .page-title').classList.remove('glitch-active');
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `clip` property for clipping | `clip-path: inset()` | ~2016 (clip deprecated) | `clip-path` is the standard; `clip` is removed in modern browsers |
| `top/right/bottom/left: 0` | `inset: 0` shorthand | CSS Logical Properties, ~2021 | Cleaner code; Safari 14.1+ required (safe for this project) |
| Vendor-prefixed `transform` | Standard `transform` | ~2015 | No prefix needed for modern targets |

**Deprecated/outdated:**
- `text-shadow` flicker via `@keyframes`: Do not use — explicit project constraint prohibits animating text-shadow.
- `clip` property: Removed from modern browsers, use `clip-path`.

---

## Open Questions

1. **Glitch animation on results title only vs. all headings**
   - What we know: VIS-04 says "key headings" — the results page has one primary heading ("Your fate is sealed") and section headings in each results card.
   - What's unclear: Whether card headings ("Estimated Shelf Life", "Automation Danger", "Final Verdict") need glitch treatment or just the main `.page-title`.
   - Recommendation: Apply glitch only to the main `.page-title` on the results view. Card headings are small (0.75rem) and don't benefit visually; glitch on tiny text reads as noise, not drama.

2. **`inset` shorthand compatibility**
   - What we know: `inset: 0` requires Safari 14.1+. The project's target audience is likely modern browsers.
   - What's unclear: No explicit browser support policy is documented.
   - Recommendation: Use fallback (`top:0; left:0; width:100%; height:100%`) on the `body::after` overlay, or verify target audience. The fallback adds 2 lines of CSS.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in (`assert/strict`, `vm`) — no install required |
| Config file | None — script is self-contained |
| Quick run command | `node scripts/verify-phase-2-results.js` |
| Full suite command | `node scripts/verify-phase-2-results.js` |

Phase 3 visual effects are CSS-only with one small JS change (adding `glitch-active` class in `showResults`). The existing verifier covers engine correctness. Visual CSS correctness cannot be automated with the current no-dependency Node verifier — it requires browser rendering.

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VIS-02 | `text-shadow` multi-layer declared on `.page-title` and `.countdown-value` | grep/content check | `grep -c 'neon-glow' index.html` (expect > 0) | Can be done inline |
| VIS-03 | `body::after` scanline overlay present in CSS | grep/content check | `grep -c 'scanlines\|repeating-linear-gradient' index.html` (expect > 0) | Can be done inline |
| VIS-04 | `glitch-active` class added in `showResults` and removed in `resetResultState` | code structure check | `grep -c 'glitch-active' index.html` (expect > 1) | Can be done inline |
| VIS-05 | Mobile layout: no overflow at 375px | Visual / browser testing | Manual browser check or DevTools device emulation at 375px | Manual only |

### Sampling Rate

- **Per task commit:** `node scripts/verify-phase-2-results.js` (ensures engine not broken by CSS changes)
- **Per wave merge:** Same + manual browser check at 375px
- **Phase gate:** Engine verifier green + manual 375px visual check before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] No automated test exists for CSS visual properties — VIS-05 must be verified manually in a browser or with DevTools device emulation at 375px.
- The existing `verify-phase-2-results.js` covers engine correctness and should be run after each CSS change to confirm no accidental breakage of the script-parsed sections.

---

## Sources

### Primary (HIGH confidence)
- CSS-Tricks "How to Create Neon Text With CSS" — multi-layer text-shadow pattern, flicker keyframes
- CSS-Tricks `prefers-reduced-motion` almanac — exact media query syntax and reduce vs. remove guidance
- CSS-Tricks "Glitch Effect on Text / Images / SVG" — clip-path keyframe pattern

### Secondary (MEDIUM confidence)
- ahmodmusa.com cyberpunk CSS tutorial — verified `::before`/`::after` glitch layer pattern with `clip-path` polygon and `@keyframes glitch-jerk`
- CodePen codepen.io/meduzen/pen/zxbwRV — scanline overlay with `pointer-events: none` (403 on direct fetch, pattern confirmed from multiple secondary sources)
- CodePen codepen.io/ynef/pen/yvvyGv — pure CSS scanlines approach
- CSS Codrops "CSS Glitch Effect" — clip-path inset() technique

### Tertiary (LOW confidence)
- WebSearch results on mobile responsive best practices — standard industry consensus, not project-specific

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; pure CSS techniques verified against CSS-Tricks official docs
- Architecture: HIGH — patterns derived from verified official sources; adapted to existing code structure
- Pitfalls: MEDIUM — most verified from official docs; iOS Safari fixed-position flicker is a known documented quirk
- Mobile layout fix: MEDIUM — identified from code inspection; specific pixel values require browser verification

**Research date:** 2026-03-17
**Valid until:** 2026-09-17 (CSS properties are stable; no breaking changes expected)
