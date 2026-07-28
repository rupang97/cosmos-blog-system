const fs = require('node:fs/promises');
const path = require('node:path');
const { assertShoppingConnectDisclosure } = require('../lib/articleValidation');

const projectRoot = path.resolve(__dirname, '..');
const outputDirectory = path.join(projectRoot, 'output');

async function articleFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await articleFiles(entryPath));
    else if (/^[a-z-]+-\d{3}\.md$/.test(entry.name)) files.push(entryPath);
  }

  return files;
}

async function main() {
  const files = await articleFiles(outputDirectory);
  const failures = [];

  for (const file of files) {
    try {
      assertShoppingConnectDisclosure(await fs.readFile(file, 'utf8'));
    } catch (error) {
      failures.push(`${path.relative(projectRoot, file)}: ${error.message}`);
    }
  }

  if (failures.length) throw new Error(`Invalid article disclosure(s):\n${failures.join('\n')}`);
  console.log(`Validated ${files.length} article file(s).`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
