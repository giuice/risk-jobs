---
phase: 02
slug: engine-and-results
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-03-17
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other |
| **Config file** | none — Node built-ins only |
| **Quick run command** | `node scripts/verify-phase-2-results.js` |
| **Full suite command** | `node scripts/verify-phase-2-results.js` |
| **Estimated runtime** | ~1 second |

---

## Sampling Rate

- **After every task commit:** Run the task-specific static check or `node scripts/verify-phase-2-results.js` once the script exists
- **After every plan wave:** Run `node scripts/verify-phase-2-results.js` after Wave 2 completes
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | CALC-01 | static | `node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); const engine=(html.match(/\\/\\/ ===== ENGINE =====([\\s\\S]*?)\\/\\/ ===== I18N =====/)||[])[1]||''; if(!engine) throw new Error('missing ENGINE block'); if(/document\\.|querySelector|getElementById|classList|window\\./.test(engine)) throw new Error('ENGINE block has DOM access'); ['getOccupationById','getSeniorityByExperienceId','calculateAdjustedScore','calculateShelfLifeYears','splitShelfLife','getRiskBand'].forEach((name)=>{ if(!html.includes('function '+name+'(')) throw new Error('missing '+name); }); ['experienceId: \\'years-0-2\\'','experienceId: \\'years-10-plus\\'','const RISK_BANDS =','const ROAST_OPENERS =','const ROAST_MIDDLES =','const ROAST_CLOSERS ='].forEach((snippet)=>{ if(!html.includes(snippet)) throw new Error('missing '+snippet); }); console.log('engine helpers present');"` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 1 | CALC-03 | static | `node -e "const fs=require('fs'); const vm=require('vm'); const html=fs.readFileSync('index.html','utf8'); const data=(html.match(/\\/\\/ ===== DATA =====([\\s\\S]*?)\\/\\/ ===== ENGINE =====/)||[])[1]||''; const engine=(html.match(/\\/\\/ ===== ENGINE =====([\\s\\S]*?)\\/\\/ ===== I18N =====/)||[])[1]||''; const script=data+'\\n'+engine+'\\nmodule.exports={buildResultModel,buildResultMatrix};'; const context={module:{exports:{}},exports:{},Math}; vm.createContext(context); vm.runInContext(script,context); const api=context.module.exports; const sample=api.buildResultModel('software-developers','years-6-9'); if(!sample||sample.adjustedScore!==6) throw new Error('sample mismatch'); if(api.buildResultMatrix().length!==84) throw new Error('matrix size mismatch'); console.log('result contract verified');"` | ✅ | ⬜ pending |
| 2-02-01 | 02 | 2 | RES-01 | static | `node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); ['id=\"results-panel\"','id=\"result-job-name\"','id=\"countdown-years\"','id=\"countdown-months\"','id=\"countdown-days\"','id=\"risk-label\"','id=\"risk-score\"','id=\"gauge-needle\"','id=\"roast-message\"','.results-panel.results-visible .results-reveal','transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1)','@media (max-width: 640px)'].forEach((snippet)=>{ if(!html.includes(snippet)) throw new Error('missing '+snippet); }); console.log('results layout contract present');"` | ✅ | ⬜ pending |
| 2-02-02 | 02 | 2 | RES-05 | static | `node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); ['let selectedExperience = null;','let lastResult = null;','function showResults(result)','lastResult = result;','function resetResultState()','buildResultModel(selectedOccupation, selectedExperience)','resetResultState();','showInput();','rotate(-90deg)'].forEach((snippet)=>{ if(!html.includes(snippet)) throw new Error('missing '+snippet); }); console.log('results wiring present');"` | ✅ | ⬜ pending |
| 2-03-01 | 03 | 2 | CALC-04 | cli | `node scripts/verify-phase-2-results.js` | ❌ until 03 | ⬜ pending |
| 2-03-02 | 03 | 2 | RES-02 | cli | `node scripts/verify-phase-2-results.js && grep -q '"matrixSize": 84' .planning/phases/02-engine-and-results/02-result-matrix.json` | ❌ until 03 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — static checks cover Plans 01 and 02, and Plan 03 creates the persistent verifier inside the normal wave sequence.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Results view toggles from input to rendered output after CTA click | RES-01 | Requires live browser interaction and visible state change | Open `index.html`, make both selections, click `SEE YOUR FATE`, confirm the input screen hides and rendered results appear |
| Gauge needle visibly transitions when results appear | RES-02 | Visual motion is hard to prove with the Node-only verifier | Trigger a result and confirm the needle moves from its baseline angle to the result angle |
| Try Again clears prior result state before the next reveal | RES-05 | Requires interaction across two view changes | Trigger one result, click `TRY AGAIN`, verify the input view returns and the next reveal shows freshly rendered values |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
