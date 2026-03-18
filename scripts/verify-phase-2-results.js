'use strict';

// Phase 2 verification harness — Node built-ins only, no install step required
// Usage: node scripts/verify-phase-2-results.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');
const outputPath = path.join(rootDir, '.planning', 'phases', '02-engine-and-results', '02-result-matrix.json');

// ---- Extract DATA and ENGINE blocks from index.html ----

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

// ---- Build sandbox script ----

const scriptSource = dataBlock + engineBlock + '\n' +
  'module.exports = {\n' +
  '  OCCUPATIONS,\n' +
  '  SENIORITY_LEVELS,\n' +
  '  buildResultModel,\n' +
  '  buildResultMatrix\n' +
  '};\n';

const mod = { exports: {} };
const sandbox = {
  module: mod,
  exports: mod.exports,
  Math: Math,
  console: console
};

vm.runInNewContext(scriptSource, sandbox);

const OCCUPATIONS = sandbox.module.exports.OCCUPATIONS;
const SENIORITY_LEVELS = sandbox.module.exports.SENIORITY_LEVELS;
const buildResultModel = sandbox.module.exports.buildResultModel;
const buildResultMatrix = sandbox.module.exports.buildResultMatrix;

// ---- Assertions ----

assert.equal(OCCUPATIONS.length, 31, 'OCCUPATIONS.length === 31');
assert.equal(SENIORITY_LEVELS.length, 4, 'SENIORITY_LEVELS.length === 4');

const matrix = buildResultMatrix();
assert.equal(matrix.length, 124, 'buildResultMatrix().length === 124');

// Every row is non-null
matrix.forEach(function(row, i) {
  assert.ok(row !== null && row !== undefined, 'row ' + i + ' is non-null');

  // adjustedScore in [0, 10]
  assert.ok(row.adjustedScore >= 0 && row.adjustedScore <= 10,
    'row ' + i + ': adjustedScore out of range: ' + row.adjustedScore);

  // shelfLifeYears in [0, 12]
  assert.ok(row.shelfLifeYears >= 0 && row.shelfLifeYears <= 12,
    'row ' + i + ': shelfLifeYears out of range: ' + row.shelfLifeYears);

  // countdown fields are integers
  assert.ok(Number.isInteger(row.countdown.years),
    'row ' + i + ': countdown.years is not integer: ' + row.countdown.years);
  assert.ok(Number.isInteger(row.countdown.months),
    'row ' + i + ': countdown.months is not integer: ' + row.countdown.months);
  assert.ok(Number.isInteger(row.countdown.days),
    'row ' + i + ': countdown.days is not integer: ' + row.countdown.days);

  // risk label is a non-empty string
  assert.ok(typeof row.risk.label === 'string' && row.risk.label.length > 0,
    'row ' + i + ': risk.label is empty or not a string');

  // needlePercent and needleAngle are numbers
  assert.ok(typeof row.risk.needlePercent === 'number',
    'row ' + i + ': risk.needlePercent is not a number');
  assert.ok(typeof row.risk.needleAngle === 'number',
    'row ' + i + ': risk.needleAngle is not a number');

  // roast is a non-empty string
  assert.ok(typeof row.roast === 'string' && row.roast.length > 0,
    'row ' + i + ': roast is empty or not a string');
});

// Every occupation/seniority pair appears exactly once
const pairSet = new Set();
matrix.forEach(function(row) {
  pairSet.add(row.occupation.id + '::' + row.seniority.id);
});
assert.equal(pairSet.size, 124, 'unique occupation::seniority pairs === 124');

// ---- Count numeric collisions (expected; not a failure) ----

const collisionMap = {};
matrix.forEach(function(row) {
  const key = row.adjustedScore + '|' + row.shelfLifeYears;
  collisionMap[key] = (collisionMap[key] || 0) + 1;
});

let numericCollisionCount = 0;
Object.keys(collisionMap).forEach(function(key) {
  if (collisionMap[key] > 1) {
    numericCollisionCount += collisionMap[key] - 1;
  }
});

// ---- Build the deterministic JSON artifact ----

const rows = matrix.map(function(row) {
  return {
    occupationId: row.occupation.id,
    occupationName: row.occupation.name,
    seniorityId: row.seniority.id,
    seniorityLabel: row.seniority.label,
    adjustedScore: row.adjustedScore,
    shelfLifeYears: row.shelfLifeYears,
    countdown: {
      years: row.countdown.years,
      months: row.countdown.months,
      days: row.countdown.days,
      totalDays: row.countdown.totalDays
    },
    risk: {
      key: row.risk.key,
      label: row.risk.label,
      needlePercent: row.risk.needlePercent,
      needleAngle: row.risk.needleAngle,
      colorVar: row.risk.colorVar
    },
    roast: row.roast
  };
});

const output = {
  occupationCount: 31,
  seniorityCount: 4,
  matrixSize: 124,
  numericCollisionCount: numericCollisionCount,
  rows: rows
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log(
  'Phase 2 matrix verified: ' + matrix.length + ' rows, ' +
  numericCollisionCount + ' numeric collision(s) (expected under locked score table)'
);
