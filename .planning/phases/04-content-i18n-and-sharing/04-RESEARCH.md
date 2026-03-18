# Phase 4: Content, i18n, and Sharing - Research

**Researched:** 2026-03-18
**Domain:** Single-file client-side localization, result-linked sharing, and static social metadata
**Confidence:** HIGH

---

## Summary

Phase 4 is mostly architecture and content work, not new rendering technology. The existing app already has the full result engine, the animated results screen, and a clean section split in `index.html` (`DATA`, `ENGINE`, `I18N`, `UI`, `SHARE`, `BOOT`). The safest approach is to preserve the pure engine contract and add a localization/share layer on top of it.

Two constraints drive the plan:

1. The app is GitHub Pages + one shipped HTML file, so all localization, persistence, and share-state hydration must happen in the browser with no server help.
2. Share previews are platform-controlled. A hash can restore the correct result in the app, but crawlers do not receive the fragment, so result-specific Open Graph previews are not possible on this architecture. Generic OG tags are still required for decent previews.

The main implementation recommendation is:

- keep `OCCUPATIONS`, `SENIORITY_LEVELS`, and `buildResultModel()` stable for Phase 2 verification compatibility
- move all human-facing copy into locale catalogs keyed by stable ids
- build share URLs from stable ids and language code only
- hydrate from `location.hash` before showing either view, so shared links open directly to the result
- treat LinkedIn as URL-first sharing with OG preview support, because custom external prefilled post text is not a reliable platform capability

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| I18N-01 | User can toggle between English and Portuguese (PT-BR) | Keep a `currentLanguage` state plus a single `applyLanguage()` render pass for both views. |
| I18N-02 | All UI text exists in both languages | Store every visible string in locale catalogs keyed by semantic ids; no hard-coded English left in HTML render flow. |
| I18N-03 | All roast messages exist in both languages | Reuse the existing composition model with translated opener/middle/closer maps keyed by occupation, risk band, and seniority. |
| I18N-04 | Language preference persists across page reload | Persist locale in `localStorage`; use hash locale only as shared-link override. |
| SHR-01 | User can share result on Twitter/X with pre-filled text | X Web Intent officially supports `text`, `url`, `hashtags`, and `via` query params. |
| SHR-02 | User can share result on WhatsApp with pre-filled text | Use click-to-chat style share URL with encoded text + result URL. |
| SHR-03 | User can share result on LinkedIn | Use LinkedIn URL sharing flow plus OG tags; custom external prefilled commentary is not reliable. |
| SHR-04 | Shared URL contains result state in hash | Serialize `occupationId`, `experienceId`, and `lang` into `location.hash`; hydrate before first visible view. |
| SHR-05 | Page has Open Graph meta tags for rich link previews | Add static OG/Twitter meta tags in `<head>` and a stable preview image URL if available. |

</phase_requirements>

---

## Standard Stack

### Core

| Library / API | Purpose | Why Standard |
|---------------|---------|--------------|
| Plain JS objects in `index.html` | Locale catalogs and share templates | Matches project constraint: no dependencies, no build step |
| `localStorage` | Persist language preference | Native browser API, works on GitHub Pages |
| `location.hash` / `URL.hash` | Shareable result state | Client-controlled, no server dependency |
| Existing Node verifier pattern (`fs`, `vm`, `assert/strict`) | Phase 4 automated checks | Consistent with Phase 2 verification approach |

### Supporting

| Technique | Purpose | When to Use |
|-----------|---------|-------------|
| Semantic string keys (`title.input`, `cta.calculate`) | Swap UI copy without DOM guesswork | All visible UI text |
| Locale-specific roast component maps | Preserve 84 distinct combinations per language | Roast content |
| Stable id serialization | Avoid translated labels in URLs | Hash state + share URLs |
| Generic static OG tags | Rich previews for shared links | X / LinkedIn / messaging apps |
| Boot gating via hidden views until hydration finishes | Prevent input-view flash on shared links | Initial page load with hash |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline locale catalogs | i18n library | Unnecessary weight and violates project simplicity |
| Hash state | Query parameters | Query affects cache/canonical semantics and still would not solve dynamic OG on static hosting |
| Rebuilding engine outputs with translated labels inside `ENGINE` | UI-side label lookup by ids | Engine mutation risks breaking Phase 2 verifier and pure/data boundaries |
| Result-specific OG tags at runtime | Static generic OG tags | Runtime tag changes are invisible to crawlers and social scrapers |

