# Requirements: AI Job Death Clock

**Defined:** 2026-03-17
**Core Value:** The results page must be visually dramatic and genuinely funny — if people don't screenshot and share it, nothing else matters.

## v1 Requirements

### Input

- [x] **INP-01**: User can select profession from dropdown of 20 occupations + "Other (Low Risk)"
- [x] **INP-02**: User can enter years of experience (numeric input)
- [x] **INP-03**: Input form and experience input are on the same screen
- [x] **INP-04**: Profession list shows all occupations from Karpathy's AI exposure data

### Calculation

- [x] **CALC-01**: System maps years of experience to seniority level (0-2=Junior, 3-5=Mid, 6-9=Senior, 10+=Architect)
- [x] **CALC-02**: System calculates adjusted exposure score: BaseScore - (Slevel x 1.5)
- [x] **CALC-03**: System converts adjusted score to "shelf life" (estimated years until replacement)
- [x] **CALC-04**: Adjusted score is clamped to 0-10 range (no negative values)

### Results Display

- [x] **RES-01**: User sees countdown timer showing years, months, and days until AI replacement
- [x] **RES-02**: User sees animated risk gauge meter (safe to doomed scale)
- [x] **RES-03**: User sees playful-cruel roast message specific to their profession and seniority level
- [x] **RES-04**: Results appear with dramatic glitch/CRT reveal animation
- [x] **RES-05**: User can click "Try Again" to reset and try another profession

### Visual Design

- [x] **VIS-01**: Page has cyberpunk terminal aesthetic (dark bg, neon glows, monospace font)
- [x] **VIS-02**: Text has neon glow effects using multi-layer text-shadow
- [x] **VIS-03**: Page has scanline overlay for CRT monitor effect
- [x] **VIS-04**: Glitch text animation on key headings
- [x] **VIS-05**: Page is fully responsive on mobile devices (375px+)

### Bilingual

- [x] **I18N-01**: User can toggle between English and Portuguese (PT-BR)
- [x] **I18N-02**: All UI text exists in both languages
- [x] **I18N-03**: All roast messages exist in both languages
- [x] **I18N-04**: Language preference persists across page reload (localStorage)

### Sharing

- [ ] **SHR-01**: User can share result on Twitter/X with pre-filled text
- [ ] **SHR-02**: User can share result on WhatsApp with pre-filled text
- [ ] **SHR-03**: User can share result on LinkedIn
- [ ] **SHR-04**: Shared URL contains result state in hash (opens results, not empty form)
- [x] **SHR-05**: Page has Open Graph meta tags for rich link previews

### Deployment

- [x] **DEP-01**: Site is a single self-contained HTML file (inline CSS/JS)
- [x] **DEP-02**: Site is hosted on GitHub Pages
- [x] **DEP-03**: Site works without any server-side code or API calls

## v2 Requirements

### Additional Content

- **V2-01**: Salary/replacement cost data per occupation ("AI replacing you costs $X/month")
- **V2-02**: Additional languages (ES, FR)
- **V2-03**: Additional occupations beyond Karpathy's list

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / profiles | Kills frictionless experience; GDPR/LGPD overhead |
| AI-generated roast messages | API dependency breaks offline use; latency kills instant reveal; costs scale with virality |
| Free-text job input | Requires NLP/fuzzy matching; undermines formula; curated list + "Other" is sufficient |
| Multi-step quiz (5+ questions) | Completion rate drops ~15% per step; destroys instant gratification |
| Leaderboard / ranking | Requires persistence layer; stale data |
| Email capture / newsletter | Friction at share moment; LGPD compliance |
| Comments section | Moderation burden; Twitter/X is the comments section |
| Exact replacement date | False precision destroys credibility; legal/reputational risk |
| PWA / offline mode | Conflicts with single-file constraint; not a real use case |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INP-01 | Phase 1 | Complete (01-01) |
| INP-02 | Phase 1 | Complete (01-01) |
| INP-03 | Phase 1 | Complete (01-01) |
| INP-04 | Phase 1 | Complete (01-01) |
| DEP-01 | Phase 1 | Complete (01-01) |
| DEP-02 | Phase 1 | Pending (01-02) |
| DEP-03 | Phase 1 | Complete (01-01) |
| VIS-01 | Phase 1 | Complete (01-01) |
| CALC-01 | Phase 2 | Complete (02-01) |
| CALC-02 | Phase 2 | Complete (02-01) |
| CALC-03 | Phase 2 | Complete (02-01) |
| CALC-04 | Phase 2 | Complete (02-01) |
| RES-01 | Phase 2 | Complete |
| RES-02 | Phase 2 | Complete |
| RES-03 | Phase 2 | Complete (02-01) |
| RES-04 | Phase 2 | Complete |
| RES-05 | Phase 2 | Complete |
| VIS-02 | Phase 3 | Complete |
| VIS-03 | Phase 3 | Complete |
| VIS-04 | Phase 3 | Complete |
| VIS-05 | Phase 3 | Complete |
| I18N-01 | Phase 4 | Complete |
| I18N-02 | Phase 4 | Complete |
| I18N-03 | Phase 4 | Complete |
| I18N-04 | Phase 4 | Complete |
| SHR-01 | Phase 4 | Pending |
| SHR-02 | Phase 4 | Pending |
| SHR-03 | Phase 4 | Pending |
| SHR-04 | Phase 4 | Pending |
| SHR-05 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 — CALC-01 through CALC-04 and RES-03 completed in 02-01*
