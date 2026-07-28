const PLANNING_CRITERIA = [
  { key: 'targetReader', label: 'Target Reader', maximum: 100 },
  { key: 'searchIntent', label: 'Search Intent', maximum: 100 },
  { key: 'readerValue', label: 'Reader Value', maximum: 100 },
  { key: 'originality', label: 'Originality', maximum: 100 },
  { key: 'brandFit', label: 'Brand Fit', maximum: 100 },
  { key: 'risk', label: 'Risk', maximum: 100 },
  { key: 'keywordQuality', label: 'Keyword Quality', maximum: 20, minimum: 15 },
];

const MINIMUM_PLANNING_SCORE = 85;
const TITLE_STRATEGIES = [
  'Search-first',
  'Curiosity-first',
  'Checklist',
  'Living Information',
  'Trend / Seasonal',
];
const CONTENT_DECISIONS = ['create_new', 'update_existing', 'merge_existing', 'stop', 'research_needed'];
const STRATEGY_EVIDENCE_FIELDS = [
  'Search Demand', 'Search Intent', 'SERP Competition', 'Channel', 'Observed At', 'Source',
  'Existing Articles', 'Existing Performance', 'Topic Overlap', 'Cannibalization Risk', 'Internal Link Opportunities',
  'Series Goal', 'Brand Goal', 'Business Goal', 'Expected Contribution',
  'Reader Already Knows', 'Reader Actually Wants', 'Understanding Gap', 'Existing Knowledge Assets', 'Missing Knowledge',
];

