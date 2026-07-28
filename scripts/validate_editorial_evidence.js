const fs = require('node:fs/promises');
const path = require('node:path');
const {
  METRIC_KEYS,
  createPendingValidation,
  formatValidationEvent,
  validateEditorialRule,
  validateEvidenceEntry,
  validateProvenPattern,
} = require('../lib/editorialEvidenceEngine');
const { plannerEditorialKnowledgeFileNames } = require('../lib/promptBuilder');

const projectRoot = path.resolve(__dirname, '..');
const editorialDirectory = path.join(projectRoot, 'knowledge', 'editorial');
const requiredFiles = {
  'validation-events.md': ['# Validation Events', '### Metrics', '### Editor Review', '### Summary'],
  'editorial-rules.md': ['# Editorial Rules', '### Evidence Reference', '### Version'],
  'evidence-log.md': ['# Editorial Evidence Log', 'No evidence → No rule.'],
  'proven-patterns.md': ['# Proven Patterns', 'Status: validated', 'Validated Count'],
  'failed-patterns.md': ['# Failed Patterns', '### Lesson', 'Validation Event'],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectRejected(callback, message) {
  let rejected = false;
  try {
    callback();
  } catch {
    rejected = true;
  }
  assert(rejected, message);
}

function validationEvent(overrides = {}) {
  return {
    eventId: 'contract-001',
    date: '2026-07-21T00:00:00Z',
    article: 'contract-article.md',
    series: 'living-info',
    decision: 'Use a problem-first title.',
    status: 'validated',
    metrics: Object.fromEntries(METRIC_KEYS.map((key) => [key, null])),
    editorReview: 'The editor reviewed real publishing performance.',
    summary: 'The decision is supported for this scope.',
    published: true,
    performanceReviewed: true,
    humanApproved: true,
    ...overrides,
  };
}

async function main() {
  for (const [fileName, requiredText] of Object.entries(requiredFiles)) {
    const content = await fs.readFile(path.join(editorialDirectory, fileName), 'utf8');
    for (const text of requiredText) {
      assert(content.includes(text), `${fileName} is missing required contract text: ${text}`);
    }
  }

  assert(
    JSON.stringify(plannerEditorialKnowledgeFileNames)
      === JSON.stringify(['editorial-rules.md', 'proven-patterns.md']),
    'Planner Editorial Knowledge allowlist is invalid.',
  );

  assert(
    JSON.stringify(createPendingValidation())
      === JSON.stringify({ status: 'pending', eventId: null, validatedAt: null }),
    'Pending manifest validation contract is invalid.',
  );

  const validated = validationEvent();
  const rejected = validationEvent({ eventId: 'contract-002', status: 'rejected' });
  const rendered = formatValidationEvent(validated);
  for (const metric of METRIC_KEYS) {
    assert(rendered.includes(`- ${metric}: null`), `Validation Event is missing ${metric}.`);
  }

  expectRejected(
    () => formatValidationEvent(validationEvent({ published: false })),
    'An unpublished draft was accepted as a Validation Event.',
  );
  expectRejected(
    () => validateEvidenceEntry({
      rule: 'Rejected decisions must not become rules.',
      validationEvents: [rejected],
      conclusion: 'Reject promotion.',
    }),
    'Rejected evidence was accepted by the Evidence Log contract.',
  );

  validateEvidenceEntry({
    rule: 'Problem-first title for this validated scope.',
    validationEvents: [validated],
    conclusion: 'Eligible for human rule review.',
  });
  validateEditorialRule({
    rule: 'Use the validated pattern in the reviewed scope.',
    reason: 'A human reviewed the referenced publishing evidence.',
    validationEvents: [validated],
    since: '2026-07-21',
    version: '1.0.0',
    humanApproved: true,
  });
  validateProvenPattern({
    pattern: 'Validated problem-first framing.',
    status: 'validated',
    validatedCount: 1,
    appliesTo: 'living-info',
    validationEvents: [validated],
  });

  console.log('Editorial Evidence contracts passed.');
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
