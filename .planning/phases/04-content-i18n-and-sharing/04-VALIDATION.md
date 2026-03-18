---
phase: 4
slug: content-i18n-and-sharing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in (`assert/strict`, `fs`, `path`, `vm`) |
| **Config file** | None — scripts are self-contained |
| **Quick run command** | `node scripts/verify-phase-4-i18n-share.js` |
| **Full suite command** | `node scripts/verify-phase-2-results.js && node scripts/verify-phase-4-i18n-share.js` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node scripts/verify-phase-4-i18n-share.js`
- **After every plan wave:** Run `node scripts/verify-phase-2-results.js && node scripts/verify-phase-4-i18n-share.js`
- **Before `$gsd-verify-work`:** Full suite must be green plus manual share-button checks
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | I18N-02 | catalog completeness | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | I18N-03 | roast matrix generation | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | I18N-01 | UI wiring / state check | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | I18N-04 | persistence / override order | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-03-01 | 03 | 3 | SHR-01 | X share URL builder | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-03-02 | 03 | 3 | SHR-02 | WhatsApp share URL builder | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-03-03 | 03 | 3 | SHR-03 | LinkedIn share URL builder | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-03-04 | 03 | 3 | SHR-04 | hash round-trip + hydrate path | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |
| 04-03-05 | 03 | 3 | SHR-05 | OG/Twitter tags present | `node scripts/verify-phase-4-i18n-share.js` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/verify-phase-4-i18n-share.js` — new Node-only verifier for locale catalogs, roast generation, share URL builders, hash round-tripping, and OG tag presence
- [ ] `scripts/verify-phase-2-results.js` remains green after all Phase 4 changes

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Language toggle updates all visible copy instantly | I18N-01 | Requires rendered browser state | Toggle EN/PT-BR on both input and results views; confirm all labels, headings, and button text switch with no reload |
| Shared result loads without showing input first | SHR-04 | Requires first-paint observation | Open a copied hash URL in a fresh tab; verify results view is the first visible state |
| X share opens composer with readable result copy | SHR-01 | External target behavior | Click X share button and confirm the composer opens with the expected localized summary + URL |
| WhatsApp share opens with localized prefilled text | SHR-02 | External target behavior | Click WhatsApp share button on desktop/mobile and confirm message body includes the result summary + URL |
| LinkedIn share opens with the result URL preview path | SHR-03 | External target behavior | Click LinkedIn share button and confirm LinkedIn share flow opens with the encoded URL |
| Social preview quality is acceptable | SHR-05 | Requires scraper/platform rendering | Paste the public URL into external preview tools or platform composers and confirm title/description/image look intentional |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