---

## Architecture Patterns

### Pattern 1: Preserve the Engine, Localize in I18N/UI

The current engine and verifier already agree on the `buildResultModel()` contract. Do not localize inside `ENGINE`. Keep engine data keyed by stable ids and resolve human copy later.

Recommended shape:

```js
const STRINGS = {
  en: { ... },
  ptbr: { ... }
};

const OCCUPATION_LABELS = {
  en: { 'software-developers': 'Software Developers / Engineers' },
  ptbr: { 'software-developers': 'Desenvolvedores de Software / Engenheiros' }
};
```

Then render result headers from:

```js
getOccupationLabel(result.occupation.id, currentLanguage)
getSeniorityLabel(result.seniority.id, currentLanguage)
```

This keeps `buildResultMatrix()` and the existing Phase 2 verifier valid.

### Pattern 2: Translate Roast Components, Not 84 Hard-Coded Paragraphs

The existing roast system already guarantees distinct output because each profession has its own opener and each seniority level has its own closer. Reuse that structure in both languages:

- `ROAST_OPENERS.en`
- `ROAST_OPENERS.ptbr`
- `ROAST_MIDDLES.en`
- `ROAST_MIDDLES.ptbr`
- `ROAST_CLOSERS.en`
- `ROAST_CLOSERS.ptbr`

That yields 84 deterministic combinations per language without hand-maintaining 168 full paragraphs.

Important constraint: PT-BR copy should be translated for tone, not word-for-word. The app is comedic; literal translation will sound flat.

### Pattern 3: Single Render Pass per Language

Every visible string must switch instantly with no reload. The current app renders cards and experience buttons once. Phase 4 should introduce a single language application path that updates:

- document title
- `<html lang>`
- input view title/subtitle/labels/CTA
- profession card names and risk labels
- experience selector labels/ranges if localized
- results headings and button labels
- currently displayed result content if a result is already shown

Avoid scattered `textContent = ...` changes across click handlers. Use one `applyLanguage(language)` function plus targeted rerenders:

```js
function applyLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('jobDeathClockLanguage', language);
  renderStaticLabels();
  renderCards();
  renderExperienceSelector();
  if (lastResult) {
    renderResultContent(lastResult);
  }
  syncLanguageControls();
}
```

### Pattern 4: Hash Contract Uses Stable IDs Only

Use a compact fragment format that stores only the data needed to rebuild the result:

```text
#job=software-developers&exp=years-6-9&lang=ptbr
```

Why this shape:

- stable ids already exist in `OCCUPATIONS` and `SENIORITY_LEVELS`
- no translated strings in URLs
- locale travels with the shared link
- client can validate ids before showing results

Hydration rules:

1. Parse hash before first render.
2. If ids are valid, compute `buildResultModel(job, exp)`.
3. Apply locale from hash first, else `localStorage`, else default `en`.
4. Show results view immediately.
5. If hash is invalid, clear it and fall back to normal input boot.

### Pattern 5: Prevent Input-View Flash on Shared Links

Success criterion 5 says the input form must not appear first. The current DOM shows input view by default. If Phase 4 only parses the hash after initial paint, the app will flash the input view, then switch.

Use one of these approaches:

1. Add a booting class/attribute that hides both views until init completes.
2. Or set both views to `display: none` in markup and let init choose the first visible view.

Recommended:

```css
body[data-booting='true'] #input-view,
body[data-booting='true'] #results-view {
  display: none;
}
```

Then remove `data-booting` only after locale + hash restoration are complete.

### Pattern 6: Share URL Builders are Pure Functions

Do not inline service URL assembly inside click handlers. Build a pure share payload from `lastResult` and `currentLanguage`, then pass it to service-specific helpers.

Recommended contract:

```js
function getShareState() {
  return {
    job: lastResult.occupation.id,
    exp: lastResult.seniority.experienceId,
    lang: currentLanguage
  };
}

function buildShareUrl() {
  return getBasePageUrl() + '#' + serializeShareState(getShareState());
}

function buildShareMessage(result, language) {
  return '... localized message ...';
}
```

This makes Phase 4 verifiable without a browser by checking deterministic string output.

### Pattern 7: Social Preview Strategy Must Be Generic

