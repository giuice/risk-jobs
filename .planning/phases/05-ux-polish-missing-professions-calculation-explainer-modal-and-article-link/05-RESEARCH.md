# Phase 5: UX Polish, Missing Professions, Calculation Explainer Modal, and Article Link - Research

**Researched:** 2026-03-18
**Domain:** Single-file HTML UX enhancement, modal design, profession data expansion
**Confidence:** HIGH

## Summary

Phase 5 enhances an existing single-file HTML app with four distinct deliverables: new profession entries with clearer names, a risk-reveal UX redesign that removes the score spoiler from selection cards, a calculation explainer modal, and a link to the translated article. All changes happen inside one `index.html` with inline CSS/JS — no framework, no build step.

The codebase is well-structured with clearly delimited sections (`// ===== DATA =====`, `// ===== ENGINE =====`, `// ===== I18N =====`, `// ===== UI =====`, `// ===== SHARE =====`, `// ===== BOOT =====`). The ENGINE layer has zero DOM access and is verified by a Node.js harness that reads the file via regex and executes it in `vm.runInNewContext`. Any new professions must integrate with that verifier pipeline. The i18n system requires both `en` and `ptbr` entries in four dictionaries (`OCCUPATION_LABELS`, `ROAST_LIBRARY.en.openers`, `ROAST_LIBRARY.ptbr.openers`, plus `ROAST_LIBRARY` middles/closers which are already complete). The modal is a new CSS/JS pattern not yet present in the codebase.

**Primary recommendation:** Add professions first (data layer), then remove the risk score from selection cards (one-line CSS/DOM change), then add the modal (new HTML + CSS + JS), then add the article link (one HTML anchor). Wire a new Phase 5 verifier to confirm occupations count, label coverage, and modal DOM presence.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS (ES5/ES6) | N/A — inline | All logic | Project constraint: no framework, no build step |
| CSS custom properties | N/A — inline | Theming and animation | Already established: `--neon-green`, `--neon-cyan`, `--neon-pink`, etc. |
| CSS `position: fixed` + `z-index` | N/A | Modal overlay | Browser-native, no dependency |
| `<dialog>` element | N/A | Semantic modal container | Native HTML; `showModal()` / `close()` API; focus trap built-in |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vm.runInNewContext` (Node) | Built-in | Verifier harness | Already used in Phase 2 and Phase 4 verifiers |
| `URLSearchParams` | Built-in | Share state | Already used in SHARE section |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `<dialog>` element | Custom `div` overlay | `<dialog>` gives focus-trap and `Escape` key close for free; `div` is simpler to style but requires manual keyboard management |
| Hide `.card-risk` via CSS `display: none` | Remove element from DOM | CSS approach is one line, reversible; DOM removal requires JS changes to `renderCards()` |

**Installation:** None — pure inline HTML/CSS/JS.

---

## Architecture Patterns

### Recommended Project Structure

```
index.html
├── <style>          ← CSS: add modal rules, remove/hide .card-risk
├── <!-- DATA -->    ← OCCUPATIONS[] — add new profession objects here
├── <!-- ENGINE -->  ← No changes
├── <!-- I18N -->    ← Add labels for new professions (OCCUPATION_LABELS, ROAST_LIBRARY openers)
├── <!-- UI -->      ← Modal open/close logic, article link render, risk-reveal UX change
├── <!-- SHARE -->   ← No changes
└── <!-- BOOT -->    ← Wire modal button event listener; add article link element
scripts/
└── verify-phase-5-ux-polish.js   ← New verifier for Phase 5
```

### Pattern 1: Native `<dialog>` for the Explainer Modal

**What:** Use the HTML `<dialog>` element with `showModal()` / `close()`. The browser handles focus trap, scroll lock, and `Escape`-to-close automatically.

**When to use:** Whenever a modal overlay is needed in a no-framework single-file app. The `<dialog>` approach is zero-dependency and has 97%+ browser support as of 2024.

**Example:**
```html
<!-- HTML (inside results-view or outside both views, before </body>) -->
<dialog id="explainer-modal" class="explainer-modal">
  <div class="explainer-modal-inner">
    <button class="modal-close-btn" id="modal-close-btn" type="button" aria-label="Close">&times;</button>
    <h2 class="modal-title" id="modal-title">How This Works</h2>
    <div class="modal-body" id="modal-body">
      <!-- content injected by JS for bilingual support -->
    </div>
  </div>
