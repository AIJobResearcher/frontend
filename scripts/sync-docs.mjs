#!/usr/bin/env node
/**
 * Mirrors shared assets of the adjacent `docs` repository into this project:
 * the platform documentation (`./docs`) and the agent standards (`./.ai-agent`),
 * both untracked or vendored copies of the source of truth (see AGENTS.md).
 *
 * Network or git failures are not fatal: the local folders are kept and the
 * build continues, so offline and sandboxed builds still work. Paths listed in
 * `keep` are local scratch space and are never pruned.
 *
 * Usage: npm run docs:sync   (runs automatically through the `prebuild` hook)
 */
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO_URL = 'https://github.com/AIJobResearcher/docs.git';
const REF = 'main';

/** `source` is a path in the docs repository, `dest` is local, `keep` is never pruned. */
const TARGETS = [
  { source: 'docs', dest: path.join(ROOT, 'docs'), keep: [] },
  { source: '.ai-agent', dest: path.join(ROOT, '.ai-agent'), keep: ['user.data', 'agent.data'] },
];

const warn = (message) => process.stderr.write(`[docs:sync] ${message}\n`);

/** Never let git block on a credential prompt (assumes the repository is public). */
const git = (args) =>
  spawnSync('git', args, {
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });

const fail = (label, result) =>
  warn(`${label}: ${(result.stderr || result.error?.message || '').trim().split('\n').pop()}`);

const listFiles = (dir, base = dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full, base) : [path.relative(base, full)];
  });

const isKept = (relative, keep) => keep.includes(relative.split(path.sep)[0]);

/** Drops directories left empty after pruning stale files, never touching `keep` entries. */
const removeEmptyDirs = (dir, dest, keep) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !isKept(path.relative(dest, full), keep)) {
      removeEmptyDirs(full, dest, keep);
    }
  }
  if (dir !== dest && !isKept(path.relative(dest, dir), keep) && readdirSync(dir).length === 0) {
    rmSync(dir, { recursive: true });
  }
};

/** Copies one repository folder over the local one, pruning files gone upstream. */
const sync = (source, dest, keep) => {
  const files = existsSync(source) ? listFiles(source) : [];
  const name = path.basename(source);
  if (files.length === 0) {
    return warn(`no ${name}/ in ${REPO_URL}#${REF} — keeping the local copy as is`);
  }

  cpSync(source, dest, { recursive: true });

  const stale = listFiles(dest).filter(
    (file) => !isKept(file, keep) && !existsSync(path.join(source, file)),
  );
  for (const file of stale) rmSync(path.join(dest, file));
  if (stale.length > 0) removeEmptyDirs(dest, dest, keep);

  process.stdout.write(
    `[docs:sync] ${name}: ${files.length} files -> ${path.relative(ROOT, dest)}/ (${stale.length} stale removed)\n`,
  );
};

const main = () => {
  const checkout = mkdtempSync(path.join(os.tmpdir(), 'aijr-docs-'));

  try {
    const clone = git([
      'clone',
      '--depth=1',
      '--filter=blob:none',
      '--sparse',
      '--branch',
      REF,
      REPO_URL,
      checkout,
    ]);
    if (clone.status !== 0) {
      fail('git clone', clone);
      return warn(`cannot fetch ${REPO_URL}#${REF} — keeping the local copies as is`);
    }

    const sparse = git([
      '-C',
      checkout,
      'sparse-checkout',
      'set',
      ...TARGETS.map((target) => target.source),
    ]);
    if (sparse.status !== 0) {
      fail('git sparse-checkout', sparse);
      return warn('cannot check out the source folders — keeping the local copies as is');
    }

    for (const { source, dest, keep } of TARGETS) {
      sync(path.join(checkout, source), dest, keep);
    }
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
};

main();
