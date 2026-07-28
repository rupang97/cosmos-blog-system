const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { buildPlanningPrompt } = require('../lib/promptBuilder');
const {
  CONTENT_DECISIONS,
  assertApprovedPlan,
  assertHumanDecision,
  extractEditorialDecision,
} = require('../lib/plannerEngine');
const { saveDecisionRecord } = require('./generate_article');

const strategyEvidence = `# Strategy Evidence

## Search Evidence

- Search Demand: Not available
- Search Intent: comparison
- SERP Competition: Not available
- Channel: Google
- Observed At: 2026-07-27
- Source: editor research

## Content Evidence

- Existing Articles: None found
- Existing Performance: Not available
- Topic Overlap: None found
- Cannibalization Risk: Low
- Internal Link Opportunities: Not available

## Project and Business Evidence

- Series Goal: Practical guidance
- Brand Goal: Trust
- Business Goal: Not available
- Expected Contribution: Reader understanding

## Knowledge Coverage Evidence

- Reader Already Knows: The basic term
- Reader Actually Wants: A next action
- Understanding Gap: Conditions for that action
- Existing Knowledge Assets: Not available
- Missing Knowledge: Decision criteria

## Evidence Gaps

- No performance data`;

function decisionBrief({ status = 'sufficient', action = 'create_new' } = {}) {
  const reviewEvidence = strategyEvidence.replace(/^## /gm, '### ')
    .replace(/^# Strategy Evidence/m, '## Strategy Evidence Review');
  return `${reviewEvidence}

## Editorial Decision Recommendation

- Evidence Status: ${status}
- Recommended Action: ${action}
- Reader Value: Clear next action
- Content Portfolio Fit: No overlap found
- Search Feasibility: Intent observed
- Project and Business Contribution: Supports series goal
- Recommendation Rationale: Evidence supports a hypothesis.
- Required Next Evidence: Performance review after publishing`;
}

async function main() {
  const prompt = await buildPlanningPrompt({
    series: 'living-info', topic: 'Decision Gate', strategyEvidence,
  });
  assert.match(prompt, /# Strategy Evidence Input/);
  assert.match(prompt, /- Search Demand: Not available/);
  await assert.rejects(
    buildPlanningPrompt({ series: 'living-info', topic: 'Decision Gate', strategyEvidence: '  ' }),
    /Strategy Evidence/,
  );

  for (const action of CONTENT_DECISIONS) {
    assert.equal(extractEditorialDecision(decisionBrief({
      action, status: action === 'research_needed' ? 'insufficient' : 'sufficient',
    })).recommendedAction, action);
    assert.equal(assertHumanDecision(action), action);
  }
  assert.throws(() => extractEditorialDecision(decisionBrief({ action: 'redirect' })), /invalid/);
  assert.throws(() => assertHumanDecision('redirect'), /invalid/);
  assert.throws(() => extractEditorialDecision(decisionBrief().replace('- Source: editor research\n', '')), /missing Source/);
  assert.throws(() => extractEditorialDecision(decisionBrief({ status: 'insufficient', action: 'create_new' })), /conflicts/);
  assert.throws(() => extractEditorialDecision(decisionBrief({ status: 'sufficient', action: 'research_needed' })), /conflicts/);

  const articleBrief = `## Planning Score

90

- Keyword Quality: 15/20 — checked

### Primary Keyword

- Keyword: gate
- Intent: evaluate
- Evidence Status: verified
- Evidence Source: editor
- Observed At: 2026-07-27
- Channel Fit: google
- Lifecycle: evergreen

### Supporting Long-tail Keywords

- gate evaluate one
- gate evaluate two
- gate evaluate three`;
  assert.doesNotThrow(() => assertApprovedPlan({
    brief: articleBrief, planning: { approved: true, score: 90, humanDecision: 'create_new' },
  }));
  assert.doesNotThrow(() => assertApprovedPlan({
    brief: articleBrief,
    planning: {
      approved: true,
      score: 90,
      contentDecision: { humanDecision: 'create_new' },
    },
  }));
  assert.throws(() => assertApprovedPlan({
    brief: articleBrief, planning: { approved: true, score: 90, humanDecision: 'stop' },
  }), /Human Decision/);

  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'cosmos-decision-'));
  try {
    const seriesBefore = await fs.readFile(path.join(__dirname, '..', 'config', 'series.json'), 'utf8');
    const record = await saveDecisionRecord({
      series: 'living-info', topic: 'Decision Gate', recommendedAction: 'stop',
      humanDecision: 'stop', brief: decisionBrief({ action: 'stop' }), directory: tempDirectory,
    });
    assert.match(await fs.readFile(record, 'utf8'), /- Human Decision: stop/);
    assert.equal((await fs.readdir(tempDirectory)).filter((file) => /^living-info-\d{3}\.md$/.test(file)).length, 0);
    assert.equal(await fs.readFile(path.join(__dirname, '..', 'config', 'series.json'), 'utf8'), seriesBefore);
  } finally {
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