function extractEditorialDecision(brief) {
  if (typeof brief !== 'string' || !brief.trim()) {
    throw new Error('An Approved Decision Brief is required.');
  }
  for (const heading of ['Strategy Evidence Review', 'Search Evidence', 'Content Evidence', 'Project and Business Evidence', 'Knowledge Coverage Evidence', 'Evidence Gaps', 'Editorial Decision Recommendation']) {
    if (!new RegExp(`^#{heading === 'Strategy Evidence Review' || heading === 'Editorial Decision Recommendation' ? 2 : 3} ${heading}\\s*$`, 'm').test(brief)) {
      throw new Error(`Approved Decision Brief is missing ${heading}.`);
    }
  }
  for (const field of STRATEGY_EVIDENCE_FIELDS) {
    if (!new RegExp(`^- ${field}:[ \\t]*(.+?)[ \\t]*$`, 'm').test(brief)) {
      throw new Error(`Strategy Evidence Review is missing ${field}.`);
    }
  }
  const gapsStart = brief.search(/^### Evidence Gaps\s*$/m);
  const gapsAfterHeading = brief.slice(brief.indexOf('\n', gapsStart) + 1);
  const gapsEnd = gapsAfterHeading.search(/^#{1,3} /m);
  const evidenceGaps = gapsEnd === -1 ? gapsAfterHeading : gapsAfterHeading.slice(0, gapsEnd);
  if (!/^-[ \t]+.+$/m.test(evidenceGaps)) {
    throw new Error('Strategy Evidence Review is missing Evidence Gaps.');
  }
  const readField = (field) => {
    const match = brief.match(new RegExp(`^- ${field}:[ \\t]*(.+?)[ \\t]*$`, 'm'));
    return match ? match[1].trim() : '';
  };
  const evidenceStatus = readField('Evidence Status');
  const recommendedAction = readField('Recommended Action');
  if (!['sufficient', 'insufficient'].includes(evidenceStatus)) {
    throw new Error('Evidence Status must be sufficient or insufficient.');
  }
  if (!CONTENT_DECISIONS.includes(recommendedAction)) {
    throw new Error('Recommended Action is invalid.');
  }
  if ((recommendedAction === 'research_needed' && evidenceStatus === 'sufficient')
    || (recommendedAction === 'create_new' && evidenceStatus === 'insufficient')) {
    throw new Error('Evidence Status conflicts with Recommended Action.');
  }
  return { evidenceStatus, recommendedAction };
}

function assertHumanDecision(humanDecision) {
  if (!CONTENT_DECISIONS.includes(humanDecision)) {
    throw new Error('Human Decision is invalid.');
  }
  return humanDecision;
}

function createPendingPlanning() {
  return {
    status: 'pending_review',
    score: null,
    approved: false,
    brief: null,
    improvementSuggestions: [],
  };
}

function normalizePlanningScores(scores) {
  if (!Array.isArray(scores)) {
    throw new Error('Planning evaluation must include all planning criteria.');
  }

  const byKey = new Map(scores.map((item) => [item.key, item]));
  return PLANNING_CRITERIA.map(({ key, label, maximum }) => {
    const item = byKey.get(key);
    if (!item || !Number.isInteger(item.score) || item.score < 0 || item.score > maximum
      || typeof item.reason !== 'string' || !item.reason.trim()) {
      throw new Error(`Planning evaluation is missing a complete score for ${key}.`);
    }
    return { key, label, score: item.score, maximum, reason: item.reason.trim() };
  });
}

function normalizeSuggestions(suggestions) {
  if (!Array.isArray(suggestions)
    || suggestions.some((suggestion) => typeof suggestion !== 'string' || !suggestion.trim())) {
    throw new Error('Planning improvement suggestions must be non-empty strings.');
  }
  return [...new Set(suggestions.map((suggestion) => suggestion.trim()))];
}

/**
 * Records a planner self-review. A plan below the required score can never be
 * approved and must carry concrete improvement suggestions.
 */
function evaluatePlanning({ scores, improvementSuggestions = [] }) {
  const normalizedScores = normalizePlanningScores(scores);
  const score = Math.round(
    normalizedScores.reduce((total, item) => total + (item.score / item.maximum) * 100, 0)
      / normalizedScores.length,
  );
  const normalizedSuggestions = normalizeSuggestions(improvementSuggestions);
  const keywordQuality = normalizedScores.find(({ key }) => key === 'keywordQuality');
  const needsImprovement = score < MINIMUM_PLANNING_SCORE || keywordQuality.score < 15;

  if (needsImprovement && normalizedSuggestions.length === 0) {
    throw new Error('Plans below 85 or Keyword Quality below 15 require Planning Improvement Suggestions.');
  }

  return {
    status: needsImprovement ? 'needs_improvement' : 'approved',
    score,
    approved: !needsImprovement,
    scores: normalizedScores,
    improvementSuggestions: normalizedSuggestions,
  };
}

function assertApprovedPlan({ brief, planning }) {
  if (typeof brief !== 'string' || !brief.trim()) {
    throw new Error('An Article Brief is required before writing.');
  }
  if (!planning || planning.approved !== true || !Number.isInteger(planning.score)
    || planning.score < MINIMUM_PLANNING_SCORE) {
    throw new Error(`Writing requires an approved Article Brief with a Planning Score of ${MINIMUM_PLANNING_SCORE} or higher.`);
  }
  if ((planning.humanDecision ?? planning.contentDecision?.humanDecision) !== 'create_new') {
    throw new Error('Writing requires Human Decision create_new.');
  }
  const keywordQuality = extractKeywordQuality(brief);
  if (keywordQuality === null || keywordQuality < 15) {
    throw new Error('Writing requires Keyword Quality of 15 / 20 or higher.');
  }
  extractKeywordPlan(brief);
}

function extractPlanningScore(brief) {
  if (typeof brief !== 'string' || !brief.trim()) {
    throw new Error('An Article Brief is required to read the Planning Score.');
  }

  const match = brief.match(/^## Planning Score\s*\r?\n\s*(\d{1,3})\b/m);
  if (!match) {
    throw new Error('The Article Brief must include an integer Planning Score.');
  }

  const score = Number(match[1]);
  if (score < 0 || score > 100) {
    throw new Error('The Article Brief Planning Score must be between 0 and 100.');
  }
  return score;
}

function extractKeywordQuality(brief) {
  if (typeof brief !== 'string' || !brief.trim()) {
    throw new Error('An Article Brief is required to read Keyword Quality.');
  }

  const match = brief.match(/^- Keyword Quality:\s*(\d{1,2})\s*\/\s*20\b/m);
  if (!match) return null;

  const score = Number(match[1]);
  if (score < 0 || score > 20) {
    throw new Error('Article Brief Keyword Quality must be between 0 and 20.');
  }
  return score;
}

function extractKeywordPlan(brief) {
  const extractSection = (heading) => {
    const sectionStart = brief.search(new RegExp(`^### ${heading}[ \\t]*$`, 'm'));
    if (sectionStart === -1) {
      throw new Error(`The Article Brief must include a ${heading} section.`);
    }
    const lineEnd = brief.indexOf('\n', sectionStart);
    const remainingBrief = brief.slice(lineEnd === -1 ? brief.length : lineEnd + 1);
    const nextSection = remainingBrief.search(/^#{1,3}[ \t]/m);
    return nextSection === -1 ? remainingBrief : remainingBrief.slice(0, nextSection);
  };
  const primaryKeyword = extractSection('Primary Keyword');
  const readField = (name) => {
    const match = primaryKeyword.match(new RegExp(`^- ${name}:[ \\t]*(.+?)[ \\t]*$`, 'm'));
    if (!match) {
      throw new Error(`Article Brief Primary Keyword is missing ${name}.`);
    }
    const value = match[1].trim();
    if (!value) {
      throw new Error(`Article Brief Primary Keyword is missing ${name}.`);
    }
    return value;
  };

  readField('Keyword');
  readField('Intent');
  if (readField('Evidence Status') !== 'verified') {
    throw new Error('Writing requires Primary Keyword Evidence Status of verified.');
  }
  readField('Evidence Source');
  readField('Observed At');
  const channelFit = readField('Channel Fit');
  if (!['naver', 'google', 'both'].includes(channelFit)) {
    throw new Error('Primary Keyword Channel Fit must be naver, google, or both.');
  }
  const lifecycle = readField('Lifecycle');
  if (!['evergreen', 'seasonal', 'event'].includes(lifecycle)) {
    throw new Error('Primary Keyword Lifecycle must be evergreen, seasonal, or event.');
  }

  const longTailKeywords = [...extractSection('Supporting Long-tail Keywords')
    .matchAll(/^-[ \t]*(.*?)[ \t]*$/gm)]
    .map((match) => match[1].trim());
  if (longTailKeywords.length < 3 || longTailKeywords.length > 5
    || longTailKeywords.some((keyword) => !keyword)) {
    throw new Error('Supporting Long-tail Keywords must contain exactly 3 to 5 non-empty items.');
  }

  return { channelFit, lifecycle, longTailKeywords };
}

function extractTitleCandidates(brief) {
  if (typeof brief !== 'string' || !brief.trim()) {
    throw new Error('An Article Brief is required to read title candidates.');
  }

  const sectionStart = brief.search(/^## Title Candidates\s*$/m);
  if (sectionStart === -1) {
    throw new Error('The Article Brief must include a Title Candidates section.');
  }
  const contentStart = brief.indexOf('\n', sectionStart) + 1;
  const remainingBrief = brief.slice(contentStart);
  const nextSection = remainingBrief.search(/^## (?!#)/m);
  const section = nextSection === -1
    ? remainingBrief
    : remainingBrief.slice(0, nextSection);

  const headings = [...section.matchAll(/^###\s+\d+\.\s+(.+?)\s*$/gm)];
  if (headings.length !== TITLE_STRATEGIES.length) {
    throw new Error('The Article Brief must include exactly 5 title candidates.');
  }

  const readField = (body, name) => {
    const match = body.match(new RegExp(`^- ${name}:\\s*(.+?)\\s*$`, 'mi'));
    return match ? match[1].trim() : '';
  };

  return headings.map((heading, index) => {
    const strategy = heading[1].trim();
    if (strategy !== TITLE_STRATEGIES[index]) {
      throw new Error(`Title candidate ${index + 1} must use the ${TITLE_STRATEGIES[index]} strategy.`);
    }

    const bodyStart = heading.index + heading[0].length;
    const bodyEnd = index + 1 < headings.length ? headings[index + 1].index : section.length;
    const body = section.slice(bodyStart, bodyEnd);
    const title = readField(body, 'Title');
    const keywords = readField(body, 'Related Search Keywords')
      .split(/\s*[,，|]\s*/)
      .filter(Boolean);
    const searchIntentMatch = Number(readField(body, 'Estimated Search Intent Match'));
    const estimatedCtr = Number(readField(body, 'Estimated CTR'));
    const brandFit = Number(readField(body, 'Brand Fit'));
    const reason = readField(body, 'Reason');
    const ratings = [searchIntentMatch, estimatedCtr, brandFit];

    if (!title || !reason || keywords.length < 2 || keywords.length > 3
      || ratings.some((rating) => !Number.isInteger(rating) || rating < 1 || rating > 5)) {
      throw new Error(`Title candidate ${index + 1} is incomplete or invalid.`);
    }

    return { strategy, title, relatedSearchKeywords: keywords, searchIntentMatch, estimatedCtr, brandFit, reason };
  });
}

function assertHumanSelectedTitle({ brief, selectedTitle }) {
  if (typeof selectedTitle !== 'string' || !selectedTitle.trim()) {
    throw new Error('A human editor must select the final title.');
  }
  const normalizedTitle = selectedTitle.trim();
  const candidates = extractTitleCandidates(brief);
  if (!candidates.some(({ title }) => title === normalizedTitle)) {
    throw new Error('The selected title must exactly match one of the 5 title candidates.');
  }
  return normalizedTitle;
}

function normalizeSelectionReason(selectionReason = '') {
  if (typeof selectionReason !== 'string') {
    throw new Error('Selection Reason must be text.');
  }

  const normalizedReason = selectionReason.trim();
  if (!normalizedReason) {
    return null;
  }
  if (/\r|\n/.test(normalizedReason)) {
    throw new Error('Selection Reason must be one sentence only.');
  }

  const sentenceEndings = normalizedReason.match(/[.!?。！？]+/g) ?? [];
  const reasonWithoutClosingMarks = normalizedReason.replace(/["'’”)}\]]+$/, '');
  if (sentenceEndings.length > 1
    || (sentenceEndings.length === 1 && !/[.!?。！？]$/.test(reasonWithoutClosingMarks))) {
    throw new Error('Selection Reason must be one sentence only.');
  }

  return normalizedReason;
}

function buildPlanningReviewPrompt({ instructions, brief }) {
  if (typeof brief !== 'string' || !brief.trim()) {
    throw new Error('An Article Brief is required for planning review.');
  }
  return `${instructions}\n\n# Article Brief To Review\n\n${brief}`;
}

module.exports = {
  CONTENT_DECISIONS,
  MINIMUM_PLANNING_SCORE,
  PLANNING_CRITERIA,
  TITLE_STRATEGIES,
  assertHumanSelectedTitle,
  assertApprovedPlan,
  assertHumanDecision,
  buildPlanningReviewPrompt,
  createPendingPlanning,
  evaluatePlanning,
  extractKeywordQuality,
  extractEditorialDecision,
  extractPlanningScore,
  extractTitleCandidates,
  normalizeSelectionReason,
};
