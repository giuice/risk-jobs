# Architecture Research

**Domain:** Self-contained single-page web app (single HTML file, no build step)
**Researched:** 2026-03-17
**Confidence:** HIGH — patterns are established, constraint set is narrow and well-understood

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    index.html (single file)                  │
├──────────────┬──────────────────────────┬───────────────────┤
│  <style>     │        <body>            │    <script>        │
│  (CSS)       │        (HTML)            │    (JS)            │
├──────────────┼──────────────────────────┼───────────────────┤
│ 1. Variables │ Section A: Input Form    │ DATA layer         │
│ 2. Base/     │  - Profession select     │  - OCCUPATIONS[]   │
│    Reset     │  - Years input           │  - ROASTS{}        │
│ 3. Layout    │  - Lang toggle           │  - I18N{}          │
│ 4. Input     │  - Submit button         │                    │
│    section   │                          │ ENGINE layer       │
│ 5. Results   │ Section B: Results       │  - calculate()     │
│    section   │  - Risk gauge            │  - getSeniority()  │
│ 6. Anims /   │  - Countdown display     │  - getShelfLife()  │
│    effects   │  - Roast message         │  - getRoast()      │
│ 7. Responsive│  - Share buttons         │                    │
│              │                          │ UI layer           │
│              │                          │  - showResults()   │
│              │                          │  - renderGauge()   │
│              │                          │  - runCountdown()  │
│              │                          │  - animateEntry()  │
│              │                          │                    │
│              │                          │ I18N layer         │
│              │                          │  - setLang()       │
│              │                          │  - t()             │
│              │                          │                    │
│              │                          │ SHARE layer        │
│              │                          │  - shareTwitter()  │
│              │                          │  - shareWhatsApp() │
│              │                          │  - shareLinkedIn() │
│              │                          │                    │
│              │                          │ BOOT               │
│              │                          │  - init()          │
│              │                          │  - event listeners │
└──────────────┴──────────────────────────┴───────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implemented As |
|-----------|----------------|----------------|
| DATA layer | Static lookup tables — occupations, roasts, i18n strings | Frozen JS objects at top of script block |
| ENGINE layer | Pure calculation functions, no DOM access | Standalone pure functions |
| UI layer | DOM mutation, animation triggers, view switching | Functions that accept data, write to DOM |
| I18N layer | Language state, string lookup, DOM re-render on toggle | Single `lang` variable + `t()` translator function |
| SHARE layer | URL construction and `window.open()` calls | Simple functions, called on button click |
| BOOT | Event binding, initial language detection | `init()` called at DOMContentLoaded |

## Recommended File Structure

Because this is a single HTML file, "structure" means section ordering within the file:

```
index.html
├── <head>
│   ├── meta charset, viewport, OG tags
│   ├── title (bilingual — use JS to set)
│   └── <style>
│       ├── :root { CSS custom properties }  ← single source of truth for colors/spacing
│       ├── * { box-sizing, reset }
│       ├── body, base typography
│       ├── .input-section (Form view)
│       ├── .results-section (Results view, initially hidden)
│       ├── .gauge (gauge meter component)
│       ├── .countdown (timer display)
│       ├── .roast (roast message block)
│       ├── .share-buttons
│       ├── @keyframes (glitch, pulse, flicker)
│       └── @media (responsive breakpoints)
│
└── <body>
    ├── #app (root container)
    │   ├── #lang-toggle (EN | PT-BR button, always visible)
    │   ├── #input-section
    │   │   ├── h1 (headline, data-i18n="headline")
    │   │   ├── #profession-select
    │   │   ├── #years-input
    │   │   └── #calculate-btn
    │   └── #results-section (hidden initially)
    │       ├── #gauge-container
    │       ├── #countdown-display
    │       ├── #roast-message
    │       ├── #try-again-btn
    │       └── #share-buttons
    │           ├── #share-twitter
    │           ├── #share-whatsapp
    │           └── #share-linkedin
    │
    └── <script>
        ├── // === DATA ===
        │   ├── const OCCUPATIONS = [...]   ← array of {id, label_en, label_pt, baseScore}
        │   ├── const ROASTS = {...}         ← keyed by occupation id + seniority level
        │   └── const I18N = {...}           ← keyed by string id, contains {en, pt} values
        │
        ├── // === ENGINE (pure functions, no DOM) ===
        │   ├── function getSeniority(years)
        │   ├── function calculate(baseScore, seniority)
        │   └── function getShelfLife(adjustedScore)
        │
        ├── // === I18N ===
        │   ├── let currentLang = 'en'      ← single mutable state for language
        │   ├── function t(key)              ← returns I18N[key][currentLang]
        │   └── function applyLang()         ← queries all [data-i18n] elements, re-renders
        │
        ├── // === UI ===
        │   ├── function showResults(result)
        │   ├── function renderGauge(score)
        │   ├── function renderCountdown(years)
        │   ├── function renderRoast(roastText)
        │   └── function triggerAnimations()
        │
        ├── // === SHARE ===
        │   ├── function buildShareText(result)
        │   ├── function shareTwitter()
        │   ├── function shareWhatsApp()
        │   └── function shareLinkedIn()
        │
        └── // === BOOT ===
            ├── function init()
            └── document.addEventListener('DOMContentLoaded', init)
```

