'use strict';

// Phase 4 verification harness — Node built-ins only, no install step required
// Usage: node scripts/verify-phase-4-i18n-share.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');
const outputPath = path.join(
  rootDir,
  '.planning',
  'phases',
  '04-content-i18n-and-sharing',
  '04-roast-matrix.json'
);
const previewImagePath = path.join(rootDir, 'og-preview.png');

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

const shareMatch = html.match(/\/\/ ===== SHARE =====([\s\S]*?)\/\/ ===== BOOT =====/);
if (!shareMatch) {
  throw new Error('Could not find SHARE section in index.html');
}
const shareBlock = shareMatch[1];

const scriptSource = dataBlock + engineBlock + i18nBlock + '\n' +
  'module.exports = {\n' +
  '  OCCUPATIONS,\n' +
  '  SENIORITY_LEVELS,\n' +
  '  buildResultModel,\n' +
  '  SUPPORTED_LANGUAGES,\n' +
  '  STRINGS,\n' +
  '  OCCUPATION_LABELS,\n' +
  '  SENIORITY_LABELS,\n' +
  '  SENIORITY_RANGE_LABELS,\n' +
  '  RISK_LABELS,\n' +
  '  ROAST_LIBRARY,\n' +
  '  buildLocalizedRoast\n' +
  '};\n';

const shareScriptSource = dataBlock + engineBlock + i18nBlock + '\n' +
  'var currentLanguage = DEFAULT_LANGUAGE;\n' +
  shareBlock + '\n' +
  'module.exports = {\n' +
  '  buildResultModel,\n' +
  '  serializeShareState,\n' +
  '  parseShareState,\n' +
  '  buildShareState,\n' +
  '  buildStateUrl,\n' +
  '  buildShareMessage,\n' +
  '  buildXShareUrl,\n' +
  '  buildWhatsAppShareUrl,\n' +
  '  buildLinkedInShareUrl\n' +
  '};\n';

const mod = { exports: {} };
const sandbox = {
  module: mod,
  exports: mod.exports,
  Math: Math,
  console: console
};

vm.runInNewContext(scriptSource, sandbox, { filename: 'phase4-i18n-share.vm.js' });

const shareMod = { exports: {} };
const shareSandbox = {
  module: shareMod,
  exports: shareMod.exports,
  Math: Math,
  console: console,
  URLSearchParams: URLSearchParams,
  encodeURIComponent: encodeURIComponent,
  window: {
    location: {
      origin: 'https://giuice.github.io',
      pathname: '/risk-jobs/'
    },
    open: function() {}
  },
  history: {
    replaceState: function() {}
  }
};

vm.runInNewContext(shareScriptSource, shareSandbox, { filename: 'phase4-share.vm.js' });

const exported = sandbox.module.exports;
const shareExported = shareSandbox.module.exports;
const OCCUPATIONS = exported.OCCUPATIONS;
const SENIORITY_LEVELS = exported.SENIORITY_LEVELS;
const buildResultModel = exported.buildResultModel;
const SUPPORTED_LANGUAGES = exported.SUPPORTED_LANGUAGES;
const STRINGS = exported.STRINGS;
const OCCUPATION_LABELS = exported.OCCUPATION_LABELS;
const SENIORITY_LABELS = exported.SENIORITY_LABELS;
const SENIORITY_RANGE_LABELS = exported.SENIORITY_RANGE_LABELS;
const RISK_LABELS = exported.RISK_LABELS;
const ROAST_LIBRARY = exported.ROAST_LIBRARY;
const buildLocalizedRoast = exported.buildLocalizedRoast;
const serializeShareState = shareExported.serializeShareState;
const parseShareState = shareExported.parseShareState;
const buildShareState = shareExported.buildShareState;
const buildStateUrl = shareExported.buildStateUrl;
const buildShareMessage = shareExported.buildShareMessage;
const buildXShareUrl = shareExported.buildXShareUrl;
const buildWhatsAppShareUrl = shareExported.buildWhatsAppShareUrl;
const buildLinkedInShareUrl = shareExported.buildLinkedInShareUrl;

