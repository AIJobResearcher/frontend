#!/usr/bin/env node
/**
 * Scoped verification: type-check the project, then lint and test only the
 * files changed in the working tree. Output stays compact on purpose
 * (see AGENTS.md — token efficiency).
 *
 * Usage: npm run verify
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BIN_DIR = path.join(ROOT, 'node_modules', '.bin');
const EXT = process.platform === 'win32' ? '.cmd' : '';

const bin = (name) => {
  const local = path.join(BIN_DIR, `${name}${EXT}`);
  return existsSync(local) ? local : name;
};

const git = (args) => {
  const out = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  return out.status === 0 ? out.stdout.split('\n').filter(Boolean) : [];
};

const changed = [
  ...new Set([
    ...git(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD']),
    ...git(['ls-files', '--others', '--exclude-standard']),
  ]),
].filter((file) => /\.(ts|tsx)$/.test(file) && existsSync(path.join(ROOT, file)));

const step = (label, command, args) => {
  process.stdout.write(`\n[verify] ${label}\n`);
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit' });
  return result.status === 0;
};

const summary = [['types', step('tsc --noEmit', bin('tsc'), ['--noEmit'])]];

if (changed.length > 0) {
  summary.push(['lint (changed)', step('oxlint', bin('oxlint'), changed)]);
  summary.push([
    'tests (related)',
    step('jest --findRelatedTests', bin('jest'), [
      '--findRelatedTests',
      ...changed,
      '--passWithNoTests',
    ]),
  ]);
} else {
  process.stdout.write('\n[verify] no changed .ts/.tsx files — lint and tests skipped\n');
}

process.stdout.write('\n[verify] summary\n');
for (const [label, ok] of summary) {
  process.stdout.write(`  ${ok ? 'PASS' : 'FAIL'}  ${label}\n`);
}

process.exit(summary.every(([, ok]) => ok) ? 0 : 1);