### Structure Rationale

- **DATA at top of script:** Embedding all lookup tables first makes them readable as configuration. Anyone editing roast messages or adding occupations finds them immediately without scrolling through logic.
- **ENGINE before UI:** Pure functions with no DOM dependencies can be read and tested mentally without knowing HTML structure. Keeps calculation logic auditable.
- **I18N layer as thin wrapper:** A single `t(key)` function returning `I18N[key][currentLang]` is sufficient. No library needed. The `data-i18n` attribute convention on HTML elements makes `applyLang()` a simple querySelector loop.
- **UI functions accept data, not events:** `showResults(result)` takes a plain object. It never calls `calculate()` itself. This enforces unidirectional flow and makes each function independently testable in the browser console.
- **BOOT section last:** Event listeners bind at the end after all functions are defined, avoiding forward-reference errors from `var` hoisting issues.

## Architectural Patterns

### Pattern 1: View Switching via CSS Class Toggle

**What:** Two sections exist in the DOM at all times. Input section is visible by default; results section has `display: none`. Clicking "Calculate" adds `.hidden` to input and removes it from results (or vice versa for "Try Again").
**When to use:** Always, for this app. Avoids innerHTML replacement which loses event listeners.
**Trade-offs:** Both sections always in DOM (negligible for this app size). Avoids re-render complexity entirely.

**Example:**
```javascript
function showResults(result) {
  document.getElementById('input-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  renderGauge(result.adjustedScore);
  renderCountdown(result.shelfLife);
  renderRoast(result.roastText);
  triggerAnimations();
}
```

### Pattern 2: data-i18n Attribute Convention

**What:** Every user-facing text element carries a `data-i18n="key"` attribute. `applyLang()` queries all such elements and sets their `textContent` from the I18N table. Dynamic content (roast messages, countdown) is set directly via `textContent` without `data-i18n`.
**When to use:** All static UI chrome (labels, buttons, headings, placeholder text). Not for dynamic calculation output.
**Trade-offs:** Clean separation of static strings from dynamic output. Adding a new language requires only expanding the I18N object and adding a toggle option.

**Example:**
```javascript
const I18N = {
  headline: {
    en: "How Long Do You Have Left?",
    pt: "Quanto Tempo Você Ainda Tem?"
  },
  calculate_btn: {
    en: "Calculate My Doom",
    pt: "Calcular Meu Fim"
  }
};

function t(key) {
  return I18N[key]?.[currentLang] ?? key;  // fallback to key if missing
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  // Also update placeholders separately
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}
```

### Pattern 3: Pure Calculation Engine

**What:** All math is in functions that take primitive arguments and return plain objects. Zero DOM access inside ENGINE functions.
**When to use:** Always for calculation logic. Never mix DOM reads/writes into calculation functions.
**Trade-offs:** Slightly more function calls, but each layer is independently verifiable in the console.

**Example:**
```javascript
function getSeniority(years) {
  if (years <= 2)  return { level: 'junior',    sLevel: 0 };
  if (years <= 5)  return { level: 'mid',       sLevel: 1 };
  if (years <= 9)  return { level: 'senior',    sLevel: 2 };
  return               { level: 'architect', sLevel: 3 };
}

function calculate(baseScore, years) {
  const { level, sLevel } = getSeniority(years);
  const adjustedScore = baseScore - (sLevel * 1.5);
  const shelfLife = getShelfLife(adjustedScore);
  return { adjustedScore, shelfLife, level };
}

// Called from UI event handler:
const result = calculate(selectedOccupation.baseScore, yearsInput);
showResults({ ...result, roastText: getRoast(occupationId, result.level) });
```

### Pattern 4: CSS Custom Properties for Theming

