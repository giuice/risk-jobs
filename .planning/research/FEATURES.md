# Feature Research

**Domain:** Dark humor single-page calculator / viral quiz (AI job risk)
**Researched:** 2026-03-17
**Confidence:** MEDIUM (external fetch blocked; based on training knowledge of willrobotstakemyjob.com, Death Clock, personality quiz mechanics, BuzzFeed-style viral quiz patterns through Aug 2025)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Input form (profession + one variable) | Every quiz/calculator has a question phase; users expect to "answer" before results | LOW | Dropdown + single numeric input is the minimal viable input; learned from willrobotstakemyjob.com which uses occupation search |
| Instant results (no page load) | Users have zero patience; any perceptible delay kills completion rate | LOW | Pure client-side calculation; no spinner needed if calc is synchronous |
| Results number / score displayed prominently | The "answer" must be readable in under 2 seconds; large, centered typography is standard | LOW | Countdown format ("X years, Y months, Z days") is the "Death Clock" pattern — highly legible and dramatic |
| Mobile responsive layout | >60% of viral content is viewed on mobile, especially after social share | MEDIUM | Single-column stacked layout works; touch targets must be large; avoid hover-only interactions |
| Shareable result (copy/share mechanic) | The entire distribution model is social sharing; if users can't easily share they won't | MEDIUM | Twitter/X, WhatsApp, LinkedIn buttons; pre-filled text with result summary is essential |
| Dark / dramatic visual theme | Genre expectation — "death clock" / "AI doom" aesthetic sets tone; a pastel design would confuse users | MEDIUM | Cyberpunk terminal with neon glows is on-brand and expected for this subject matter |
| Clear call-to-action after results | Users need an obvious "try again" or "share" action; dead-end results pages lose engagement | LOW | Two buttons: "Share" and "Try Another" (or "Try for a friend") |
| Readable result text / roast message | The text payload is the actual content; if it's generic, users won't share | LOW (writing) / HIGH (quality) | Writing quality is the true complexity here; implementation is trivial |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Profession-specific roast messages | Generic results feel like a horoscope; profession-specific jabs feel personal and shareable ("they really got me") | LOW (code) / HIGH (writing) | 20+ occupations x 4 seniority levels = up to 80 message variants; minimum 20 distinct messages with seniority modifiers |
| Dramatic countdown timer display | Transforms abstract score into visceral emotional response; "2 years, 4 months, 17 days" lands harder than "score: 8.5" | LOW | CSS + JS tick animation; Death Clock's signature feature since ~2000; deeply genre-appropriate |
| Risk gauge / meter visual | Gives spatial intuition for "how doomed am I"; animated needle sweep on reveal is satisfying | MEDIUM | CSS/SVG gauge; animation on load creates the "slot machine reveal" dopamine hit |
| Glitch / CRT animation on results reveal | Cyberpunk aesthetic + reveal animation creates shareworthy moment; static results feel cheap | MEDIUM | CSS keyframe glitch effect on text; scanline overlay; subtle enough to not obscure content |
| Bilingual support (EN / PT-BR) | Doubles the addressable audience in a single deployment; Portuguese-language market is underserved for this content | MEDIUM | All strings in two locales; language toggle persists; URL-based locale detection optional |
| Seniority-adjusted scoring (experience input) | Adds a second dimension of personalization — "senior engineers fare slightly better" — which creates water-cooler debate and repeat usage | LOW | 4-bucket mapping; makes the result feel more individualized than single-input competitors |
| Shareable result card with visual design | Pre-rendered OG image or screenshot-friendly result card layout makes the share visually compelling on Twitter/X | HIGH | True OG image generation requires a server; screenshot-friendly CSS card is LOW complexity and sufficient for MVP |
| "Try for a friend" / try-again flow | Keeps users on the page; drives multi-visit sessions; creates social comparison ("let's do our whole team") | LOW | Reset button that clears results and returns to input; no state to clear beyond DOM |
| Specific salary / replacement cost data | Adding "AI tools replacing you cost $X/month" contextualizes the doom in economic terms | MEDIUM | Requires curated data per occupation; high-impact if data is surprising/provocative |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts / profiles | "Save my result", leaderboards, history | Kills the frictionless experience; GDPR/LGPD compliance overhead; hosting costs; users don't return to check saved results | Anonymous, stateless — results live in the share URL or the user's screenshot |
| Real-time AI-generated roast messages | "More personalized, always fresh" | API dependency breaks offline use; latency destroys the "instant reveal" feel; API costs scale with virality (worst time for the bill); rate limiting causes failures under viral load | Pre-written messages curated for quality; 80 variants is enough to feel personalized |
| Free-text job title input | "My job isn't on the list" | Requires NLP/fuzzy matching or server; ambiguous inputs give nonsense results; undermines the formula | Curated list of 20+ occupations + "Other (Low Risk)" escape hatch |
| Complex multi-step quiz (5+ questions) | "More accurate / more engaging" | Completion rate drops ~15% per additional step; complexity destroys the "instant gratification" that drives sharing; see BuzzFeed quiz research | Two inputs max (profession + years); results in one click |
| Leaderboard / "most doomed profession" ranking | Virality through competition | Requires persistence layer; stale data becomes embarrassing; ranking page competes with the share moment | The result itself is the shareable artifact; ranking is implicit in the formula |
| Email capture / newsletter signup | "Build an audience" | Creates friction at the exact moment users want to share; LGPD opt-in adds UI complexity; viral calculator users have zero intent to subscribe | Let the share mechanic build organic reach; add social follow buttons if needed |
| PWA / offline mode | "Works without internet" | Significant complexity; conflicts with "single HTML file" constraint; the use case (someone wants to check their job doom offline) is not real | GitHub Pages CDN provides fast enough loading globally |
| Dark mode toggle | "Accessibility / preference" | The entire site IS dark mode; a toggle adds UI clutter for zero benefit in this context | Hard-code the cyberpunk dark theme; it is the product identity |
| Comments section | "Community / discussion" | Requires moderation; third-party embeds (Disqus) add tracking and load time; dark humor comments sections attract toxicity | Twitter/X is the comments section; link to a hashtag |
| Exact date of replacement ("You'll be replaced on March 4, 2027") | "More dramatic, more specific" | False precision destroys credibility; if the date comes and goes, it becomes a joke (not the good kind); legal/reputational risk | Countdown in years/months/days is dramatic enough without claiming to know the specific date |