</dialog>
```

```javascript
// JS — open
document.getElementById('explainer-trigger-btn').addEventListener('click', function() {
  document.getElementById('explainer-modal').showModal();
});

// JS — close via button
document.getElementById('modal-close-btn').addEventListener('click', function() {
  document.getElementById('explainer-modal').close();
});

// JS — close on backdrop click (dialog::backdrop area)
document.getElementById('explainer-modal').addEventListener('click', function(e) {
  if (e.target === this) this.close();
});
```

```css
/* CSS — cyberpunk modal styling */
.explainer-modal {
  background: var(--bg-secondary);
  border: 1px solid var(--neon-cyan);
  border-radius: var(--border-radius);
  box-shadow: var(--glow-cyan), 0 0 60px rgba(0,212,255,0.1);
  color: var(--text-primary);
  font-family: var(--font-mono);
  max-width: 700px;
  width: calc(100% - 40px);
  max-height: 80vh;
  overflow-y: auto;
  padding: 0;
}

.explainer-modal::backdrop {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}
```

**Confidence:** HIGH — `<dialog>` is the current standard for single-file HTML modals without a framework. Source: MDN Web Docs (HTML Living Standard).

### Pattern 2: Risk Score Removal from Selection Cards

**What:** The `.card-risk` element (`Risk: X/10`) currently appears on every card in the selection grid, telegraphing the risk before the user sees results. Two approaches exist:

**Option A — CSS hide (simplest, one line):**
```css
.card .card-risk { display: none; }
```

**Option B — Remove from `renderCards()` (cleaner DOM):**
```javascript
// In renderCards(), remove these 4 lines:
// const cardRisk = document.createElement('div');
// cardRisk.className = 'card-risk';
// cardRisk.textContent = t('riskPrefix', currentLanguage) + ': ' + occ.baseScore + '/10';
// card.appendChild(cardRisk);
```

**Recommendation:** Option B — DOM removal. Removing `.card-risk` from `renderCards()` is cleaner than hiding via CSS. It removes the `t('riskPrefix')` dependency from cards, reduces DOM node count, and avoids dead CSS. The `card-risk` CSS rule can be deleted too.

**When to use:** Any time UI reveals information prematurely.

### Pattern 3: Bilingual Modal Content

**What:** Since the modal content must switch when language changes, add modal strings to `STRINGS` (both `en` and `ptbr`) and call a `renderModalContent(language)` function from `applyLanguage()`.

**Example:**
```javascript
// In STRINGS.en:
explainerModalTitle: 'How This Calculation Works',
explainerModalBody: '...full explanation text...'

// In STRINGS.ptbr:
explainerModalTitle: 'Como Este Calculo Funciona',
explainerModalBody: '...texto completo...'

// In renderStaticLabels() or new renderModalContent():
document.getElementById('modal-title').textContent = t('explainerModalTitle', currentLanguage);
document.getElementById('modal-body').innerHTML = t('explainerModalBodyHtml', currentLanguage);
```

**Note:** For formatted modal body content (headers, bullet points) use `innerHTML` assignment from a trusted string constant, not `textContent`. This is safe because the string comes from the hard-coded `STRINGS` constant, not user input.

### Pattern 4: Adding New Professions

**What:** Each new occupation requires entries in five places:

1. `OCCUPATIONS[]` — `{ id, name, baseScore }` object
2. `OCCUPATION_LABELS.en` — English display name
3. `OCCUPATION_LABELS.ptbr` — Portuguese display name
4. `ROAST_LIBRARY.en.openers` — English roast opener
5. `ROAST_LIBRARY.ptbr.openers` — Portuguese roast opener

The `ROAST_LIBRARY` middles and closers are keyed by risk band and seniority — shared across all professions — so no new entries are needed for them.

**Data contract:**
```javascript
{ id: 'nutritionists', name: 'Dietitians & Nutritionists', baseScore: 6 }
```

**Naming guidance:** The user explicitly called out that names like "HR Specialists" and "Medical Records" confuse non-technical users. Use plain language names that non-professionals recognize. Examples:
- "HR Specialists" → "HR / People & Culture" or just "Human Resources"
- "Medical Records Specialists" → "Medical Records Clerks" or "Health Records Admin"
- New additions should use the most widely understood term

### Pattern 5: Article Link

**What:** Add a visible link to `post-labor-economia-ptbr.html` on the results page. The file already exists in the repo root. The link should be bilingual (show only in PT-BR mode, or show in both languages with appropriate copy).

**Placement options:**
1. Below the share section, above "Try Again" — most visible on results page
2. In the footer of the input view — always visible

**Recommendation:** Place it on the results view, below share actions. In `renderStaticLabels()` update the link's `textContent` to a bilingual label. Since the article is Portuguese-only, it makes most sense to always show it but label it appropriately for both languages.

**Example HTML:**
```html
<div class="article-link-container" id="article-link-container">
  <a href="post-labor-economia-ptbr.html" class="article-link" id="article-link" target="_blank" rel="noopener noreferrer">
    Read: Os 7 Frameworks para Entender a Economia Pos-Trabalho
  </a>
