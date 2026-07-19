const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline/promises');
const { spawn } = require('node:child_process');
const { stdin: input, stdout: output } = require('node:process');
const { buildPublishingPrompts } = require('../lib/promptBuilder');

const projectRoot = path.resolve(__dirname, '..');
const sessionRoot = path.join(projectRoot, 'logs', 'sessions');

const steps = [
  ['article.prompt.md', 'ARTICLE'],
  ['thumbnail.prompt.md', 'THUMBNAIL'],
  ['infographic-01.prompt.md', 'INFOGRAPHIC 1'],
  ['infographic-02.prompt.md', 'INFOGRAPHIC 2'],
  ['seo.prompt.md', 'SEO'],
  ['tags.prompt.md', 'TAGS'],
];

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

async function copyToClipboard(text) {
  if (process.platform !== 'win32') return;
  await new Promise((resolve, reject) => {
    const clipboard = spawn('clip.exe');
    clipboard.once('error', reject);
    clipboard.once('close', (code) => code === 0 ? resolve() : reject(new Error(`clip.exe exited with ${code}`)));
    clipboard.stdin.once('error', reject);
    clipboard.stdin.end(text, 'utf8');
  });
}

async function main() {
  const [series, title] = process.argv.slice(2);
  if (!series || !title) {
    throw new Error('Usage: node scripts/writer_assistant.js <series> <title>');
  }

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const sessionDirectory = path.join(sessionRoot, date, `${series}-${safeName(title)}-${now.getTime()}`);
  const prompts = await buildPublishingPrompts({ series, title });
  const promptByName = new Map(prompts.map((prompt) => [prompt.filename, prompt.content]));
  const events = [{ type: 'session_started', at: now.toISOString() }];

  await fs.mkdir(sessionDirectory, { recursive: true });
  await Promise.all(prompts.map(({ filename, content }) => fs.writeFile(path.join(sessionDirectory, filename), content, 'utf8')));

  const terminal = readline.createInterface({ input, output });
  try {
    console.log('\n=================================\nCOSMOS Writer Assistant\n=================================');
    console.log(`Series: ${series}\nTopic: ${title}`);

    for (const [index, [filename, label]] of steps.entries()) {
      const prompt = promptByName.get(filename);
      if (!prompt) continue;
      await copyToClipboard(prompt);
      const copiedAt = new Date().toISOString();
      events.push({ type: 'prompt_copied', step: label, filename, at: copiedAt });
      console.log(`\n[${index + 1}/${steps.length}] ${label}\nPrompt copied to clipboard. Paste it into ChatGPT, then press ENTER.`);
      await terminal.question('');
      events.push({ type: 'step_completed', step: label, filename, at: new Date().toISOString() });
    }
  } finally {
    terminal.close();
  }

  events.push({ type: 'session_completed', at: new Date().toISOString() });
  await fs.writeFile(path.join(sessionDirectory, 'session.json'), `${JSON.stringify({ series, title, events }, null, 2)}\n`, 'utf8');
  console.log(`\nPublishing Package Complete\nSession: ${path.relative(projectRoot, sessionDirectory)}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