**What:** Define all colors, neon glow values, font sizes as `--var` in `:root`. Components reference variables, not hardcoded values.
**When to use:** Especially important for cyberpunk theme — neon glow colors appear in many elements (text-shadow, box-shadow, border). Change once, updates everywhere.
**Trade-offs:** None for this app size. Essential for maintaining visual consistency.

**Example:**
```css
:root {
  --color-bg: #0a0a0f;
  --color-primary: #00ff9f;
  --color-danger: #ff003c;
  --color-warn: #ffaa00;
  --glow-primary: 0 0 10px #00ff9f, 0 0 20px #00ff9f40;
  --font-mono: 'Courier New', Courier, monospace;
}
```

## Data Flow

### Primary Flow: User Submits Form

```
User selects profession + enters years → clicks "Calculate"
    ↓
Event listener reads DOM values (profession id, years as int)
    ↓
calculate(baseScore, years) → { adjustedScore, shelfLife, level }
    ↓
getRoast(occupationId, level) → roastText string
    ↓
showResults({ adjustedScore, shelfLife, level, roastText })
    ↓
  ├── renderGauge(adjustedScore)   → writes gauge fill width %
  ├── renderCountdown(shelfLife)   → writes years/months/days text
  ├── renderRoast(roastText)       → writes roast message
  └── triggerAnimations()          → adds CSS animation classes
```

### Language Toggle Flow

```
User clicks lang toggle button
    ↓
setLang('pt' | 'en') → updates currentLang variable
    ↓
applyLang() → querySelectorAll('[data-i18n]') → sets textContent from I18N table
    ↓
If results section is visible:
    re-render roast message in new language (getRoast returns lang-aware string)
```

### Share Flow

```
User clicks share button
    ↓
buildShareText(lastResult) → constructs share message string using t() for i18n
    ↓
shareTwitter() / shareWhatsApp() / shareLinkedIn()
    → encodes text, opens window.open() with platform URL
```

### State Model

The app has minimal mutable state — only two values ever change:

| State Variable | Type | Changed By | Read By |
|----------------|------|------------|---------|
| `currentLang` | string ('en'/'pt') | `setLang()` | `t()`, `applyLang()`, `getRoast()` |
| `lastResult` | object or null | `showResults()` | `shareTwitter/WhatsApp/LinkedIn()` |

No state management library needed. No reactivity system. These two variables live in module scope within the script block.

## Build Order

Build in this order to validate each layer before the next depends on it:

1. **HTML skeleton + CSS variables** — Create both sections (input, results), add all `data-i18n` attributes, define `:root` CSS variables. Nothing functional yet, but the visual canvas exists.

2. **DATA layer** — Write `OCCUPATIONS[]`, `I18N{}` (just a few keys to start), and stub `ROASTS{}`. Populate the profession `<select>` from `OCCUPATIONS` via a small init loop. Validates data structure.

3. **ENGINE layer** — Implement `getSeniority()`, `calculate()`, `getShelfLife()`. Test in browser console: `calculate(9, 7)` should return expected values without any UI.

4. **Basic UI flow** — Wire up the "Calculate" button to show results section with hardcoded placeholder values. Confirms view-switching works before adding complexity.

5. **Results rendering** — Implement `renderGauge()`, `renderCountdown()`, `renderRoast()`. Connect to real ENGINE output. At this point the core loop works end-to-end.

6. **CSS styling + animations** — Apply cyberpunk theme, `@keyframes`, glitch effects. Validate on mobile viewport. This is a dedicated pass after functionality is confirmed.

7. **I18N layer** — Add remaining I18N keys, implement `t()` and `applyLang()`, wire up lang toggle. Test by switching languages and verifying all static strings update.

8. **Roast messages** — Write all pre-canned roast strings (bilingual). This is content work, not architecture work — do it after the rendering pipeline accepts them.

9. **Social share** — Implement `buildShareText()` and share functions. Requires `lastResult` to be populated (depends on step 5).

10. **Polish pass** — OG meta tags, favicon, mobile fine-tuning, cross-browser check (Chrome, Firefox, Safari mobile).

## Scaling Considerations

This is a static single-file app. "Scaling" means file size and maintainability, not server load.

| Scale | Concern | Approach |
|-------|---------|----------|
| Current (21 occupations, 2 languages) | File size, readability | Inline everything, organized sections |
| +5 languages | I18N object grows large | Still viable inline; consider splitting to JSON if >5 languages |
| +50 occupations | OCCUPATIONS array grows | Still inline; generate select via JS loop (already planned) |
| Roast messages (4 levels × 21 occupations × 2 languages) = 168 strings | Biggest content bloat | Still inline; minified this is ~30KB, acceptable |