</div>
```

### Anti-Patterns to Avoid

- **Storing rich modal HTML in JS string literals without escaping:** Safe here only because it comes from a constant, never user input. Do not set `innerHTML` from any computed or external source.
- **Adding modal to ENGINE section:** The modal is pure UI. Keep ENGINE zero-DOM.
- **Using `var` for new code while existing code uses `const/let`:** The existing file mixes `var` (ENGINE/DATA) and `const/let` (UI). Follow the convention of the section being edited: use `const/let` in UI/SHARE/BOOT sections.
- **Adding `display: none` to `.card-risk` without removing the DOM node:** CSS-only hiding leaves dead DOM and dead translation calls. Remove from `renderCards()`.
- **Forgetting to update `renderStaticLabels()` for new string keys:** Every new string key in `STRINGS` that is rendered as a static label needs a corresponding `getElementById(...).textContent = t(key, ...)` line in `renderStaticLabels()`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap for modal | Custom `tabindex` management | `<dialog>.showModal()` | Native browser handles focus, Escape key, scroll lock |
| Backdrop click-to-close | Synthetic event delegation | `dialog.addEventListener('click', e => e.target === dialog && dialog.close())` | One-liner, works with native dialog |
| Modal animation | JS-driven animation | CSS `@keyframes` + `dialog[open]` selector | No JS layout thrash; respects `prefers-reduced-motion` |
| Bilingual modal content render | Separate modal per language | Single modal with `renderModalContent(lang)` | Consistent with applyLanguage() pattern already established |

**Key insight:** The `<dialog>` element eliminates ~80% of modal boilerplate code that developers typically hand-roll (focus trap, Escape key, backdrop, scroll lock). Use it.

---

## Common Pitfalls

### Pitfall 1: Verifier Breaks When Occupation Count Changes

**What goes wrong:** `verify-phase-4-i18n-share.js` and `verify-phase-2-results.js` assert exact occupation counts. Adding professions without updating the verifier causes CI-level failures.

**Why it happens:** The verifiers read `OCCUPATIONS.length` from the extracted DATA section and compare to expected values (`21`).

**How to avoid:** Create `scripts/verify-phase-5-ux-polish.js` that asserts the new count explicitly. Also check whether existing verifiers hardcode `21` — if so, update those hardcoded counts when adding occupations.

**Warning signs:** Verifier exits non-zero with "Expected 21 occupations, got 25."

### Pitfall 2: Missing OCCUPATION_LABELS or ROAST openers for New Profession

**What goes wrong:** `getOccupationLabel(id, lang)` falls back to the occupation `id` string (e.g., `"nutritionists"`) instead of a human-readable name. `buildLocalizedRoast()` returns an empty string if opener is missing.

**Why it happens:** The DATA section (`OCCUPATIONS[]`) and I18N section (`OCCUPATION_LABELS`, `ROAST_LIBRARY.openers`) are separate. Adding to one but not the other is the most common mistake.

**How to avoid:** Treat each new profession as requiring 5 simultaneous additions (see Pattern 4). The Phase 5 verifier should assert `OCCUPATION_LABELS.en[id]` and `OCCUPATION_LABELS.ptbr[id]` exist for every occupation in `OCCUPATIONS`.

**Warning signs:** Card shows occupation ID instead of name; roast message shows only middle + closer (no opener).

### Pitfall 3: `<dialog>` Scrolling Issue on Mobile

**What goes wrong:** On iOS Safari, `<dialog>` with `overflow-y: auto` and `max-height: 80vh` can lose its scroll behavior if the parent has certain positioning or transform properties. The body scanline `::after` pseudo with `position: fixed; z-index: 9999` is a potential interaction.

**Why it happens:** iOS Safari has known bugs with `position: fixed` inside scrollable containers near `transform: translateZ(0)` (already on `body::after`).

**How to avoid:** Test the modal scroll on a 375px viewport. If needed, add `-webkit-overflow-scrolling: touch` to `.explainer-modal`. The dialog's `z-index` must be set high enough to appear above the scanline overlay (`z-index: 9999` on body::after).

**Warning signs:** Modal appears but cannot be scrolled on mobile; scanlines cover the modal content.

**Fix:** Set `z-index: 10000` on `.explainer-modal` or restructure the scanline overlay.

### Pitfall 4: `innerHTML` in Modal Content Breaks i18n Rerender

**What goes wrong:** If the modal body uses formatted HTML (e.g., `<h3>`, `<ul>`, `<p>`), setting `innerHTML` from `STRINGS` works fine on first render. But if the value is set only once in `init()` and not updated in `applyLanguage()`, it stays in the initial language after toggle.

**Why it happens:** `applyLanguage()` calls `renderStaticLabels()`, but if modal body content is set in `init()` only, it is not re-rendered on language change.

**How to avoid:** Add a `renderModalContent(language)` function that sets both `modal-title` and `modal-body` innerHTML/textContent. Call it from `applyLanguage()` alongside `renderStaticLabels()`.

### Pitfall 5: `<dialog>` z-index vs Scanline Overlay

**What goes wrong:** The existing `body::after` scanline has `z-index: 9999`. A `<dialog>` rendered via `showModal()` creates a new stacking context on the top layer, which in most browsers sits above everything including `z-index: 9999` elements. However, `position: fixed` descendants of the dialog with explicit `z-index` might not behave as expected.

**Why it happens:** The CSS top layer (used by `showModal()`) is above all other stacking contexts. The `::backdrop` is part of this top layer.

**How to avoid:** This is actually the desired behavior — the dialog appearing above the scanlines is correct. No action needed, but test to confirm the scanlines don't overlay the modal content.

---

## New Professions Data

Based on Karpathy's live data at karpathy.ai/jobs and the existing score methodology, the following professions are strong candidates for addition. Confidence on scores is MEDIUM (verified against Karpathy's live tool) except where noted LOW (inferred from methodology).

| Profession | Suggested ID | baseScore | Source/Reasoning |
|------------|-------------|-----------|-----------------|
| Dietitians & Nutritionists | `nutritionists` | 6 | Verified: Karpathy scores.json data=6, hybrid digital/physical |
| Dentists | `dentists` | 3 | Verified: Karpathy data=3, physical hands-on work |
| Chefs & Head Cooks | `chefs` | 3 | Verified: Karpathy data=3, physical kitchen work |
| Electricians | `electricians` | 2 | Verified: Karpathy data=2, trades physical work |
| Bus Drivers / Transit Operators | `transit-drivers` | 4 | Verified: Karpathy data=4 (Bus Drivers) |
| Airline Pilots | `airline-pilots` | 5 | Verified: Karpathy data=5 |
| Air Traffic Controllers | `air-traffic-controllers` | 7 | Verified: Karpathy data=7 |
| Elementary/Secondary Teachers | `school-teachers` | 5 | LOW — inferred from hybrid role pattern; not directly in fetched data |
| Nurses (RN) | `registered-nurses` | 4 | LOW — inferred from physical+digital hybrid; not in fetched data |
| Police Officers | `police-officers` | 3 | LOW — physical public safety role |

**Clearer name recommendations for existing professions:**

| Current Name | Clearer Name | Rationale |
|---|---|---|
| `HR Specialists` | `Human Resources (RH)` | "RH" is the common Brazilian term; "HR" confuses many |
| `Medical Records Specialists` | `Medical Records Clerk` | "Specialists" sounds vague; "Clerk" is widely understood |
| `Computer Systems Analysts` | `IT Systems Analyst` | "Computer Systems" is jargon; "IT" is universally understood |
| `Computer Support Specialists` | `IT Help Desk / Support` | "Computer Support Specialist" is too formal; "Help Desk" is recognized |
| `Financial Clerks` | `Bank / Finance Clerk` | Adds context; "Financial Clerk" alone is not self-explanatory |

---

## Code Examples

### Calculation Explainer Content (both languages)

The explainer modal should explain the formula accessibly. Here is the content structure:

**English (en):**

```
Title: How This Calculation Works

