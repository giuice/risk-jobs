# Pitfalls Research

**Domain:** Dark Humor Viral Single-Page Calculator
**Researched:** 2026-03-17
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Humor Tone Collapse at Edge Cases

**What goes wrong:**
With 21 professions x 4 seniority levels = 84 combinations, roast messages written independently from formula outputs contradict the numbers at the edges. Formula can produce negative adjusted scores (e.g., "Other" at Architect level: 4 - 4.5 = -0.5).

**Why it happens:**
Copy written before the full output matrix is generated. Edge cases like very low base scores + high seniority produce absurd or contradictory results.

**How to avoid:**
Generate the full 21x4 output matrix first. Review all combinations. Clamp adjusted scores to 0-10 range. Write roast copy AFTER seeing every possible output.

**Warning signs:**
Roast says "you're doomed" but gauge shows low risk. Negative shelf-life values.

**Phase to address:** Phase 2 (Calculator engine) — validate matrix before writing content.

---

### Pitfall 2: Broken Open Graph Previews on GitHub Pages

**What goes wrong:**
Social sharing previews show blank/broken images. Three independent failure modes: relative og:image paths, wrong base path (`/` vs `/repo-name/`), missing `twitter:card` tags.

**Why it happens:**
GitHub Pages serves from `username.github.io/repo-name/` not root. Relative paths resolve incorrectly.

**How to avoid:**
Use absolute URLs for all og:image paths. Test with Twitter Card Validator and Facebook Sharing Debugger before launch. Add `.nojekyll` file.

**Warning signs:**
Share preview shows site title but no image. WhatsApp shows generic link.

**Phase to address:** Phase 1 (Scaffold) — deploy skeleton early, validate paths.

---

### Pitfall 3: CSS Animation Performance on Mid-Range Android

**What goes wrong:**
Glitch/neon animations cause dropped frames and jank on mid-range phones. Brazil is primary PT-BR market — these devices are common.

**Why it happens:**
Animating `box-shadow`, `text-shadow`, or layout properties triggers paint/layout instead of compositing. Only `transform` and `opacity` are GPU-composited.

**How to avoid:**
Use `will-change: transform` on animated elements. Prefer `transform`/`opacity` animations. Use `@media (prefers-reduced-motion)` to disable effects. Avoid animating box-shadow continuously — use pseudo-element opacity toggle instead.

**Warning signs:**
Animations stutter on Android Chrome. Battery drain during page view.

**Phase to address:** Phase 3 (Visual design) — establish performance constraints before effects.

---

### Pitfall 4: Share Button Shares Homepage Instead of Result

**What goes wrong:**
Every share link opens the homepage with empty input form instead of the user's specific result. Kills the viral mechanic entirely.

**Why it happens:**
No URL state encoding. Share URL is just the page URL without any parameters.

**How to avoid:**
Encode result state in URL hash (`#prof=5&exp=3`). On page load, check hash and auto-display results. Share buttons use the hash URL.

**Warning signs:**
Clicking shared link shows input form. "Share my result" shares a blank page.

**Phase to address:** Phase 5 (Sharing) — design URL hash encoding before share buttons.

---

### Pitfall 5: Single File Becomes Unmaintainable Spaghetti

**What goes wrong:**
1500+ lines of mixed HTML/CSS/JS with no internal structure. Editing one section breaks another.

**Why it happens:**
No upfront organization. CSS/JS added ad-hoc as features grow.

**How to avoid:**
Organize sections with clear comment headers. CSS: variables → base → components → animations. JS: DATA → ENGINE → I18N → UI → SHARE → BOOT. Keep calculation engine pure (no DOM access).

**Warning signs:**
Scrolling to find code. Duplicate selectors. Global variable conflicts.

**Phase to address:** Phase 1 (Scaffold) — establish structure from day one.

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Too many input steps | Completion rate drops ~15% per step | Two inputs max: profession dropdown + years slider |
| Results visible during animation | Spoils the reveal moment | Hide results, animate in with dramatic delay |
| Language toggle resets form | User loses input, frustration | Persist form state across language switch |
| Dropdown with 21+ items on mobile | Hard to scroll, tap targets too small | Grouped/searchable select or radio cards |

## "Looks Done But Isn't" Checklist

- [ ] **Social sharing:** Test actual share previews on Twitter, WhatsApp, LinkedIn — not just the meta tags
- [ ] **Mobile responsiveness:** Test on actual 375px width, not just resized desktop browser
- [ ] **PT-BR content:** All roast messages translated, not just UI chrome
- [ ] **Edge cases:** "Other" profession at 10+ years, Medical Transcriptionist at 0 years — verify outputs make sense
- [ ] **GitHub Pages:** `.nojekyll` file present, absolute og:image URL, correct base path

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-----------------|--------------|
| Humor tone collapse | Phase 2 (Calculator) | Full 21x4 matrix review |
| Broken OG previews | Phase 1 (Scaffold) | Deploy skeleton, test share preview |
| Animation performance | Phase 3 (Visual) | Test on mid-range Android |
| Share URL state | Phase 5 (Sharing) | Click shared link → see results |
| File structure | Phase 1 (Scaffold) | Clear section comments, ENGINE has no DOM |

## Sources

- GitHub Pages documentation — `.nojekyll`, base path behavior
- Web platform compositing model — transform/opacity GPU compositing
- Viral quiz post-mortem patterns (training data)

---
*Pitfalls research for: AI Job Death Clock*
*Researched: 2026-03-17*
