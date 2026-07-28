const assert = require('node:assert/strict');
const {
  KEYWORD_PSYCHOLOGY_FILES,
  buildKeywordPsychologyGuidanceBlock,
  loadKeywordPsychologyKnowledge,
} = require('../lib/keywordPsychologyEngine');
const {
  PLANNING_CRITERIA,
  assertApprovedPlan,
  evaluatePlanning,
} = require('../lib/plannerEngine');
const { buildPublishingPrompts } = require('../lib/promptBuilder');
const { QUALITY_RUBRIC } = require('../lib/qualityEngine');

async function main() {
  const knowledge = await loadKeywordPsychologyKnowledge();
  assert.equal(knowledge.length, KEYWORD_PSYCHOLOGY_FILES.length);

  const guidance = await buildKeywordPsychologyGuidanceBlock();
  assert.match(guidance, /# Keyword Psychology Engine/);
  assert.match(guidance, /Action Intent over Search Volume/);
  assert.match(guidance, /not Editorial Evidence/i);

  assert.equal(QUALITY_RUBRIC.reduce((total, item) => total + item.maximum, 0), 100);
  assert.equal(QUALITY_RUBRIC.find(({ key }) => key === 'keywordPsychology').maximum, 10);
  assert.deepEqual(
    PLANNING_CRITERIA.find(({ key }) => key === 'keywordQuality'),
    { key: 'keywordQuality', label: 'Keyword Quality', maximum: 20, minimum: 15 },
  );

  const planning = evaluatePlanning({
    scores: PLANNING_CRITERIA.map(({ key, maximum }) => ({
      key,
      score: key === 'keywordQuality' ? 14 : maximum,
      reason: 'checked',
    })),
    improvementSuggestions: ['Improve Action Intent and keyword quality.'],
  });
  assert.equal(planning.status, 'needs_improvement');
  assert.equal(planning.approved, false);
  assert.throws(() => assertApprovedPlan({
    brief: '## Planning Score\n\n90',
    planning: { approved: true, score: 90, humanDecision: 'create_new' },
  }), /Keyword Quality/);
  assert.throws(() => assertApprovedPlan({
    brief: '## Planning Score\n\n90\n\n- Keyword Quality: 14/20 — checked',
    planning: { approved: true, score: 90, humanDecision: 'create_new' },
  }), /Keyword Quality/);

  const keywordPlan = `### Primary Keyword

- Keyword: 제습기 전기세 계산
- Intent: 비용 확인
- Evidence Status: verified
- Evidence Source: 사람 검토 기록
- Observed At: 2026-07-26
- Channel Fit: naver
- Lifecycle: evergreen

### Supporting Long-tail Keywords

- 제습기 전기세 계산 원룸
- 제습기 전기요금 확인 여름철
- 제습기 소비전력 비교 장마철`;
  const brief = `## Planning Score

90

- Keyword Quality: 15/20 — checked

${keywordPlan}`;
  const approvedPlanning = { approved: true, score: 90, humanDecision: 'create_new' };
  assert.throws(() => assertApprovedPlan({
    brief: '## Planning Score\n\n90\n\n- Keyword Quality: 15/20 — checked',
    planning: approvedPlanning,
  }), /Primary Keyword/);
  assert.throws(() => assertApprovedPlan({
    brief: brief.replace(/\n- 제습기 소비전력 비교 장마철/, ''),
    planning: approvedPlanning,
  }), /Supporting Long-tail Keywords/);
  assert.throws(() => assertApprovedPlan({
    brief: brief.replace('Evidence Status: verified', 'Evidence Status: candidate'),
    planning: approvedPlanning,
  }), /Evidence Status/);
  assert.throws(() => assertApprovedPlan({
    brief: brief.replace('Channel Fit: naver', 'Channel Fit: bing'),
    planning: approvedPlanning,
  }), /Channel Fit/);
  assert.throws(() => assertApprovedPlan({
    brief: brief.replace('Lifecycle: evergreen', 'Lifecycle: temporary'),
    planning: approvedPlanning,
  }), /Lifecycle/);
  assert.doesNotThrow(() => assertApprovedPlan({ brief, planning: approvedPlanning }));

  const prompts = await buildPublishingPrompts({
    series: 'living-info',
    title: '제습기 전기세 계산',
    articleBrief: brief,
  });
  for (const filename of ['seo.prompt.md', 'seo-package.prompt.md', 'tags.prompt.md']) {
    assert.match(prompts.find((prompt) => prompt.filename === filename).content, /# Approved Article Brief/);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
