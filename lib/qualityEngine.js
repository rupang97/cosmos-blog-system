const QUALITY_RUBRIC = [
  { key: 'searchIntent', label: 'Search Intent', maximum: 10 },
  { key: 'keywordPsychology', label: 'Keyword Psychology', maximum: 10 },
  { key: 'titleQuality', label: 'Title Quality', maximum: 10 },
  { key: 'introduction', label: 'Introduction', maximum: 10 },
  { key: 'explanation', label: 'Explanation', maximum: 10 },
  { key: 'logicalStructure', label: 'Logical Structure', maximum: 5 },
  { key: 'factAccuracy', label: 'Fact Accuracy', maximum: 15 },
  { key: 'humanTexture', label: 'Human Texture', maximum: 10 },
  { key: 'seo', label: 'SEO', maximum: 5 },
  { key: 'readability', label: 'Readability', maximum: 5 },
  { key: 'readerNextAction', label: 'Reader Next Action', maximum: 5 },
  { key: 'brandVoice', label: 'Brand Voice', maximum: 5 },
];

const FAIL_GATES = [
  { key: 'factAccuracy', label: 'Fact Accuracy' },
  { key: 'searchIntent', label: 'Search Intent' },
  { key: 'claims', label: 'Claims' },
  { key: 'projectRules', label: 'PROJECT_RULES' },
  { key: 'requiredSections', label: 'Required Sections' },
];

const QUALITY_LEVELS = [
  { minimum: 90, key: 'publish_ready' },
  { minimum: 85, key: 'minor_revision' },
  { minimum: 80, key: 'rewrite_sections' },
  { minimum: 0, key: 'major_revision' },
];

const KNOWLEDGE_RULES = [
  {
    terms: ['keyword psychology', 'action intent', 'high intent', 'keyword quality'],
    library: 'knowledge/editorial/keyword-psychology.md',
    reason: 'Action Intent, problem solving, and CTR fit should be improved without relying on search volume alone.',
  },
  {
    terms: ['human texture', 'scene', 'sensory', 'specificity', 'example'],
    library: 'knowledge/editorial/human-texture-rules.md',
    reason: 'Human Texture elements should be improved with recommendations only, without rewriting or inventing facts.',
  },
  {
    terms: ['explanation', '설명'],
    fileName: 'analogy-library.md',
    reason: '설명을 독자가 공감할 수 있는 일상 비유로 보완하는 데 도움이 됩니다.',
  },
  {
    terms: ['introduction', 'structure', '구조', '도입'],
    fileName: 'article-patterns.md',
    reason: '선호하는 시리즈 흐름에 맞춰 섹션 순서와 연결을 보완하는 데 도움이 됩니다.',
  },
  {
    terms: ['title', 'search intent', '제목', '검색 의도'],
    fileName: 'title-patterns.md',
    reason: '검색 의도와 본문의 실제 해결 범위를 정확히 연결하는 데 도움이 됩니다.',
  },
  {
    terms: ['faq'],
    fileName: 'faq-patterns.md',
    reason: '독자가 실제로 궁금해할 질문과 답변의 구성을 보완하는 데 도움이 됩니다.',
  },
  {
    terms: ['seo', 'keyword', '키워드'],
    fileName: 'keyword-patterns.md',
    reason: '키워드를 과도하게 반복하지 않고 자연스럽게 반영하는 데 도움이 됩니다.',
  },
];

function createPendingQuality() {
  return {
    status: 'pending_review',
    score: null,
    level: null,
    confidence: null,
    rewriteSections: [],
    knowledgeSuggestions: [],
  };
}

function getQualityLevel(score) {
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new Error('Quality score must be an integer from 0 to 100.');
  }

  return QUALITY_LEVELS.find(({ minimum }) => score >= minimum).key;
}