const requiredStringKeys = [
  'documentTitle',
  'inputTitle',
  'inputSubtitle',
  'professionLabel',
  'experienceLabel',
  'ctaLabel',
  'resultsTitle',
  'shelfLifeHeading',
  'automationDangerHeading',
  'finalVerdictHeading',
  'countdownYears',
  'countdownMonths',
  'countdownDays',
  'safeLabel',
  'doomedLabel',
  'tryAgainLabel',
  'riskPrefix',
  'shareHeading',
  'shareXLabel',
  'shareWhatsAppLabel',
  'shareLinkedInLabel',
  'languageLabel',
  'languageEnglish',
  'languagePortuguese'
];

const requiredRiskKeys = ['low', 'watch', 'exposed', 'critical', 'doomed'];

assert.deepEqual(Array.from(SUPPORTED_LANGUAGES), ['en', 'ptbr']);

SUPPORTED_LANGUAGES.forEach(function(language) {
  requiredStringKeys.forEach(function(key) {
    assert.ok(
      typeof STRINGS[language][key] === 'string' && STRINGS[language][key].length > 0,
      'Missing UI string for ' + language + '.' + key
    );
  });
});

OCCUPATIONS.forEach(function(occupation) {
  SUPPORTED_LANGUAGES.forEach(function(language) {
    assert.ok(
      typeof OCCUPATION_LABELS[language][occupation.id] === 'string' &&
      OCCUPATION_LABELS[language][occupation.id].length > 0,
      'Missing occupation label for ' + language + '.' + occupation.id
    );
    assert.ok(
      typeof ROAST_LIBRARY[language].openers[occupation.id] === 'string' &&
      ROAST_LIBRARY[language].openers[occupation.id].length > 0,
      'Missing roast opener for ' + language + '.' + occupation.id
    );
  });
});

SENIORITY_LEVELS.forEach(function(seniority) {
  SUPPORTED_LANGUAGES.forEach(function(language) {
    assert.ok(
      typeof SENIORITY_LABELS[language][seniority.id] === 'string' &&
      SENIORITY_LABELS[language][seniority.id].length > 0,
      'Missing seniority label for ' + language + '.' + seniority.id
    );
    assert.ok(
      typeof SENIORITY_RANGE_LABELS[language][seniority.experienceId] === 'string' &&
      SENIORITY_RANGE_LABELS[language][seniority.experienceId].length > 0,
      'Missing experience label for ' + language + '.' + seniority.experienceId
    );
    assert.ok(
      typeof ROAST_LIBRARY[language].closers[seniority.id] === 'string' &&
      ROAST_LIBRARY[language].closers[seniority.id].length > 0,
      'Missing roast closer for ' + language + '.' + seniority.id
    );
  });
});

requiredRiskKeys.forEach(function(riskKey) {
  SUPPORTED_LANGUAGES.forEach(function(language) {
    assert.ok(
      typeof RISK_LABELS[language][riskKey] === 'string' &&
      RISK_LABELS[language][riskKey].length > 0,
      'Missing risk label for ' + language + '.' + riskKey
    );
    assert.ok(
      typeof ROAST_LIBRARY[language].middles[riskKey] === 'string' &&
      ROAST_LIBRARY[language].middles[riskKey].length > 0,
      'Missing roast middle for ' + language + '.' + riskKey
    );
  });
});

const requiredTags = [
  '<meta property="og:type" content="website">',
  '<meta property="og:title" content="AI Job Death Clock">',
  '<meta property="og:description" content="Find out when the machines come for your job. Bilingual cyberpunk countdown, roast, and shareable AI doom.">',
  '<meta property="og:url" content="https://giuice.github.io/risk-jobs/">',
  '<meta property="og:image" content="https://giuice.github.io/risk-jobs/og-preview.png">',
  '<meta name="twitter:card" content="summary">',
  '<meta name="twitter:title" content="AI Job Death Clock">',
  '<meta name="twitter:description" content="Find out when the machines come for your job. Bilingual cyberpunk countdown, roast, and shareable AI doom.">',
  '<meta name="twitter:image" content="https://giuice.github.io/risk-jobs/og-preview.png">'
];