---

## Feature Dependencies

```
[Profession Input]
    └──requires──> [Risk Calculation Engine]
                       └──requires──> [Occupation Data (embedded)]
                       └──requires──> [Seniority Level Mapping]
                       └──produces──> [Adjusted Score + Shelf Life]

[Risk Calculation Engine]
    └──required by──> [Results Display]
                          └──required by──> [Countdown Timer Display]
                          └──required by──> [Risk Gauge Visual]
                          └──required by──> [Roast Message Display]
                          └──required by──> [Share Buttons]

[Roast Message Display]
    └──requires──> [Roast Message Corpus (occupation x seniority)]

[Share Buttons]
    └──enhances──> [Screenshot-friendly Result Card Layout]

[Bilingual Support (i18n strings)]
    └──enhances──> [All UI Text] (profession labels, roast messages, UI chrome)

[Glitch Animation]
    └──enhances──> [Results Display] (reveal moment)

[Try Again / Reset]
    └──requires──> [Input Form] (to return to)
```

### Dependency Notes

- **Risk Calculation requires Occupation Data:** The formula is meaningless without the embedded lookup table. Data must be in the HTML before the calculator can function.
- **Roast Message requires two dimensions:** Occupation identity AND seniority level are both required to select the right message. Either alone produces only partial personalization.
- **Share Buttons require Results:** Share text must include the actual result; cannot be pre-populated before calculation runs.
- **Bilingual enhances everything:** i18n must wrap all user-facing strings including roast messages — doubles the writing workload for the corpus.
- **Glitch Animation enhances but does not require Results:** It is a progressive enhancement; results must be readable without it (accessibility, reduced-motion preference).

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the core thesis ("does dark humor + AI doom = shares?").

- [ ] Profession dropdown (20 occupations + Other) — the primary input; without it the formula cannot run
- [ ] Years of experience input (numeric, maps to seniority bucket) — second personalization dimension; low complexity, high perceived value
- [ ] Risk score calculation (seniority-adjusted formula) — the engine; everything else is presentation
- [ ] Countdown display ("X years, Y months, Z days until replacement") — the signature emotional hook; the Death Clock pattern
- [ ] Risk gauge / meter (safe to doomed visual) — spatial drama; CSS/SVG, one-time implementation
- [ ] Profession-specific roast messages (minimum 20, ideally 80 variants) — the actual content that drives shares; writing quality is the real work
- [ ] Cyberpunk terminal visual design (dark bg, neon glows, monospace) — sets genre expectations; generic design = no shares
- [ ] Share buttons: Twitter/X + WhatsApp + LinkedIn — distribution mechanism; without it the reach stays local
- [ ] Bilingual EN / PT-BR — doubles audience in target markets; embedded strings = zero runtime cost
- [ ] Try Again / Reset flow — keeps users engaged; lets them check "for a friend"; trivial implementation

