const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {
  HUMAN_TEXTURE_FILES,
  buildHumanTextureGuidanceBlock,
  loadHumanTextureKnowledge,
} = require('../lib/humanTextureEngine');
const {
  QUALITY_RUBRIC,
  evaluateQuality,
  renderQualityReport,
} = require('../lib/qualityEngine');

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const knowledge = await loadHumanTextureKnowledge();
  assert.equal(knowledge.length, HUMAN_TEXTURE_FILES.length);

  const guidance = await buildHumanTextureGuidanceBlock();
  assert.match(guidance, /# Human Texture Guidance Engine/);
  assert.match(guidance, /recommendations only/i);
  assert.match(guidance, /Do not invent facts/i);
  assert.match(guidance, /Recommended scenes/);

  assert.equal(
    QUALITY_RUBRIC.reduce((total, item) => total + item.maximum, 0),
    100,
  );
  assert.equal(QUALITY_RUBRIC.find(({ key }) => key === 'humanTexture').maximum, 10);

  const [articleTask, planningTask, qualityRubric] = await Promise.all([
    fs.readFile(path.join(projectRoot, 'prompts', 'tasks', 'article.md'), 'utf8'),
    fs.readFile(path.join(projectRoot, 'prompts', 'tasks', 'article-plan.md'), 'utf8'),
    fs.readFile(path.join(projectRoot, 'knowledge', 'shared', 'quality-rubric.md'), 'utf8'),
  ]);
  assert.match(articleTask, /claim → reason → principle/);
  assert.match(articleTask, /Do not generate first-person anecdotes/);
  assert.match(planningTask, /Verified concrete facts and sources/);
  assert.match(planningTask, /Verified real-world cases and sources/);
  assert.match(qualityRubric, /예외·한계/);

  const quality = evaluateQuality({
    series: 'living-info',
    failGates: [
      { key: 'factAccuracy', passed: true, reason: 'ok' },
      { key: 'searchIntent', passed: true, reason: 'ok' },
      { key: 'claims', passed: true, reason: 'ok' },
      { key: 'projectRules', passed: true, reason: 'ok' },
      { key: 'requiredSections', passed: true, reason: 'ok' },
    ],
    scores: QUALITY_RUBRIC.map(({ key, maximum }) => ({
      key,
      score: key === 'humanTexture' ? 5 : maximum,
      reason: 'ok',
    })),
    confidence: 90,
    summary: ['ok', 'ok', 'ok'],
  });

  assert.equal(quality.humanTextureWarning, true);
  assert.match(renderQualityReport(quality), /## Human Texture Warning/);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