GitHub Pages serves static files globally via CDN. The only "scaling" concern is first-byte load time, which is irrelevant for a file under 200KB.

## Anti-Patterns

### Anti-Pattern 1: Mixing Calculation and DOM Access

**What people do:** Read from `document.getElementById('years-input').value` inside `calculate()` or call `calculate()` from inside `renderGauge()`.
**Why it's wrong:** Tightly couples engine to specific DOM IDs. Can't test calculation without a real DOM. Makes refactoring a selector break the math.
**Do this instead:** Event handler reads DOM values once, passes primitives to ENGINE functions. ENGINE returns plain objects. UI functions receive those objects.

### Anti-Pattern 2: innerHTML for Rendering Dynamic Content

**What people do:** Build HTML strings: `resultsDiv.innerHTML = '<p>' + roastMessage + '</p>'`
**Why it's wrong:** XSS risk if any user-controlled string ever touches innerHTML. Also clobbers event listeners on child elements.
**Do this instead:** Use `textContent` for text nodes. Use `classList` for state. Use pre-existing DOM elements that are shown/hidden rather than rebuilt.

### Anti-Pattern 3: Duplicating Text Strings in HTML and JS

**What people do:** Write button labels directly in HTML, then also store them in the I18N object, then also hardcode them in share messages.
**Why it's wrong:** Adding a third language requires finding and updating three locations. Strings drift out of sync.
**Do this instead:** All user-visible text goes in `I18N{}`. HTML elements carry `data-i18n` attributes only. `applyLang()` is the single place that writes text to the DOM.

### Anti-Pattern 4: Global Variables for Everything

**What people do:** Use `var occupation`, `var years`, `var score` as top-level variables, mutated from multiple event handlers.
**Why it's wrong:** Hard to trace which handler last modified a value. Race conditions if any async operations are added later.
**Do this instead:** Read values inside the event handler scope. Only persist state that genuinely needs to survive across events (`currentLang`, `lastResult`). Keep both mutable globals explicit and documented.

### Anti-Pattern 5: Animating Before DOM Paint

**What people do:** Call animation functions immediately inside `showResults()` before the browser has painted the revealed section.
**Why it's wrong:** CSS animations on `display: none` elements that just became visible may not trigger correctly in all browsers.
**Do this instead:** Trigger animations via `requestAnimationFrame()` or a minimal `setTimeout(triggerAnimations, 0)` after showing the section, to ensure the browser has had a paint cycle.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Twitter/X share | `window.open('https://twitter.com/intent/tweet?text=...')` | No API key needed; uses web intent URL |
| WhatsApp share | `window.open('https://wa.me/?text=...')` | Works on mobile (native app) and desktop (web) |
| LinkedIn share | `window.open('https://www.linkedin.com/sharing/share-offsite/?url=...')` | URL-based sharing; no API key needed |
| Google Fonts | `<link rel="preconnect">` + `@import` or system font fallback | Optional — for cyberpunk aesthetic consider system monospace first to avoid external dependency |
| GitHub Pages | Static file host; no configuration beyond repository settings | Serves `index.html` at root automatically |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Event handler → ENGINE | Pass primitives (baseScore: number, years: number) | No DOM objects cross this boundary |
| ENGINE → UI | Return plain object `{ adjustedScore, shelfLife, level }` | UI receives data, owns its own DOM writes |
| UI → SHARE | `lastResult` module-scoped variable | Share functions read last computed result; only set after successful calculation |
| I18N → UI | `t(key)` function call | UI functions call `t()` for any string they write to DOM |

## Sources

- Project requirements: `/home/giuice/apps/risk-jobs/.planning/PROJECT.md`
- Pattern confidence: HIGH — these are standard vanilla JS single-file patterns with no external dependencies to verify. The constraints (no framework, no build step, no API calls) narrow the solution space to a small set of well-understood approaches.
- i18n via data attributes: Established convention used in projects like Bootstrap (data-bs-*), Alpine.js (x-*), htmx. No library reference needed — the pattern pre-dates frameworks.
- CSS custom properties for theming: MDN-documented, universally supported since 2017. Safari 9.1+, Chrome 49+, Firefox 31+.

---
*Architecture research for: Single HTML file dark humor calculator (AI Job Death Clock)*
*Researched: 2026-03-17*
