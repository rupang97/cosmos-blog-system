const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline/promises');
const { spawn } = require('node:child_process');
const { stdin: input, stdout: output } = require('node:process');
const { buildPublishingPrompts } = require('../lib/promptBuilder');
const {
  PUBLISH_DOCUMENT_FILENAME,
  buildPublishDocument,
} = require('../lib/publishDocumentBuilder');

const projectRoot = path.resolve(__dirname, '..');
const seriesPath = path.join(projectRoot, 'config', 'series.json');
const templatePath = path.join(projectRoot, 'templates', 'living-info.md');
const reviewTemplatePath = path.join(projectRoot, 'reviews', 'article-review.md');
const outputDirectory = path.join(projectRoot, 'output');

/**
 * Collects the series and title needed to generate an article.
 *
 * @returns {Promise<{series: string, title: string}>} The trimmed user input.
 */
async function promptForArticleDetails() {
  const terminal = readline.createInterface({ input, output });

  try {
    const series = (await terminal.question('Series: ')).trim();
    const title = (await terminal.question('Title: ')).trim();

    return { series, title };
  } finally {
    terminal.close();
  }
}

/**
 * Saves each prompt and its convenience publishing document without calling an AI service.
 *
 * @param {Array<{filename: string, content: string}>} prompts - Prompt files to save.
 * @returns {Promise<string[]>} The saved prompt filenames.
 */
async function savePublishingPackage(prompts) {
  await fs.mkdir(outputDirectory, { recursive: true });

  const review = await fs.readFile(reviewTemplatePath, 'utf8');
  const publishDocument = buildPublishDocument({ prompts, review });

  await Promise.all(
    [
      ...prompts.map(({ filename, content }) =>
        fs.writeFile(path.join(outputDirectory, filename), content, 'utf8'),
      ),
      fs.writeFile(
        path.join(outputDirectory, PUBLISH_DOCUMENT_FILENAME),
        publishDocument,
        'utf8',
      ),
    ],
  );

  return [...prompts.map(({ filename }) => filename), PUBLISH_DOCUMENT_FILENAME];
}

/**
 * Copies prompt text to the Windows clipboard when the native utility is available.
 *
 * @param {string} prompt - The prompt content to copy.
 * @returns {Promise<void>}
 */
async function copyPromptToClipboard(prompt) {
  if (process.platform !== 'win32') {
    return;
  }

  await new Promise((resolve, reject) => {
    const clipboard = spawn('clip.exe');

    clipboard.once('error', reject);
    clipboard.once('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Clipboard copy failed with exit code ${code}.`));
    });
    clipboard.stdin.once('error', reject);
    clipboard.stdin.end(prompt, 'utf8');
  });
}

/**
 * Creates a sidecar manifest describing one generated article.
 *
 * @param {object} articleDetails - Metadata for the generated article.
 * @param {string} articleDetails.series - The content series.
 * @param {string} articleDetails.title - The article title.
 * @param {number} articleDetails.articleNumber - The incremented series number.
 * @param {string} articleDetails.filename - The generated article filename.
 * @param {string[]} articleDetails.promptFiles - The generated publishing prompt filenames.
 * @returns {Promise<void>}
 */
async function createArticleManifest({
  series,
  title,
  articleNumber,
  filename,
  promptFiles,
}) {
  const manifestFilename = `${path.parse(filename).name}.manifest.json`;
  const manifestPath = path.join(outputDirectory, manifestFilename);
  const manifest = {
    series,
    articleNumber,
    title,
    articleFile: filename,
    promptFiles,
    createdAt: new Date().toISOString(),
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

/**
 * Builds and saves a prompt, then creates the next Markdown article file.
 *
 * @returns {Promise<void>}
 */
async function generateArticle() {
  const { series, title } = await promptForArticleDetails();

  if (!series || !title) {
    throw new Error('Series and title are required.');
  }

  // Prompt creation is local-only in this MVP; no AI API is called.
  const prompts = await buildPublishingPrompts({ series, title });
  const promptFiles = await savePublishingPackage(prompts);
  const articlePrompt = prompts.find(
    ({ filename }) => filename === 'article.prompt.md',
  );

  try {
    await copyPromptToClipboard(articlePrompt.content);
    console.log('Copied article prompt to the Windows clipboard.');
  } catch (error) {
    console.warn(`Warning: ${error.message}`);
  }

  // Read the current article number for each supported series.
  const seriesData = JSON.parse(await fs.readFile(seriesPath, 'utf8'));

  if (!Object.hasOwn(seriesData, series)) {
    throw new Error(`Unknown series: ${series}`);
  }

  let template;

  try {
    // The first MVP uses the living-info template for every selected series.
    template = await fs.readFile(templatePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Template not found: ${templatePath}`);
    }

    throw error;
  }

  // Increment before naming so a current value of 18 produces article 019.
  const articleNumber = seriesData[series] + 1;
  const paddedNumber = String(articleNumber).padStart(3, '0');
  const filename = `${series}-${paddedNumber}.md`;
  const articlePath = path.join(outputDirectory, filename);

  // Only the title is filled in for this MVP; all other placeholders remain.
  const article = template.replace('{{TITLE}}', title);

  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(articlePath, article, 'utf8');
  await createArticleManifest({
    series,
    title,
    articleNumber,
    filename,
    promptFiles,
  });

  // Persist the new number only after the article file has been created.
  seriesData[series] = articleNumber;
  await fs.writeFile(seriesPath, `${JSON.stringify(seriesData, null, 2)}\n`, 'utf8');

  console.log(`Created ${path.relative(projectRoot, articlePath)}`);
}

/**
 * Reports a generation error and marks the process as unsuccessful.
 *
 * @param {Error} error - The error raised during generation.
 * @returns {void}
 */
function handleError(error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}

generateArticle().catch(handleError);
