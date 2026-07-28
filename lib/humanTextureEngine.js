const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const HUMAN_TEXTURE_FILES = [
  'scene-library.md',
  'sensory-library.md',
  'specificity-library.md',
  'texture-patterns.md',
  'human-texture-rules.md',
];

async function loadHumanTextureKnowledge() {
  const directory = path.join(projectRoot, 'knowledge', 'editorial');
  return Promise.all(
    HUMAN_TEXTURE_FILES.map(async (fileName) => ({
      fileName,
      content: await fs.readFile(path.join(directory, fileName), 'utf8'),
    })),
  );
}

async function buildHumanTextureGuidanceBlock() {
  const knowledge = await loadHumanTextureKnowledge();
  return [
    '# Human Texture Guidance Engine',
    '',
    'Use the following libraries to recommend concrete writing material only. Do not rewrite text. Do not invent facts. Mark all illustrative examples clearly as examples.',
    '',
    ...knowledge.flatMap(({ fileName, content }) => [
      `## ${fileName}`,
      '',
      content.trim(),
      '',
    ]),
    '## Planning Brief Output Contract',
    '',
    'Add this exact section to the Article Brief:',
    '',
    '## Human Texture Guidance',
    '',
    '- Recommended scenes:',
    '- Recommended sensory details:',
    '- Recommended concrete numbers:',
    '- Recommended locations:',
    '- Recommended examples:',
  ].join('\n');
}

module.exports = {
  HUMAN_TEXTURE_FILES,
  buildHumanTextureGuidanceBlock,
  loadHumanTextureKnowledge,
};