requiredTags.forEach(function(tag) {
  assert.ok(html.includes(tag), 'Missing metadata tag: ' + tag);
});

assert.ok(
  html.includes('function resolveInitialLanguage(parsedHash)'),
  'Missing resolveInitialLanguage(parsedHash) in index.html'
);
assert.ok(
  html.includes('function applyLanguage(language)'),
  'Missing applyLanguage(language) in index.html'
);
assert.ok(
  html.includes("body[data-booting='true'] #input-view") &&
  html.includes("body[data-booting='true'] #results-view"),
  'Missing boot gating CSS for both views'
);
assert.ok(
  html.includes('function hydrateFromHash()'),
  'Missing hydrateFromHash() in index.html'
);
assert.ok(
  html.includes('function syncHashWithResult(result)'),
  'Missing syncHashWithResult(result) in index.html'
);
assert.ok(
  html.includes('function clearResultHash()'),
  'Missing clearResultHash() in index.html'
);
assert.ok(
  html.includes('localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage)'),
  'Missing localStorage.setItem persistence write'
);
assert.ok(
  html.includes('localStorage.getItem(LANGUAGE_STORAGE_KEY)'),
  'Missing localStorage.getItem persistence read'
);
assert.ok(
  html.includes("document.documentElement.lang = currentLanguage === 'ptbr' ? 'pt-BR' : 'en'"),
  'Missing document.documentElement.lang update'
);
assert.ok(
  html.includes("params.set('job'") &&
  html.includes("params.set('exp'") &&
  html.includes("params.set('lang'"),
  'Serializer should include job, exp, and lang hash keys'
);
assert.ok(
  html.includes("params.get('job'") &&
  html.includes("params.get('exp'") &&
  html.includes("params.get('lang'"),
  'Parser should read job, exp, and lang hash keys'
);
assert.ok(
  html.includes("history.replaceState(null, '', buildBasePageUrl())"),
  'Missing clearResultHash() history.replaceState call'
);
assert.ok(
  html.includes("history.replaceState(null, '', buildStateUrl(buildShareState(result)))"),
  'Missing syncHashWithResult() history.replaceState call'
);