### Add After Validation (v1.x)

Features to add once sharing and engagement are confirmed.

- [ ] Glitch/CRT animation on results reveal — adds dramatic reveal moment; adds to shareability but not essential for first validation
- [ ] Screenshot-friendly result card (styled div, easy to screenshot) — improves visual quality of shared screenshots; add if screenshots are a primary share vector
- [ ] Salary / replacement cost data per occupation — economic contextualization increases provocativeness; add if early users ask "but how much does it cost them?"
- [ ] URL-based locale detection (auto-switch EN/PT-BR from browser) — quality of life; manual toggle is sufficient for v1

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Additional languages (ES, FR) — only if traffic data shows demand; translation + roast writing cost is non-trivial
- [ ] OG image generation (server-side screenshot for rich Twitter card) — requires a server or Cloudflare Worker; high complexity; defer until hosting strategy can accommodate it
- [ ] Additional occupations beyond Karpathy's list — scope creep risk; expand only if user requests cluster around specific missing professions
- [ ] "Most doomed in your company" team play mode — interesting social mechanic but requires state/persistence; fundamentally changes the architecture

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Profession dropdown | HIGH | LOW | P1 |
| Years of experience input | HIGH | LOW | P1 |
| Risk calculation engine | HIGH | LOW | P1 |
| Countdown timer display | HIGH | LOW | P1 |
| Roast messages (writing corpus) | HIGH | HIGH (writing labor) | P1 |
| Cyberpunk visual design | HIGH | MEDIUM | P1 |
| Share buttons (Twitter/X, WhatsApp, LinkedIn) | HIGH | LOW | P1 |
| Bilingual EN/PT-BR | HIGH | MEDIUM | P1 |
| Risk gauge / meter visual | MEDIUM | MEDIUM | P1 |
| Try Again / Reset | MEDIUM | LOW | P1 |
| Glitch animation on reveal | MEDIUM | MEDIUM | P2 |
| Screenshot-friendly result card | MEDIUM | LOW | P2 |
| Salary / cost data per occupation | MEDIUM | MEDIUM | P2 |
| URL locale detection | LOW | LOW | P2 |
| Additional languages | LOW | HIGH | P3 |
| OG image generation | MEDIUM | HIGH | P3 |
| Additional occupations | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | willrobotstakemyjob.com | Death Clock | BuzzFeed quizzes | Our Approach |
|---------|------------------------|-------------|-----------------|--------------|
| Input type | Occupation search/select | Birth date, gender, lifestyle | Multi-step radio buttons | Dropdown + numeric input (2 fields, instant) |
| Results format | Percentage + dollar figure | Specific death date + countdown | Personality label + description | Countdown timer + gauge + roast message |
| Humor/tone | Dry, factual ("72% chance") | Morbid, clinical | Playful, validating | Dark + savage, cyberpunk aesthetic |
| Shareability | Social buttons, basic text | Share button, date in text | Result label = natural share text | Pre-filled tweet with result + branded hashtag |
| Visual drama | Minimal (clean/corporate) | Moderate (clock imagery) | Low (mostly text) | Maximum (glitch effects, neon, gauge sweep) |
| Bilingual | No | No | Some markets | Yes (EN + PT-BR) |
| Mobile | Responsive | Responsive | Mobile-first | Responsive, touch-optimized |
| Personalization depth | Single dimension (occupation) | Multiple lifestyle factors | Multi-step quiz | Two dimensions (occupation + seniority) |
| Result card | No dedicated card | Clock image | Result graphic | Screenshot-friendly styled card |

**Key insight:** The gap in the market is visual drama + personalization depth + Portuguese-language market. willrobotstakemyjob.com is the closest competitor but is visually inert (no animation, no personality in the result text). Death Clock has the format right (countdown, drama) but lacks occupational specificity. Neither serves Portuguese speakers.

---

## Sources

- Training knowledge of willrobotstakemyjob.com (Murgia / BBC coverage, 2013-2024) — MEDIUM confidence
- Training knowledge of deathclock.com features and design patterns — MEDIUM confidence
- BuzzFeed quiz completion rate research (multi-step dropoff patterns) — MEDIUM confidence
- Dark Pattern / engagement pattern literature (scroll depth, share triggers) — MEDIUM confidence
- External web fetch disabled in this environment — could not verify live site features
- All claims based on training data through Aug 2025; recommend manual spot-check of willrobotstakemyjob.com and deathclock.com for current feature state

---

*Feature research for: Dark humor AI job risk calculator (single-page viral web app)*
*Researched: 2026-03-17*
