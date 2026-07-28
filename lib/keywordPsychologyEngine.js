const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const KEYWORD_PSYCHOLOGY_FILES = [
  'keyword-psychology.md',
  'action-keywords.md',
  'problem-solution-patterns.md',
  'search-intent-library.md',
  'curiosity-hooks.md',
];

async function loadKeywordPsychologyKnowledge() {
  const directory = path.join(projectRoot, 'knowledge', 'editorial');
  return Promise.all(KEYWORD_PSYCHOLOGY_FILES.map(async (fileName) => ({
    fileName,
    content: await fs.readFile(path.join(directory, fileName), 'utf8'),
  })));
}

async function buildKeywordPsychologyGuidanceBlock() {
  const knowledge = await loadKeywordPsychologyKnowledge();
  return [
    '# Keyword Psychology Engine',
    '',
    'Use this library for recommendations only. Keep Search Intent analysis. Prioritize Action Intent over Search Volume. Do not invent facts, performance, or search-volume data. This library is not Editorial Evidence and must not be promoted automatically.',
    '',
    ...knowledge.flatMap(({ fileName, content }) => [`## ${fileName}`, '', content.trim(), '']),
  ].join('\n');
}

module.exports = {
  KEYWORD_PSYCHOLOGY_FILES,
  buildKeywordPsychologyGuidanceBlock,
  loadKeywordPsychologyKnowledge,
};
