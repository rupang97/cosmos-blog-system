const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { watch } = require('node:fs');
const path = require('node:path');

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(__dirname, '..');
const debounceMs = 5000;
const ignoredDirectories = new Set(['.git', 'node_modules', 'logs']);
let pendingCommit;
let isCommitting = false;

function isIgnored(filename) {
  if (!filename) return false;
  return filename.split(path.sep).some((part) => ignoredDirectories.has(part));
}

async function runGit(args) {
  return execFileAsync('git', args, {
    cwd: projectRoot,
    windowsHide: true,
  });
}

async function commitChanges() {
  if (isCommitting) return;
  isCommitting = true;

  try {
    await runGit(['add', '-A']);
    try {
      await runGit(['diff', '--cached', '--quiet']);
      return;
    } catch (error) {
      // Exit code 1 means the index contains changes, which is expected here.
      if (error.code !== 1) throw error;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
    await runGit(['commit', '-m', `chore: autosave ${timestamp}`]);
    console.log(`[COSMOS Auto Git Save] Committed changes at ${timestamp}`);
  } catch (error) {
    console.error(`[COSMOS Auto Git Save] ${error.stderr || error.message}`.trim());
  } finally {
    isCommitting = false;
  }
}

function scheduleCommit() {
  clearTimeout(pendingCommit);
  pendingCommit = setTimeout(commitChanges, debounceMs);
}

async function main() {
  if (process.argv.includes('--once')) {
    await commitChanges();
    return;
  }

  console.log('[COSMOS Auto Git Save] Watching project changes. Press Ctrl+C to stop.');
  watch(projectRoot, { recursive: true }, (_eventType, filename) => {
    if (!isIgnored(filename)) scheduleCommit();
  });
  scheduleCommit();
}

main().catch((error) => {
  console.error(`[COSMOS Auto Git Save] ${error.message}`);
  process.exitCode = 1;
});