Static hosting means crawlers fetch only the base page. MDN documents that URI fragments are processed client-side and are not sent to the server, so a shared `#job=...` state cannot produce result-specific HTML metadata for scrapers.

Implication:

- `og:title`, `og:description`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` should be static, launch-quality preview tags
- share text carries the user-specific result
- landing experience reconstructs the specific result from the hash

This is the only reliable architecture under GitHub Pages + no server.

### Pattern 8: LinkedIn is URL-Preview First

LinkedIn’s help content shows that link sharing is driven from the share box with a URL preview and optional user-entered text, and that preview extraction depends on OGP/oEmbed on the shared website. Inference: external websites should treat LinkedIn sharing as URL-first; unlike X, there is no reliable official external composer contract for prefilled post commentary.

Planning implication:

- build the LinkedIn button around sharing the encoded result URL
- rely on strong generic OG tags
- if a short localized result summary is included anywhere, treat it as fallback copy for manual editing/copy, not as a guaranteed auto-filled LinkedIn post body

---

## Don’t Hand-Roll

| Problem | Don’t Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Localization state | Per-element ad hoc booleans | One `currentLanguage` source of truth | Prevents partial translation bugs |
| Result link state | Human-readable translated text in hash | Stable ids only | Keeps hashes compact and valid across locales |
| Roast uniqueness | 84 manually duplicated paragraphs per locale | Translated component maps | Easier QA, still deterministic |
| Share handlers | Inline `window.open(...)` strings everywhere | Pure builder functions + tiny click wrappers | Testable and maintainable |
| Dynamic crawler preview | Runtime-updated OG tags only | Static OG tags + hash hydration | Crawlers won’t see runtime or fragment state |

---

## Common Pitfalls

### Pitfall 1: Breaking the Phase 2 Verifier While Adding i18n

**What goes wrong:** `buildResultModel()` is changed to depend on `currentLanguage`, DOM, or `localStorage`.

**Why it happens:** It seems convenient to put localized labels directly into the result object.

**How to avoid:** Keep the engine pure. Localize by id in `I18N`/`UI` only.

### Pitfall 2: Shared Link Opens the Wrong Language

**What goes wrong:** A PT-BR shared link opens in English because boot order prefers `localStorage`.

**How to avoid:** Hash locale overrides `localStorage`; `localStorage` only fills in when the hash has no locale.

### Pitfall 3: Input View Flashes Before Result Hydration

**What goes wrong:** The page first paints the input form, then switches to the result.

**How to avoid:** Gate first paint with a booting state and choose the visible view before removing it.

### Pitfall 4: LinkedIn Share Expectations Exceed Platform Reality

**What goes wrong:** The plan assumes a custom prefilled external LinkedIn message builder similar to X.

**How to avoid:** Treat LinkedIn as URL preview sharing. If product insists on editable text, add copy-to-clipboard support as an assistive fallback, not as the main requirement proof.

### Pitfall 5: Runtime OG Updates Don’t Affect Shared Previews

**What goes wrong:** Code updates `<meta property=\"og:title\">` after computing a result and expects X/LinkedIn preview cards to change.

**How to avoid:** Assume scrapers only see the original HTML response. Make OG tags static and good by default.

### Pitfall 6: Re-rendering Cards Loses Selection State

**What goes wrong:** Changing language rebuilds the profession grid and experience buttons but removes `.selected` styling and CTA enabled state.

**How to avoid:** After rerender, reapply selection classes from `selectedOccupation` and `selectedExperience`, then call `updateCTA()`.

### Pitfall 7: Share Text Encoding Breaks URLs

**What goes wrong:** Apostrophes, accents, or emoji in EN/PT-BR share copy break X/WhatsApp links.

**How to avoid:** Build raw strings first, then `encodeURIComponent()` each query parameter separately.

### Pitfall 8: Using Translated Labels in Hash State

**What goes wrong:** `#job=Desenvolvedores...` becomes fragile and impossible to validate.

**How to avoid:** Hash stores ids only. Translation happens after parsing.

---

## Code Examples

### Suggested Hash Helpers

```js
function serializeShareState(state) {
  var params = new URLSearchParams();
  params.set('job', state.job);
  params.set('exp', state.exp);
  params.set('lang', state.lang);
  return params.toString();
}

function parseShareState(hash) {
  var raw = hash.charAt(0) === '#' ? hash.slice(1) : hash;
  var params = new URLSearchParams(raw);
  return {
    job: params.get('job') || '',
    exp: params.get('exp') || '',
    lang: params.get('lang') || ''
  };
}
```

