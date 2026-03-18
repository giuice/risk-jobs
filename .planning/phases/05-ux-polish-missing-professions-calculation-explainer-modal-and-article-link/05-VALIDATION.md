---
phase: 5
slug: ux-polish-missing-professions-calculation-explainer-modal-and-article-link
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js vm-based verifier (same as Phase 2/4) |
| **Config file** | none — Wave 0 creates verifier |
| **Quick run command** | `node scripts/verify-phase-5-ux-polish.js` |
| **Full suite command** | `node scripts/verify-phase-2-results.js && node scripts/verify-phase-4-i18n-share.js && node scripts/verify-phase-5-ux-polish.js` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node scripts/verify-phase-5-ux-polish.js`
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | PROF-NEW | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | PROF-NEW | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | CARD-UX | smoke | Manual browser check | manual-only | ⬜ pending |
| 05-02-02 | 02 | 1 | MODAL | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ W0 | ⬜ pending |
| 05-02-03 | 02 | 1 | ARTICLE | unit | `node scripts/verify-phase-5-ux-polish.js` | ❌ W0 | ⬜ pending |
| 05-REG-01 | all | all | I18N-COMPAT | regression | `node scripts/verify-phase-4-i18n-share.js` | ✅ exists | ⬜ pending |
| 05-REG-02 | all | all | ENGINE-COMPAT | regression | `node scripts/verify-phase-2-results.js` | ✅ exists | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/verify-phase-5-ux-polish.js` — covers PROF-NEW (labels, roast openers, result models), MODAL (element presence, string keys), ARTICLE (href presence)

*Existing Phase 2 and Phase 4 verifiers cover regression; only new verifier file is missing.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `.card-risk` absent from rendered DOM | CARD-UX | Requires browser DOM rendering | Open index.html, select a profession, verify no risk badge on card |
| Modal opens/closes with keyboard | MODAL | Focus trap requires real browser | Click explainer button, press Escape, verify focus returns |
| Article link navigates correctly | ARTICLE | Requires browser navigation | Click article link, verify post-labor-economia-ptbr.html loads |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 3s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