function normalizeFailGates(gates) {
  if (!Array.isArray(gates)) {
    throw new Error('Quality evaluation must include all Fail Gates.');
  }

  const byKey = new Map(gates.map((gate) => [gate.key, gate]));
  return FAIL_GATES.map(({ key, label }) => {
    const gate = byKey.get(key);
    if (!gate || typeof gate.passed !== 'boolean' || typeof gate.reason !== 'string' || !gate.reason.trim()) {
      throw new Error(`Quality evaluation is missing a complete Fail Gate: ${key}.`);
    }

    return { key, label, passed: gate.passed, reason: gate.reason.trim() };
  });
}

function normalizeScores(scores) {
  if (!Array.isArray(scores)) {
    throw new Error('A passing quality evaluation must include rubric scores.');
  }

  const byKey = new Map(scores.map((score) => [score.key, score]));
  return QUALITY_RUBRIC.map(({ key, label, maximum }) => {
    const item = byKey.get(key);
    if (!item || !Number.isInteger(item.score) || typeof item.reason !== 'string' || !item.reason.trim()) {
      throw new Error(`Quality evaluation is missing a complete rubric score: ${key}.`);
    }
    if (item.score < 0 || item.score > maximum) {
      throw new Error(`Quality score for ${key} must be between 0 and ${maximum}.`);
    }

    return { key, label, score: item.score, maximum, reason: item.reason.trim() };
  });
}

function normalizeRewriteSections(sections) {
  if (!Array.isArray(sections) || sections.some((section) => typeof section !== 'string' || !section.trim())) {
    throw new Error('Rewrite sections must be an array of non-empty section names.');
  }

  return [...new Set(sections.map((section) => section.trim()))];
}

function normalizeKnowledgeSuggestions(suggestions) {
  if (!Array.isArray(suggestions)) {
    throw new Error('Knowledge suggestions must be an array.');
  }

  return suggestions.map(({ library, reason }) => {
    if (typeof library !== 'string' || !library.startsWith('knowledge/') || typeof reason !== 'string' || !reason.trim()) {
      throw new Error('Each Knowledge suggestion requires a knowledge library path and reason.');
    }
    return { library, reason: reason.trim() };
  });
}

function suggestKnowledge(series, rewriteSections) {
  if (typeof series !== 'string' || !series.trim()) {
    throw new Error('A series is required to suggest Knowledge libraries.');
  }

  const normalized = rewriteSections.map((section) => section.toLowerCase());
  const suggestions = KNOWLEDGE_RULES.filter(({ terms }) =>
    terms.some((term) => normalized.some((section) => section.includes(term))),
  ).map(({ fileName, library, reason }) => ({
    library: library ?? `knowledge/${series}/${fileName}`,
    reason,
  }));

  if (suggestions.length || rewriteSections.length === 0) {
    return suggestions;
  }

  return [{
    library: `knowledge/${series}/article-patterns.md`,
    reason: '약한 섹션의 구성과 설명 순서를 다시 설계하는 데 도움이 됩니다.',
  }];
}

function normalizeSummary(summary) {
  if (!Array.isArray(summary) || summary.length !== 3 || summary.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error('Quality evaluation summary must contain exactly three non-empty bullets.');
  }
  return summary.map((item) => item.trim());
}

/**
 * Normalizes an AI or human evaluation. It never rewrites article content.
 */
