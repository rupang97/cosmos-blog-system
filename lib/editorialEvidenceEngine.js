const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const validationEventsPath = path.join(
  projectRoot,
  'knowledge',
  'editorial',
  'validation-events.md',
);

const VALIDATION_STATUSES = new Set(['validated', 'rejected']);
const METRIC_KEYS = [
  'ctr',
  'searchTraffic',
  'averageReadTime',
  'scrollDepth',
  'returnVisitors',
  'comments',
  'shares',
  'likes',
];

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function normalizeEventId(eventId) {
  const normalizedEventId = requireText(eventId, 'Event ID');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(normalizedEventId)) {
    throw new Error('Event ID may contain only letters, numbers, dots, underscores, and hyphens.');
  }
  return normalizedEventId;
}

function normalizeDate(value) {
  const normalizedDate = requireText(value, 'Date');
  if (Number.isNaN(Date.parse(normalizedDate))) {
    throw new Error('Date must be a valid date or timestamp.');
  }
  return normalizedDate;
}

function normalizeMetrics(metrics = {}) {
  if (!metrics || typeof metrics !== 'object' || Array.isArray(metrics)) {
    throw new Error('Metrics must be an object.');
  }

  return Object.fromEntries(METRIC_KEYS.map((key) => {
    const value = metrics[key] ?? null;
    if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
      throw new Error(`Metric ${key} must be a non-negative number or null.`);
    }
    if (key === 'scrollDepth' && value !== null && value > 100) {
      throw new Error('Metric scrollDepth must be between 0 and 100 or null.');
    }
    return [key, value];
  }));
}

function normalizeValidationEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    throw new Error('Validation Event must be an object.');
  }

  const status = requireText(event.status, 'Status');
  if (!VALIDATION_STATUSES.has(status)) {
    throw new Error('Validation Event status must be validated or rejected.');
  }
  if (event.published !== true || event.performanceReviewed !== true
    || event.humanApproved !== true) {
    throw new Error('Validation requires a published article, reviewed performance, and human approval.');
  }

  return {
    eventId: normalizeEventId(event.eventId),
    date: normalizeDate(event.date),
    article: requireText(event.article, 'Article'),
    series: requireText(event.series, 'Series'),
    decision: requireText(event.decision, 'Decision'),
    status,
    metrics: normalizeMetrics(event.metrics),
    editorReview: requireText(event.editorReview, 'Editor Review'),
    summary: requireText(event.summary, 'Summary'),
    published: true,
    performanceReviewed: true,
    humanApproved: true,
  };
}

function formatMetric(value) {
  return value === null ? 'null' : String(value);
}

function formatValidationEvent(event) {
  const normalized = normalizeValidationEvent(event);
  return [
    '',
    `## Validation Event #${normalized.eventId}`,
    '',
    `- Date: ${normalized.date}`,
    `- Article: ${normalized.article}`,
    `- Series: ${normalized.series}`,
    `- Decision: ${normalized.decision}`,
    `- Status: ${normalized.status}`,
    '- Published: true',
    '- Performance Reviewed: true',
    '- Human Approved: true',
    '',
    '### Metrics',
    '',
    ...METRIC_KEYS.map((key) => `- ${key}: ${formatMetric(normalized.metrics[key])}`),
    '',
    '### Editor Review',
    '',
    normalized.editorReview,
    '',
    '### Summary',
    '',
    normalized.summary,
    '',
  ].join('\n');
}

async function appendValidationEvent(event, destination = validationEventsPath) {
  const normalized = normalizeValidationEvent(event);
  const existing = await fs.readFile(destination, 'utf8');
  if (existing.includes(`## Validation Event #${normalized.eventId}\n`)
    || existing.includes(`## Validation Event #${normalized.eventId}\r\n`)) {
    throw new Error(`Validation Event #${normalized.eventId} already exists.`);
  }
  const entry = formatValidationEvent(normalized);
  await fs.appendFile(destination, entry, 'utf8');
  return normalized;
}

function normalizeEvidenceReferences(references) {
  if (!Array.isArray(references) || references.length === 0) {
    throw new Error('At least one Validation Event reference is required.');
  }
  return [...new Set(references.map(normalizeEventId))];
}

function normalizeValidatedEvidenceReferences(events) {
  if (!Array.isArray(events) || events.length === 0) {
    throw new Error('At least one validated Validation Event is required.');
  }
  const normalizedEvents = events.map(normalizeValidationEvent);
  if (normalizedEvents.some(({ status }) => status !== 'validated')) {
    throw new Error('Rejected Validation Events cannot support reusable knowledge.');
  }
  return normalizeEvidenceReferences(normalizedEvents.map(({ eventId }) => eventId));
}

function validateEvidenceEntry({ rule, validationEvents, conclusion }) {
  return {
    rule: requireText(rule, 'Rule'),
    validationEvents: normalizeValidatedEvidenceReferences(validationEvents),
    conclusion: requireText(conclusion, 'Conclusion'),
  };
}

function validateEditorialRule({
  rule,
  reason,
  validationEvents,
  since,
  version,
  humanApproved,
}) {
  if (humanApproved !== true) {
    throw new Error('Only a human editor may approve an Editorial Rule.');
  }
  return {
    rule: requireText(rule, 'Rule'),
    reason: requireText(reason, 'Reason'),
    evidenceReferences: normalizeValidatedEvidenceReferences(validationEvents),
    since: normalizeDate(since),
    version: requireText(version, 'Version'),
    humanApproved: true,
  };
}

function validateProvenPattern({
  pattern,
  status,
  validatedCount,
  appliesTo,
  validationEvents,
}) {
  if (status !== 'validated') {
    throw new Error('Proven Patterns may contain only validated patterns.');
  }
  if (!Number.isInteger(validatedCount) || validatedCount < 1) {
    throw new Error('Validated Count must be a positive integer.');
  }
  const references = normalizeValidatedEvidenceReferences(validationEvents);
  if (validatedCount > references.length) {
    throw new Error('Validated Count cannot exceed the number of Evidence References.');
  }
  return {
    pattern: requireText(pattern, 'Pattern'),
    status,
    validatedCount,
    appliesTo: requireText(appliesTo, 'Applies To'),
    evidenceReferences: references,
  };
}

function createPendingValidation() {
  return {
    status: 'pending',
    eventId: null,
    validatedAt: null,
  };
}

module.exports = {
  METRIC_KEYS,
  VALIDATION_STATUSES,
  appendValidationEvent,
  createPendingValidation,
  formatValidationEvent,
  normalizeValidationEvent,
  normalizeValidatedEvidenceReferences,
  validateEditorialRule,
  validateEvidenceEntry,
  validateProvenPattern,
};
