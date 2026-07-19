const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const knowledgeFileNames = [
  'article-patterns.md',
  'title-patterns.md',
  'analogy-library.md',
  'faq-patterns.md',
  'keyword-patterns.md',
  'keyword-library.yaml',
  'related-articles.md',
];
const thumbnailKnowledgeFileNames = [
  'click-psychology.md',
  'thumbnail-patterns.md',
  'thumbnail-hooks.md',
  'thumbnail-policy.md',
];

const promptTypes = [
  { filename: 'article.prompt.md', taskFile: 'article.md' },
  { filename: 'thumbnail.prompt.md', taskFile: 'thumbnail.md' },
  { filename: 'infographic-01.prompt.md', taskFile: 'infographic.md' },
  { filename: 'infographic-02.prompt.md', taskFile: 'infographic.md' },
  { filename: 'tags.prompt.md', taskFile: 'tags.md' },
  { filename: 'seo.prompt.md', taskFile: 'seo.md' },
  { filename: 'seo-package.prompt.md', taskFile: 'seo-package.md' },
];

/**
 * Loads one Markdown file as UTF-8 text.
 *
 * @param {string} filePath - Absolute path to the Markdown file.
 * @returns {Promise<string>} The file contents.
 */
async function loadMarkdownFile(filePath) {
  return fs.readFile(filePath, 'utf8');
}

/**
 * Loads the ordered knowledge-pattern library for one content series.
 *
 * @param {string} series - The selected content series.
 * @returns {Promise<string[]>} The ordered knowledge-library contents.
 */
async function loadKnowledgeLibrary(series) {
  const knowledgeDirectory = path.join(projectRoot, 'knowledge', series);
  const knowledgeFiles = [];

  for (const fileName of knowledgeFileNames) {
    knowledgeFiles.push(
      await loadMarkdownFile(path.join(knowledgeDirectory, fileName)),
    );
  }

  return knowledgeFiles;
}

/**
 * Loads the shared knowledge required by the thumbnail CTR workflow.
 *
 * The library is deliberately added only to the thumbnail task so article and
 * SEO prompts remain focused on their own contracts.
 *
 * @returns {Promise<string[]>} The ordered thumbnail knowledge sections.
 */
async function loadThumbnailKnowledge() {
  const sharedDirectory = path.join(projectRoot, 'knowledge', 'shared');
  return Promise.all(
    thumbnailKnowledgeFileNames.map((fileName) =>
      loadMarkdownFile(path.join(sharedDirectory, fileName)),
    ),
  );
}

/**
 * Loads the shared context used by every publishing prompt for a series.
 *
 * @param {string} series - The selected content series.
 * @returns {Promise<string[]>} The ordered shared prompt sections.
 */
async function loadSharedPromptSections(series) {
  const systemDirectory = path.join(projectRoot, 'prompts', 'system');
  const seriesPath = path.join(projectRoot, 'prompts', 'series', `${series}.md`);

  const [identity, writingStyle, qualityRules, factCheck, seriesPrompt, knowledge] =
    await Promise.all([
      loadMarkdownFile(path.join(systemDirectory, 'identity.md')),
      loadMarkdownFile(path.join(systemDirectory, 'writing-style.md')),
      loadMarkdownFile(path.join(systemDirectory, 'quality-rules.md')),
      loadMarkdownFile(path.join(systemDirectory, 'fact-check.md')),
      loadMarkdownFile(seriesPath),
      loadKnowledgeLibrary(series),
    ]);

  return [
    identity,
    writingStyle,
    qualityRules,
    factCheck,
    seriesPrompt,
    ...knowledge,
  ];
}

/**
 * Builds one prompt from shared rules, series context, knowledge, a task, and user input.
 *
 * @param {object} options - Prompt input values.
 * @param {string} options.series - The selected content series.
 * @param {string} options.title - The article title supplied by the user.
 * @param {string[]} [options.sharedSections] - Previously loaded shared prompt sections.
 * @param {string} [options.taskFile='article.md'] - Task prompt filename.
 * @returns {Promise<string>} The assembled prompt text.
 */
async function buildPrompt({
  series,
  title,
  sharedSections,
  taskFile = 'article.md',
}) {
  const taskPath = path.join(projectRoot, 'prompts', 'tasks', taskFile);
  const isThumbnailTask = taskFile === 'thumbnail.md';
  const [sections, task, thumbnailKnowledge] = await Promise.all([
    sharedSections ?? loadSharedPromptSections(series),
    loadMarkdownFile(taskPath),
    isThumbnailTask ? loadThumbnailKnowledge() : Promise.resolve([]),
  ]);

  return [
    ...sections,
    ...thumbnailKnowledge,
    task,
    `# User Input\n\nTitle: ${title}`,
  ].join('\n\n');
}

/**
 * Builds every prompt required for a publishing package while loading shared
 * rules and knowledge only once.
 *
 * @param {object} options - Prompt input values.
 * @param {string} options.series - The selected content series.
 * @param {string} options.title - The article title supplied by the user.
 * @returns {Promise<Array<{filename: string, content: string}>>} Prompt files to save.
 */
async function buildPublishingPrompts({ series, title }) {
  const sharedSections = await loadSharedPromptSections(series);

  return Promise.all(
    promptTypes.map(async ({ filename, taskFile }) => ({
      filename,
      content: await buildPrompt({ series, title, sharedSections, taskFile }),
    })),
  );
}

module.exports = {
  buildPrompt,
  buildPublishingPrompts,
  loadThumbnailKnowledge,
  promptTypes,
};