function evaluateQuality({
  series,
  failGates,
  scores,
  rewriteSections = [],
  knowledgeSuggestions,
  confidence,
  summary,
}) {
  const normalizedGates = normalizeFailGates(failGates);
  const normalizedSections = normalizeRewriteSections(rewriteSections);
  const normalizedSummary = normalizeSummary(summary);
  const failedGates = normalizedGates.filter(({ passed }) => !passed);
  const suggestedKnowledge = knowledgeSuggestions === undefined
    ? suggestKnowledge(series, normalizedSections)
    : normalizeKnowledgeSuggestions(knowledgeSuggestions);

  if (failedGates.length > 0) {
    return {
      status: 'fail',
      failGates: normalizedGates,
      score: null,
      level: null,
      confidence: null,
      rewriteSections: normalizedSections,
      knowledgeSuggestions: suggestedKnowledge,
      summary: normalizedSummary,
    };
  }

  if (!Number.isInteger(confidence) || confidence < 0 || confidence > 100) {
    throw new Error('A passing quality evaluation requires confidence from 0 to 100.');
  }

  const normalizedScores = normalizeScores(scores);
  const score = normalizedScores.reduce((total, item) => total + item.score, 0);
  const humanTextureScore = normalizedScores.find(({ key }) => key === 'humanTexture').score;
  return {
    status: 'pass',
    failGates: normalizedGates,
    scores: normalizedScores,
    score,
    level: getQualityLevel(score),
    confidence,
    rewriteSections: normalizedSections,
    knowledgeSuggestions: suggestedKnowledge,
    humanTextureWarning: humanTextureScore < 6,
    humanReviewRecommended: confidence < 85,
    summary: normalizedSummary,
  };
}

function renderKnowledgeSuggestions(suggestions) {
  return suggestions.length
    ? suggestions.map(({ library, reason }) => `- \`${library}\` — ${reason}`).join('\n')
    : 'Not required.';
}

function renderQualityReport(quality) {
  if (quality.status === 'pending_review') {
    return '# Quality Report\n\n## Status\n\n`pending_review`\n\nAI evaluation is required before publication.';
  }

  const gates = quality.failGates
    .map(({ label, passed, reason }) => `- ${label}: \`${passed ? 'pass' : 'fail'}\` — ${reason}`)
    .join('\n');
  const rewritePlan = quality.rewriteSections.length
    ? quality.rewriteSections.map((section) => `- ${section}`).join('\n')
    : 'Not required.';
  const report = [
    '# Quality Report',
    '',
    '## Status',
    '',
    `\`${quality.status}\``,
    '',
    '## Fail Gates',
    '',
    gates,
    '',
  ];

  if (quality.status === 'fail') {
    report.push(
      '## Rewrite Plan', '', rewritePlan, '',
      '## Knowledge Suggestions', '', renderKnowledgeSuggestions(quality.knowledgeSuggestions), '',
      '## Summary', '', ...quality.summary.map((item) => `- ${item}`),
    );
    return report.join('\n');
  }

  report.push(
    '## Scores', '',
    ...quality.scores.flatMap(({ label, score, maximum, reason }) => [
      `### ${label}`, '', `${score} / ${maximum}`, '', `Reason: ${reason}`, '',
    ]),
    `### TOTAL\n\n${quality.score} / 100`, '',
    '## Quality Level', '', `\`${quality.level}\``, '',
    ...(quality.humanTextureWarning ? [
      '## Human Texture Warning', '',
      '- Human Texture score is below 6 / 10. Add verified scenes, concrete references, sensory details, or clearly marked examples without inventing facts.', '',
    ] : []),
    '## Rewrite Plan', '', rewritePlan, '',
    '## Knowledge Suggestions', '', renderKnowledgeSuggestions(quality.knowledgeSuggestions), '',
    '## Confidence', '', String(quality.confidence),
    quality.humanReviewRecommended ? '\nHuman review recommended.' : '', '',
    '## Summary', '', ...quality.summary.map((item) => `- ${item}`),
  );
  return report.join('\n');
}

function buildQualityReviewPrompt({ instructions, rubric, articleBrief, article }) {
  if (typeof articleBrief !== 'string' || !articleBrief.trim()) {
    throw new Error('Quality review requires the completed Article Brief.');
  }
  return `${instructions}\n\n${rubric}\n\n# Article Brief\n\n${articleBrief}\n\n# Article To Evaluate\n\n${article}`;
}

module.exports = {
  FAIL_GATES,
  QUALITY_RUBRIC,
  buildQualityReviewPrompt,
  createPendingQuality,
  evaluateQuality,
  getQualityLevel,
  renderQualityReport,
  suggestKnowledge,
};