const applyLanguageBlockMatch = html.match(
  /function applyLanguage\(language\) {([\s\S]*?)function renderCards\(\)/
);
assert.ok(applyLanguageBlockMatch, 'Could not isolate applyLanguage block');
assert.ok(
  applyLanguageBlockMatch[1].includes('renderCards();'),
  'applyLanguage should rerender occupation cards'
);
assert.ok(
  applyLanguageBlockMatch[1].includes('renderExperienceSelector();'),
  'applyLanguage should rerender experience selector'
);

const initBlockMatch = html.match(/function init\(\) {([\s\S]*?)document.addEventListener\('DOMContentLoaded', init\);/);
assert.ok(initBlockMatch, 'Could not isolate init() block');
assert.ok(
  initBlockMatch[1].includes('var parsedHash = parseShareState(window.location.hash);') &&
  initBlockMatch[1].includes('currentLanguage = resolveInitialLanguage(parsedHash);'),
  'init() should resolve the initial language before first render'
);
assert.ok(
  initBlockMatch[1].includes('renderCards();'),
  'init() should render occupation cards during boot'
);
assert.ok(
  initBlockMatch[1].includes('renderExperienceSelector();'),
  'init() should render experience selector during boot'
);

const resultRenderBlockMatch = html.match(
  /function renderResultContent\(result\) {([\s\S]*?)function syncLanguageControls\(\)/
);
assert.ok(resultRenderBlockMatch, 'Could not isolate renderResultContent(result) block');
assert.ok(
  resultRenderBlockMatch[1].includes('buildLocalizedRoast(result, currentLanguage)'),
  'renderResultContent(result) should use buildLocalizedRoast(result, currentLanguage)'
);

const linkedInBlockMatch = html.match(
  /function buildLinkedInShareUrl\(result\) {([\s\S]*?)function openShareWindow\(url\)/
);
assert.ok(linkedInBlockMatch, 'Could not isolate buildLinkedInShareUrl(result) block');
assert.ok(
  !linkedInBlockMatch[1].includes('text='),
  'buildLinkedInShareUrl(result) should not append a text= parameter'
);

assert.ok(fs.existsSync(previewImagePath), 'Missing og-preview.png in repo root');

const sampleResult = shareExported.buildResultModel('software-developers', 'years-6-9');
assert.ok(sampleResult, 'Expected sample result for share verification');

const serializedState = serializeShareState({
  job: sampleResult.occupation.id,
  exp: sampleResult.seniority.experienceId,
  lang: 'en'
});
assert.equal(
  serializedState,
  'job=software-developers&exp=years-6-9&lang=en',
  'serializeShareState should preserve the stable hash contract'
);
assert.equal(
  JSON.stringify(parseShareState('#' + serializedState)),
  JSON.stringify({ job: 'software-developers', exp: 'years-6-9', lang: 'en' }),
  'parseShareState should round-trip the stable hash contract'
);

const state = buildShareState(sampleResult);
const resultUrl = buildStateUrl(state);
const encodedResultUrl = encodeURIComponent(resultUrl);
assert.ok(
  buildShareMessage(sampleResult, 'en').includes(resultUrl),
  'buildShareMessage should include the localized result URL'
);

const xShareUrl = buildXShareUrl(sampleResult, 'en');
assert.ok(
  xShareUrl.includes('https://twitter.com/intent/tweet?'),
  'X share URL should target the web intent endpoint'
);
assert.ok(
  xShareUrl.includes('url=' + encodedResultUrl),
  'X share URL should include the encoded result URL'
);

const whatsAppShareUrl = buildWhatsAppShareUrl(sampleResult, 'en');
assert.ok(
  whatsAppShareUrl.includes('https://api.whatsapp.com/send?'),
  'WhatsApp share URL should target the click-to-chat endpoint'
);
assert.ok(
  whatsAppShareUrl.includes(encodedResultUrl),
  'WhatsApp share URL should include the encoded result URL in the text payload'
);

const linkedInShareUrl = buildLinkedInShareUrl(sampleResult);
assert.equal(
  linkedInShareUrl,
  'https://www.linkedin.com/sharing/share-offsite/?url=' + encodedResultUrl,
  'LinkedIn share URL should contain only the encoded result URL'
);
assert.ok(
  !linkedInShareUrl.includes('text='),
  'LinkedIn share URL should not include a text= parameter'
);

const rows = [];

OCCUPATIONS.forEach(function(occupation) {
  SENIORITY_LEVELS.forEach(function(seniority) {
    const result = buildResultModel(occupation.id, seniority.experienceId);
    assert.ok(result, 'Expected result for ' + occupation.id + ' + ' + seniority.experienceId);

    const englishRoast = buildLocalizedRoast(result, 'en');
    const portugueseRoast = buildLocalizedRoast(result, 'ptbr');

    assert.ok(typeof englishRoast === 'string' && englishRoast.length > 0,
      'Missing English roast for ' + occupation.id + ' + ' + seniority.id);
    assert.ok(typeof portugueseRoast === 'string' && portugueseRoast.length > 0,
      'Missing PT-BR roast for ' + occupation.id + ' + ' + seniority.id);

    rows.push({
      occupationId: occupation.id,
      seniorityId: seniority.id,
      riskKey: result.risk.key,
      englishRoast: englishRoast,
      portugueseRoast: portugueseRoast
    });
  });
});

assert.equal(rows.length, 124, 'Expected 124 bilingual roast rows');

const output = {
  languages: ['en', 'ptbr'],
  occupationCount: OCCUPATIONS.length,
  seniorityCount: SENIORITY_LEVELS.length,
  matrixSize: rows.length,
  rows: rows
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log(
  'Phase 4 i18n/share verified: ' +
  rows.length + ' bilingual roast combinations, metadata present, hash hydration/share builders wired'
);
