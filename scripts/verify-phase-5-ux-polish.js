'use strict';

// Phase 5 verification harness — Node built-ins only, no install step required
// Usage: node scripts/verify-phase-5-ux-polish.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');

try {
  const html = fs.readFileSync(htmlPath, 'utf8');

  const dataMatch = html.match(/\/\/ ===== DATA =====([\s\S]*?)\/\/ ===== ENGINE =====/);
  if (!dataMatch) {
    throw new Error('Could not find DATA section in index.html');
  }
  const dataBlock = dataMatch[1];

  const engineMatch = html.match(/\/\/ ===== ENGINE =====([\s\S]*?)\/\/ ===== I18N =====/);
  if (!engineMatch) {
    throw new Error('Could not find ENGINE section in index.html');
  }
  const engineBlock = engineMatch[1];

  const i18nMatch = html.match(/\/\/ ===== I18N =====([\s\S]*?)\/\/ ===== UI =====/);
  if (!i18nMatch) {
    throw new Error('Could not find I18N section in index.html');
  }
  const i18nBlock = i18nMatch[1];

  const scriptSource = dataBlock + engineBlock + i18nBlock + '\n' +
    'module.exports = { OCCUPATIONS, OCCUPATION_LABELS, ROAST_LIBRARY, buildLocalizedRoast, buildResultModel, SENIORITY_LEVELS };\n';

  const mod = { exports: {} };
  const sandbox = {
    module: mod,
    exports: mod.exports,
    Math: Math,
    console: console
  };

  vm.runInNewContext(scriptSource, sandbox, { filename: 'phase5-ux-polish.vm.js' });

  const exported = sandbox.module.exports;
  const OCCUPATIONS = exported.OCCUPATIONS;
  const OCCUPATION_LABELS = exported.OCCUPATION_LABELS;
  const ROAST_LIBRARY = exported.ROAST_LIBRARY;
  const buildLocalizedRoast = exported.buildLocalizedRoast;
  const buildResultModel = exported.buildResultModel;
  const SENIORITY_LEVELS = exported.SENIORITY_LEVELS;

  // ---- OCCUPATION COUNT ----
  assert.strictEqual(OCCUPATIONS.length, 31, 'Expected 31 occupations after Phase 5 expansion');

  // ---- LABEL COVERAGE ----
  OCCUPATIONS.forEach(function(occ) {
    assert.ok(OCCUPATION_LABELS.en[occ.id], 'Missing en label for ' + occ.id);
    assert.ok(OCCUPATION_LABELS.ptbr[occ.id], 'Missing ptbr label for ' + occ.id);
  });

  // ---- ROAST OPENER COVERAGE ----
  OCCUPATIONS.forEach(function(occ) {
    assert.ok(ROAST_LIBRARY.en.openers[occ.id], 'Missing en opener for ' + occ.id);
    assert.ok(ROAST_LIBRARY.ptbr.openers[occ.id], 'Missing ptbr opener for ' + occ.id);
  });

  // ---- RESULT MODEL VALIDITY (smoke test for new occupations) ----
  const newOccupationIds = [
    'nutritionists',
    'dentists',
    'chefs',
    'electricians',
    'transit-drivers',
    'airline-pilots',
    'air-traffic-controllers',
    'registered-nurses',
    'school-teachers',
    'police-officers'
  ];

  newOccupationIds.forEach(function(id) {
    const occupationExists = OCCUPATIONS.some(function(occ) { return occ.id === id; });
    if (occupationExists) {
      try {
        const result = buildResultModel(id, 'years-0-2');
        assert.ok(result !== null && result !== undefined, 'buildResultModel(' + id + ', years-0-2) returned null');
        assert.ok(result.countdown.years >= 0, 'countdown.years should be >= 0 for ' + id);
      } catch (e) {
        throw new Error('Result model smoke test failed for ' + id + ': ' + e.message);
      }
    }
  });

  // ---- HTML ELEMENT CHECKS (raw regex on html string, no vm needed) ----
  assert.ok(/<dialog\s[^>]*id="explainer-modal"/.test(html), 'Missing #explainer-modal dialog element');
  assert.ok(/id="article-link"/.test(html), 'Missing #article-link element');
  assert.ok(/href="post-labor-economia-ptbr\.html"/.test(html), 'article-link href incorrect');

  // ---- STRING KEY CHECKS ----
  const i18nMod = { exports: {} };
  const i18nSandbox = {
    module: i18nMod,
    exports: i18nMod.exports,
    Math: Math,
    console: console
  };
  vm.runInNewContext(dataBlock + i18nBlock + '\nmodule.exports = { STRINGS };\n', i18nSandbox, { filename: 'phase5-strings.vm.js' });
  const STRINGS = i18nSandbox.module.exports.STRINGS;
  assert.ok(STRINGS.en.explainerModalTitle, 'Missing STRINGS.en.explainerModalTitle');
  assert.ok(STRINGS.ptbr.explainerModalTitle, 'Missing STRINGS.ptbr.explainerModalTitle');

  console.log('Phase 5 verification passed. Occupations: ' + OCCUPATIONS.length);
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
