const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline/promises');
const { spawn } = require('node:child_process');
const { stdin: input, stdout: output } = require('node:process');
const {
  buildPlanningPrompt,
  buildPublishingPrompts,
} = require('../lib/promptBuilder');
const {
  assertApprovedPlan,
  assertHumanDecision,
  assertHumanSelectedTitle,
  extractEditorialDecision,
  extractPlanningScore,
  extractTitleCandidates,
  normalizeSelectionReason,
} = require('../lib/plannerEngine');
const {
  PUBLISH_DOCUMENT_FILENAME,
  buildPublishDocument,
} = require('../lib/publishDocumentBuilder');
const {
  buildQualityReviewPrompt,
  createPendingQuality,
} = require('../lib/qualityEngine');
const { createPendingValidation } = require('../lib/editorialEvidenceEngine');
const { assertShoppingConnectDisclosure } = require('../lib/articleValidation');

const projectRoot = path.resolve(__dirname, '..');
const seriesPath = path.join(projectRoot, 'config', 'series.json');
const templatePath = path.join(projectRoot, 'templates', 'living-info.md');
const reviewTemplatePath = path.join(projectRoot, 'reviews', 'article-review.md');
const qualityReviewTaskPath = path.join(
  projectRoot,
  'prompts',
  'tasks',
  'article-review.md',
);
const qualityRubricPath = path.join(
  projectRoot,
  'knowledge',
  'shared',
  'quality-rubric.md',
);
const outputDirectory = path.join(projectRoot, 'output');
const decisionsDirectory = path.join(outputDirectory, 'decisions');
const titleDecisionsPath = path.join(
  projectRoot,
  'knowledge',
  'editorial',
  'title-decisions.md',
);

/**
 * Collects the series and topic needed to plan an article.
 *
 * @returns {Promise<{series: string, topic: string, strategyEvidencePath: string}>} The trimmed user input.
 */
async function promptForArticleDetails() {
  const terminal = readline.createInterface({ input, output });

  try {
    const series = (await terminal.question('Series: ')).trim();
    const topic = (await terminal.question('Topic: ')).trim();
    const strategyEvidencePath = (await terminal.question('Strategy Evidence path: ')).trim();

    return { series, topic, strategyEvidencePath };
  } finally {
    terminal.close();
  }
}

async function promptForDecision() {
  const terminal = readline.createInterface({ input, output });

  try {
    const briefPath = (await terminal.question('Approved Decision Brief path: ')).trim();
    const humanDecision = (await terminal.question('Human Decision: ')).trim();
    return { briefPath, humanDecision };
  } finally {
    terminal.close();
  }
}

async function promptForCreateNewDetails() {
  const terminal = readline.createInterface({ input, output });

  try {
    const scoreText = (await terminal.question('Planning Score (85-100): ')).trim();
    const selectedTitle = (await terminal.question('Human-selected title: ')).trim();
    const selectionReason = await terminal.question('Selection Reason (optional, one sentence): ');
    return {
      score: Number(scoreText),
      selectedTitle,
      selectionReason: normalizeSelectionReason(selectionReason),
    };
  } finally {
    terminal.close();
  }
}