### Suggested Locale Resolution Order

```js
function resolveInitialLanguage(parsedHash) {
  if (parsedHash.lang === 'en' || parsedHash.lang === 'ptbr') {
    return parsedHash.lang;
  }

  var persisted = localStorage.getItem('jobDeathClockLanguage');
  if (persisted === 'en' || persisted === 'ptbr') {
    return persisted;
  }

  return 'en';
}
```

### Suggested Share Builders

```js
function buildXShareUrl(result, language) {
  var text = buildShareMessage(result, language);
  var url = buildShareUrl();
  return 'https://twitter.com/intent/tweet?text=' +
    encodeURIComponent(text) +
    '&url=' + encodeURIComponent(url);
}

function buildLinkedInShareUrl() {
  return 'https://www.linkedin.com/sharing/share-offsite/?url=' +
    encodeURIComponent(buildShareUrl());
}
```

---

## Open Questions

1. **PT-BR tone boundary**
   - What we know: the product needs mean-but-playful copy.
   - What’s unclear: how aggressive PT-BR copy should be relative to English.
   - Recommendation: lock tone by examples before execution starts; otherwise content QA will drag late in the phase.

2. **Generic preview image asset**
   - What we know: SHR-05 calls for rich previews and LinkedIn explicitly relies on OGP/oEmbed for preview extraction.
   - What’s unclear: whether adding one static preview image asset is acceptable under the project’s “single HTML file” ethos.
   - Recommendation: allow one committed static preview image for OG/Twitter tags. It does not affect runtime architecture and materially improves share quality.

3. **LinkedIn acceptance wording**
   - What we know: SHR-03 requires LinkedIn sharing; the roadmap success criterion phrases this as a pre-filled message.
   - Inference from LinkedIn help content: link-sharing + preview is reliable, external prefilled commentary is not.
   - Recommendation: treat URL-based LinkedIn sharing as the executable requirement and flag the “pre-filled message” wording as a platform-limited success-criteria risk during execution.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in (`assert/strict`, `fs`, `vm`, `path`) |
| Config file | None — self-contained verification script |
| Quick run command | `node scripts/verify-phase-4-i18n-share.js` |
| Full suite command | `node scripts/verify-phase-2-results.js && node scripts/verify-phase-4-i18n-share.js` |
| Estimated runtime | ~3 seconds |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| I18N-01 | Locale toggle and current-language state wired | code structure check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| I18N-02 | Required UI strings present in both locales | catalog completeness | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| I18N-03 | All occupation/seniority combinations yield non-empty roast strings in EN and PT-BR | matrix generation check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| I18N-04 | Locale persistence uses `localStorage` and hash override order | code structure check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| SHR-01 | X share URL contains encoded text + encoded result URL | deterministic string check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| SHR-02 | WhatsApp share URL contains encoded text + encoded result URL | deterministic string check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| SHR-03 | LinkedIn share URL contains encoded result URL | deterministic string check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| SHR-04 | Hash serialization/hydration round-trips stable ids | deterministic round-trip check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |
| SHR-05 | Static OG/Twitter tags exist in `<head>` | HTML grep/content check | `node scripts/verify-phase-4-i18n-share.js` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `node scripts/verify-phase-4-i18n-share.js`
- **Per wave merge:** `node scripts/verify-phase-2-results.js && node scripts/verify-phase-4-i18n-share.js`
- **Phase gate:** both Node scripts green + manual share-button click checks in a browser

### Wave 0 Gaps

- [ ] `scripts/verify-phase-4-i18n-share.js` does not exist yet and should be created early in the phase.
- [ ] Manual browser checks are still required for popup behavior, result hydration without input flash, and actual share-target navigation.
- [ ] Social scraper behavior cannot be fully automated locally; OG tags can be asserted in HTML, but rendered preview cards remain manual/external verification.

---

## Sources

- X Web Intent docs: https://developer.x.com/en/docs/x-for-websites/tweet-button/guides/web-intent
- X Tweet button overview: https://developer.x.com/en/docs/x-for-websites/tweet-button/overview
- LinkedIn help, sharing links: https://www.linkedin.com/help/linkedin/answer/a525301
- LinkedIn help, URL preview requirements: https://www.linkedin.com/help/linkedin/answer/a525063
- MDN URI fragments: https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment
