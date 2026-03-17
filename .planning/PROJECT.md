# AI Job Death Clock

## What This Is

A single-page dark humor web app that tells users how long until AI replaces them at their job. Users select their profession from a curated list (based on Karpathy's AI exposure research) and enter their years of experience, then receive a dramatic cyberpunk-styled results page with a countdown timer, risk gauge, and a playful-cruel roast message. Bilingual (English / Portuguese BR) with social sharing.

## Core Value

The results page must be visually dramatic and genuinely funny — if people don't screenshot and share it, nothing else matters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Selectable profession list from Karpathy's AI exposure data (20 occupations + "Other")
- [ ] Years of experience input on the same screen as profession
- [ ] Risk calculation using the seniority-adjusted formula
- [ ] Cyberpunk terminal visual design (dark bg, neon glows, glitch effects)
- [ ] Results page with countdown timer ("X years, Y months, Z days left")
- [ ] Results page with risk gauge meter (safe to doomed)
- [ ] Results page with playful-cruel roast message per profession/level
- [ ] Bilingual support (EN / PT-BR) with language toggle
- [ ] Social share buttons (Twitter/X, WhatsApp, LinkedIn)
- [ ] Hosted on GitHub Pages
- [ ] Single HTML file (self-contained, no build step)

### Out of Scope

- Backend / API — pure client-side, no server
- User accounts or data persistence — anonymous, stateless
- AI-generated dynamic roasts — pre-written messages, no API calls
- Mobile app — web only, responsive design sufficient
- SEO optimization — viral sharing is the distribution strategy

## Context

**Data Source:** Karpathy's AI exposure research table with 20 occupations scored 7-10 on AI exposure, plus median salary data.

**Formula:**
```
AdjustedScore = BaseExposureScore - (Slevel × 1.5)
```

Where Slevel is derived from years of experience:
| Years | Level | Slevel |
|-------|-------|--------|
| 0-2   | Junior | 0 |
| 3-5   | Mid/Pleno | 1 |
| 6-9   | Senior | 2 |
| 10+   | Architect | 3 |

**"Shelf life" conversion:** AdjustedScore maps to estimated years until replacement. Higher adjusted score = fewer years left. The exact conversion curve TBD during implementation (e.g., `shelfLife = (10 - adjustedScore) × 1.5` or similar).

**Occupation Data:**
| Occupation | Base Score |
|---|---|
| Medical Transcriptionists | 10 |
| Software Developers / Engineers | 9 |
| Data Scientists / Analysts | 9 |
| Financial Analysts | 9 |
| Graphic Designers | 9 |
| Financial Clerks | 9 |
| General Office Clerks | 9 |
| Accountants and Auditors | 8.5 |
| Lawyers | 8 |
| Paralegals & Legal Assistants | 8 |
| Computer Systems Analysts | 8 |
| Computer Support Specialists | 8 |
| Financial Managers | 7.5 |
| HR Specialists | 7.5 |
| Medical Records Specialists | 7.5 |
| Customer Service Representatives | 7.5 |
| Secretaries & Admin Assistants | 7.5 |
| Travel Agents | 7.5 |
| Bookkeeping / Payroll Clerks | 7.5 |
| Cashiers | 7 |
| Other (Low Risk) | 4 |

**Roast Messages:** Pre-written per profession category and seniority level. Playful-cruel tone — mean but winking. "Maybe learn to fix robots?" energy. More savage for high-risk combos, gentler for low-risk.

## Constraints

- **Tech stack**: Single HTML file with inline CSS/JS — no frameworks, no build step, no dependencies
- **Hosting**: GitHub Pages (free, static only)
- **No API calls**: Everything client-side, all data embedded in the HTML
- **Bilingual**: All user-facing text must exist in both EN and PT-BR

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single HTML file | Simplest deployment to GitHub Pages, no build tooling | — Pending |
| Cyberpunk terminal aesthetic | User chose it — neon glows, glitch effects, monospace fonts | — Pending |
| Simple threshold seniority mapping | Clear buckets (0-2/3-5/6-9/10+) more intuitive than continuous curve | — Pending |
| Pre-written roast messages | No API dependency, instant results, works offline | — Pending |
| Selectable profession list | Required for formula calculation — no free text input | — Pending |

---
*Last updated: 2026-03-17 after initialization*