[For Laypeople]
We use data from AI researcher Andrej Karpathy's analysis of 342 US occupations
to give each job a "Base AI Exposure Score" from 0 to 10.
Jobs done entirely on a computer score high. Jobs requiring physical presence score low.

[The Formula]
1. Base Score (0-10): How exposed is your job type to AI automation?
2. Seniority Adjustment: -1.5 points per seniority level (Junior=0, Mid=-1.5, Senior=-3, Architect=-4.5)
   Adjusted Score = Base Score - (Seniority Level x 1.5), clamped to 0-10
3. Shelf Life: (10 - Adjusted Score) x 1.2, max 12 years
   A score of 10 = 0 years. A score of 0 = 12 years.

[Risk Bands]
LOW RISK (0-2.5): Machines only have you bookmarked.
WATCHLIST (2.5-4.5): Replacement memo drafted, awaiting budget.
EXPOSED (4.5-6.5): No longer future-proof.
CRITICAL (6.5-8.5): Automation pilot has your chair in its rollout plan.
DOOMED (8.5-10): AI is just asking where you keep the passwords.

[For Scientists]
This is a heuristic model, not a rigorous economic forecast.
Scores are LLM-estimated (Gemini Flash / OpenRouter) against BLS Occupational Outlook data.
The seniority modifier is a linear penalty reflecting human capital as a partial moat.
No model predicts the future — this is a thinking tool, not a prophecy.
```

**Portuguese (ptbr):** Mirror content in PT-BR, maintaining the cyberpunk voice.

### Modal HTML Skeleton

```html
<dialog id="explainer-modal" class="explainer-modal" aria-labelledby="modal-title-heading">
  <div class="explainer-modal-inner">
    <div class="modal-header">
      <h2 class="modal-title" id="modal-title-heading"></h2>
      <button class="modal-close-btn" id="modal-close-btn" type="button" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body" id="modal-body"></div>
  </div>
