---
phase: 3
slug: visual-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in (`assert/strict`, `vm`) — no install required |
| **Config file** | None — scripts are self-contained |
| **Quick run command** | `node scripts/verify-phase-2-results.js` |
| **Full suite command** | `node scripts/verify-phase-2-results.js` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node scripts/verify-phase-2-results.js`
- **After every plan wave:** Run `node scripts/verify-phase-2-results.js` + manual 375px browser check
- **Before `/gsd:verify-work`:** Full suite must be green + manual 375px visual check
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | VIS-02 | grep | `grep -c 'neon-glow' index.html` (expect > 0) | ✅ inline | ⬜ pending |
| 03-01-02 | 01 | 1 | VIS-03 | grep | `grep -c 'scanlines\|repeating-linear-gradient' index.html` (expect > 0) | ✅ inline | ⬜ pending |
| 03-01-03 | 01 | 1 | VIS-04 | grep | `grep -c 'glitch-active' index.html` (expect > 1) | ✅ inline | ⬜ pending |
| 03-02-01 | 02 | 1 | VIS-05 | manual | DevTools device emulation at 375px | Manual only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* The existing `verify-phase-2-results.js` validates engine correctness and should be run after each CSS change to confirm no accidental breakage. Visual CSS properties are verified via grep checks (inline, no new test files needed).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No horizontal scroll at 375px | VIS-05 | Requires browser rendering to detect overflow | Open DevTools → device emulation → 375px width → verify no horizontal scrollbar, no overlapping elements |
| Neon glow visually appears | VIS-02 | text-shadow visual appearance cannot be verified by grep | Open in browser → check results headings have visible neon glow effect |
| Scanline overlay visible | VIS-03 | Visual overlay requires rendering | Open in browser → verify CRT scanline effect across page |
| Glitch animation plays once | VIS-04 | Animation timing requires rendering | Calculate a result → verify glitch reveal plays once, no layout jank |
| prefers-reduced-motion respected | VIS-04 | Requires OS/browser accessibility setting | Enable "reduce motion" in OS → verify no keyframe animations play |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
