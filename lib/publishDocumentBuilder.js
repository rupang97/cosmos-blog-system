const PUBLISH_DOCUMENT_FILENAME = 'publish.md';

const publishSections = [
  { heading: '1. Article Prompt', filename: 'article.prompt.md' },
  { heading: '2. Thumbnail Prompt', filename: 'thumbnail.prompt.md' },
  { heading: '3. Infographic 1', filename: 'infographic-01.prompt.md' },
  { heading: '4. Infographic 2', filename: 'infographic-02.prompt.md' },
  { heading: '5. SEO Package', filename: 'seo-package.prompt.md' },
  { heading: '6. Tags', filename: 'tags.prompt.md' },
];

/**
 * Builds the convenience publishing document from already generated prompt files.
 *
 * @param {object} options - Publishing document source content.
 * @param {Array<{filename: string, content: string}>} options.prompts - Generated prompts.
 * @param {string} options.review - The review contract to append.
 * @returns {string} The ordered publishing document.
 */
function buildPublishDocument({ prompts, review }) {
  const promptsByFilename = new Map(
    prompts.map(({ filename, content }) => [filename, content]),
  );
  const sections = publishSections.map(({ heading, filename }) => {
    const content = promptsByFilename.get(filename);

    if (!content) {
      throw new Error(`Cannot build publish document: missing ${filename}.`);
    }

    return `## ${heading}\n\n${content}`;
  });

  sections.push(`## 7. Review\n\n${review}`);

  return `# Publishing Package\n\n${sections.join('\n\n')}`;
}

module.exports = {
  PUBLISH_DOCUMENT_FILENAME,
  buildPublishDocument,
  publishSections,
};