</dialog>
```

### Trigger Button Placement (results view)

Place after `.share-actions` and before `.try-again-container`:
```html
<div class="explainer-trigger-container">
  <button type="button" class="explainer-trigger-btn" id="explainer-trigger-btn">
    HOW IS THIS CALCULATED?
  </button>
</div>
```

### Article Link HTML

```html
<div class="article-link-container" id="article-link-container">
  <a href="post-labor-economia-ptbr.html"
     class="article-link"
     id="article-link"
     target="_blank"
     rel="noopener noreferrer">
    <!-- textContent set by renderStaticLabels() -->
  </a>
</div>
```

**STRINGS entries:**
```javascript
en: {
  articleLinkLabel: 'Read: The 7 Frameworks for Understanding the Post-Labor Economy (PT-BR)'
},
ptbr: {
  articleLinkLabel: 'Leia: Os 7 Frameworks para Entender a Economia Pos-Trabalho'
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `div` overlay modals with manual focus trap | `<dialog>` element with `showModal()` | ~2022-2023 (broad support) | Eliminates ~50 lines of keyboard/focus JS |
| `display: none` CSS toggle for modals | `dialog[open]` attribute selector | Same | More semantic, Escape key built-in |

**Deprecated/outdated:**
- Custom focus-trap libraries for simple modals: unnecessary when `<dialog>.showModal()` is available.
- Scrollbar-shifting techniques to prevent body scroll shift on modal open: `<dialog>` handles this natively.

---

## Open Questions

1. **How many professions to add?**
   - What we know: Current list has 21 occupations. The user wants nutritionist and dentist at minimum, plus others.
   - What's unclear: Is there a target number? More cards = more scroll on the selection grid.
   - Recommendation: Add 6-8 well-chosen professions to reach ~27-29. Avoid making the grid unwieldy. Each new profession requires EN + PT-BR labels + roast opener. The planner should pick a concrete number and scope roast content writing accordingly.

2. **Risk reveal UX — full redesign or minimal fix?**
   - What we know: The user says the card showing "Risk: X/10" spoils the result suspense. Removing `card-risk` from `renderCards()` is the minimal fix.
   - What's unclear: Does the user want something more elaborate, like a "reveal" animation on the card after selecting, or simply removing the score? The description says "design a better way to reveal the result."
   - Recommendation: The planner should interpret this as: (1) remove `card-risk` score from selection cards, and (2) keep the existing results page reveal animation (staggered countdown/gauge/roast) — which already creates the dramatic reveal. No new UI needed on the selection screen unless the user specifies otherwise.

3. **Article link visibility: both languages or PT-BR only?**
   - What we know: The article (`post-labor-economia-ptbr.html`) is Portuguese-only.
   - What's unclear: Should the link show when language is set to English?
   - Recommendation: Show in both languages. For English, label it clearly as a Portuguese article. Many EN users may be Brazilian diaspora. The link is static and costs nothing to show.

4. **Explainer modal: trigger location?**
   - What we know: User wants a button to open the modal.
   - What's unclear: Where — on results view only, or also on input view?
   - Recommendation: Results view only, after the share section. This is where context is richest (they just saw their score). A secondary "?" button near the input view title could also be considered by the planner as a lower-priority addition.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in (`assert/strict`, `vm`, `fs`) — no install |
| Config file | None — scripts run directly |
| Quick run command | `node scripts/verify-phase-5-ux-polish.js` |
| Full suite command | `node scripts/verify-phase-2-results.js && node scripts/verify-phase-4-i18n-share.js && node scripts/verify-phase-5-ux-polish.js` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| PROF-NEW | All new occupations have EN + PT-BR labels | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ Wave 0 |
| PROF-NEW | All new occupations have roast openers in both languages | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ Wave 0 |
| PROF-NEW | All new occupations produce valid result models | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ Wave 0 |
| CARD-UX | `.card-risk` element absent from rendered DOM | smoke | Manual browser check (no automated DOM test without browser) | manual-only |
| MODAL | `#explainer-modal` element present in HTML | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ Wave 0 |
| MODAL | Modal title/body string keys exist in both languages | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ Wave 0 |
| ARTICLE | `#article-link` element with correct `href` present in HTML | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ Wave 0 |
| I18N-COMPAT | Existing Phase 4 verifier still passes | regression | `node scripts/verify-phase-4-i18n-share.js` | ✅ exists |
| ENGINE-COMPAT | Existing Phase 2 verifier still passes | regression | `node scripts/verify-phase-2-results.js` | ✅ exists |

### Sampling Rate

- **Per task commit:** `node scripts/verify-phase-5-ux-polish.js`
- **Per wave merge:** `node scripts/verify-phase-2-results.js && node scripts/verify-phase-4-i18n-share.js && node scripts/verify-phase-5-ux-polish.js`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `scripts/verify-phase-5-ux-polish.js` — covers PROF-NEW (labels, roast openers, result models), MODAL (element presence, string keys), ARTICLE (href presence)

*(Existing Phase 2 and Phase 4 verifiers cover regression; only new verifier file is missing.)*

---

## Sources

### Primary (HIGH confidence)

- MDN Web Docs: `<dialog>` element — `showModal()`, `close()`, `::backdrop`, focus management behavior
- Live karpathy.ai/jobs data.json — profession scores for nutritionists (6), dentists (3), chefs (3), electricians (2), bus drivers (4), airline pilots (5), air traffic controllers (7)
- index.html source (read directly) — DATA, ENGINE, I18N, UI, SHARE, BOOT section structure, existing OCCUPATIONS array (21 entries), renderCards(), applyLanguage(), renderStaticLabels() patterns

### Secondary (MEDIUM confidence)

- WebSearch: Karpathy jobs repo confirmed deleted from GitHub post March 15, 2026; data.json still live at karpathy.ai/jobs
- WebSearch: Karpathy scoring methodology ("if done entirely on a computer: 7+; physical presence required: 0-3")

### Tertiary (LOW confidence)

- Inferred scores for nurses (4), school teachers (5), police officers (3) — not directly fetched from data.json but consistent with Karpathy's published methodology

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `<dialog>` is browser-native with high support; vanilla JS/CSS patterns verified against existing codebase
- Architecture: HIGH — directly read from index.html source; all patterns match existing code conventions
- Profession scores: HIGH for Karpathy-verified occupations (nutritionists=6, dentists=3, chefs=3, electricians=2, bus drivers=4, airline pilots=5, air traffic controllers=7); LOW for inferred (nurses, teachers, police)
- Pitfalls: HIGH — derived from direct code inspection of body::after z-index, renderCards() DOM structure, applyLanguage() render pipeline

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable domain — HTML/CSS/JS patterns don't change rapidly)