async function saveDecisionRecord({ series, topic, recommendedAction, humanDecision, brief, directory = decisionsDirectory }) {
  await fs.mkdir(directory, { recursive: true });
  const record = `# Content Decision Record\n\n- Date: ${new Date().toISOString()}\n- Series: ${series}\n- Topic: ${topic}\n- Status: hypothesis\n- AI Recommended Action: ${recommendedAction}\n- Human Decision: ${humanDecision}\n- Published: false\n- Performance Reviewed: false\n\n## Approved Decision Brief\n\n${brief}\n`;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  for (let suffix = 0; ; suffix += 1) {
    const filename = `${timestamp}${suffix ? `-${suffix}` : ''}.md`;
    try {
      await fs.writeFile(path.join(directory, filename), record, { encoding: 'utf8', flag: 'wx' });
      return path.join(directory, filename);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
}

/**
 * Saves each prompt and its convenience publishing document without calling an AI service.
 *
 * @param {Array<{filename: string, content: string}>} prompts - Prompt files to save.
 * @returns {Promise<string[]>} The saved prompt filenames.
 */
async function savePublishingPackage(prompts, packageDirectory, articleBrief) {
  await fs.mkdir(packageDirectory, { recursive: true });

  const review = await fs.readFile(reviewTemplatePath, 'utf8');
  const publishDocument = buildPublishDocument({ prompts, review, articleBrief });

  await Promise.all(
    [
      ...prompts.map(({ filename, content }) =>
        fs.writeFile(path.join(packageDirectory, filename), content, 'utf8'),
      ),
      fs.writeFile(
        path.join(packageDirectory, PUBLISH_DOCUMENT_FILENAME),
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
 * @param {object} articleDetails.planning - Approved planning metadata.
 * @param {object} articleDetails.quality - Initial quality metadata.
 * @param {string} [articleDetails.qualityReportFile] - Quality-report filename after evaluation.
 * @returns {Promise<void>}
 */
async function createArticleManifest({
  series,
  title,
  articleNumber,
  filename,
  promptFiles,
  packageDirectory,
  planning,
  quality,
  qualityReportFile,
}) {
  const manifestFilename = `${path.parse(filename).name}.manifest.json`;
  const manifestPath = path.join(packageDirectory, manifestFilename);
  const manifest = {
    series,
    articleNumber,
    title,
    articleFile: filename,
    promptFiles,
    status: 'draft',
    workflow: {
      generated: true,
      reviewed: false,
      published: false,
    },
    planning,
    quality,
    validation: createPendingValidation(),
    createdAt: new Date().toISOString(),
  };

  if (qualityReportFile) {
    manifest.qualityReportFile = qualityReportFile;
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function appendTitleDecision({
  series,
  topic,
  title,
  selectionReason,
  titleCandidates,
  decisionId,
}) {
  if (selectionReason === null) {
    selectionReason = 'Not provided';
  }

  const candidateRecords = titleCandidates.flatMap((candidate, index) => [
    `### Candidate ${index + 1}: ${candidate.title === title ? 'selected' : 'rejected'}`,
    '',
    `- Strategy: ${candidate.strategy}`,
    `- Title: ${candidate.title}`,
    `- Related Search Keywords: ${candidate.relatedSearchKeywords.join(', ')}`,
    `- Estimated Search Intent Match: ${candidate.searchIntentMatch}/5`,
    `- Estimated CTR: ${candidate.estimatedCtr}/5`,
    `- Brand Fit: ${candidate.brandFit}/5`,
    `- Candidate Reason: ${candidate.reason}`,
    '',
  ]);

  const entry = [
    '',
    `## ${new Date().toISOString()}`,
    '',
    `- Decision ID: ${decisionId}`,
    '- Status: hypothesis',
    '- Published: false',
    '- Performance Reviewed: false',
    `- Series: ${series}`,
    `- Topic: ${topic}`,
    `- Selected Title: ${title}`,
    `- Selection Reason: ${selectionReason}`,
    '',
    ...candidateRecords,
  ].join('\n');

  await fs.appendFile(titleDecisionsPath, entry, 'utf8');
}

/**
 * Creates only the quality-review prompt for a new draft.
 * A quality report is generated after a separate evaluator returns PASS or FAIL.
 *
 * @param {object} options - Quality artifact inputs.
 * @param {string} options.filename - Article filename.
 * @param {string} options.article - Article Markdown.
 * @returns {Promise<{quality: object, qualityPromptFile: string}>} Initial quality artifacts.
 */
async function createQualityArtifacts({ filename, articleBrief, article, packageDirectory }) {
  const articleStem = path.parse(filename).name;
  const quality = createPendingQuality();
  const qualityPromptFile = `${articleStem}-quality-review.prompt.md`;
  const [instructions, rubric] = await Promise.all([
    fs.readFile(qualityReviewTaskPath, 'utf8'),
    fs.readFile(qualityRubricPath, 'utf8'),
  ]);

  await Promise.all([
    fs.writeFile(
      path.join(packageDirectory, qualityPromptFile),
      `${buildQualityReviewPrompt({ instructions, rubric, articleBrief, article })}\n`,
      'utf8',
    ),
  ]);

  return { quality, qualityPromptFile };
}

/**
 * Builds and saves a prompt, then creates the next Markdown article file.
 *
 * @returns {Promise<void>}
 */
async function generateArticle() {
  const { series, topic, strategyEvidencePath } = await promptForArticleDetails();

  if (!series || !topic || !strategyEvidencePath) {
    throw new Error('Series, topic, and Strategy Evidence path are required.');
  }
  if (path.extname(strategyEvidencePath).toLowerCase() !== '.md') {
    throw new Error('Strategy Evidence must be a Markdown (.md) file.');
  }

  const seriesData = JSON.parse(await fs.readFile(seriesPath, 'utf8'));

  if (!Object.hasOwn(seriesData, series)) {
    throw new Error(`Unknown series: ${series}`);
  }

  let strategyEvidence;
  try {
    strategyEvidence = await fs.readFile(path.resolve(strategyEvidencePath), 'utf8');
  } catch (error) {
    throw new Error(`Strategy Evidence could not be read: ${strategyEvidencePath}`);
  }
  if (!strategyEvidence.trim()) {
    throw new Error('Strategy Evidence must not be empty.');
  }

  const planningPrompt = await buildPlanningPrompt({ series, topic, strategyEvidence });
  try {
    await copyPromptToClipboard(planningPrompt);
    console.log('Copied planning prompt to the Windows clipboard.');
  } catch (error) {
    console.warn(`Warning: ${error.message}`);
  }

  const { briefPath, humanDecision } = await promptForDecision();
  if (!briefPath) {
    throw new Error('An Approved Decision Brief path is required.');
  }
  const articleBrief = await fs.readFile(path.resolve(briefPath), 'utf8');
  const { recommendedAction } = extractEditorialDecision(articleBrief);
  assertHumanDecision(humanDecision);
  if (humanDecision !== 'create_new') {
    const recordPath = await saveDecisionRecord({
      series, topic, recommendedAction, humanDecision, brief: articleBrief,
    });
    console.log(`Saved ${path.relative(projectRoot, recordPath)}`);
    return;
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
  const articleStem = path.parse(filename).name;
  const packageDirectory = path.join(outputDirectory, articleStem);
  const articlePath = path.join(packageDirectory, filename);

  // No Writer prompt or article draft is created until the human chooses create_new.
  await fs.mkdir(packageDirectory, { recursive: true });
  await fs.writeFile(path.join(packageDirectory, 'article-plan.prompt.md'), planningPrompt, 'utf8');

  const {
    score,
    selectedTitle,
    selectionReason,
  } = await promptForCreateNewDetails();
  const title = assertHumanSelectedTitle({ brief: articleBrief, selectedTitle });
  const titleCandidates = extractTitleCandidates(articleBrief);
  const briefScore = extractPlanningScore(articleBrief);
  if (score !== briefScore) {
    throw new Error(
      `Planning Score does not match the Article Brief (${briefScore}).`,
    );
  }
  const planning = {
    status: score >= 85 ? 'approved' : 'needs_improvement',
    score,
    approved: score >= 85,
    brief: 'article-brief.md',
    selectionReason,
    titleDecisionStatus: 'hypothesis',
    contentDecision: {
      recommendedAction,
      humanDecision,
      status: 'hypothesis',
    },
  };
  assertApprovedPlan({ brief: articleBrief, planning });
  await fs.writeFile(path.join(packageDirectory, planning.brief), articleBrief, 'utf8');

  const prompts = await buildPublishingPrompts({ series, title, articleBrief });
  const promptFiles = await savePublishingPackage(prompts, packageDirectory, articleBrief);
  const articlePrompt = prompts.find(({ filename: promptFile }) => promptFile === 'article.prompt.md');

  try {
    await copyPromptToClipboard(articlePrompt.content);
    console.log('Copied article prompt to the Windows clipboard.');
  } catch (error) {
    console.warn(`Warning: ${error.message}`);
  }

  // Only the title is filled in for this MVP; all other placeholders remain.
  const article = template.replace('{{TITLE}}', title);
  assertShoppingConnectDisclosure(article);

  await fs.mkdir(packageDirectory, { recursive: true });
  await fs.writeFile(articlePath, article, 'utf8');
  const { quality, qualityPromptFile } = await createQualityArtifacts({
    filename,
    articleBrief,
    article,
    packageDirectory,
  });
  await createArticleManifest({
    series,
    title,
    articleNumber,
    filename,
    promptFiles: ['article-plan.prompt.md', planning.brief, ...promptFiles, qualityPromptFile],
    packageDirectory,
    planning,
    quality,
  });

  // Persist the new number only after the article file has been created.
  seriesData[series] = articleNumber;
  await fs.writeFile(seriesPath, `${JSON.stringify(seriesData, null, 2)}\n`, 'utf8');
  await appendTitleDecision({
    series,
    topic,
    title,
    selectionReason,
    titleCandidates,
    decisionId: `${articleStem}-title`,
  });

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

if (require.main === module) {
  generateArticle().catch(handleError);
}

module.exports = { saveDecisionRecord };
