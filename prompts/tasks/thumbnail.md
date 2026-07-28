# COSMOS CTR Engine: Thumbnail Task

Purpose: Create a trustworthy, click-oriented thumbnail package from the
article title and supplied shared knowledge. Write the package in Korean, with
no introduction, rationale outside the required sections, or extra sections.

## Required Process

1. Read `Click Psychology`, `Thumbnail Patterns`, `Thumbnail Hook Library`,
   and `Thumbnail Policy` before choosing any thumbnail text.
2. Complete the analysis sections first.
3. Reuse the most relevant pattern or hook before inventing a new one. Adapt it
   only as needed for the article topic and factual limits.
4. Apply the policy to every text option. Reject and replace text that violates
   the policy before returning the package.
5. Treat thumbnail creation as a two-stage workflow. First present balanced
   text options and wait for a human selection. Only after the user selects an
   exact option may you write the final image-generation prompt.

## Stage 1: Text Selection Package

Use these headings exactly, in this order:

## Reader Psychology Analysis

Describe the reader's likely situation, question, and desired outcome in 2–3
sentences. Infer only from the title and supplied context; state uncertainty
instead of inventing reader facts.

## Primary Search Intent

Name one intent: information, comparison, problem solving, or decision support.
Explain the fit in one sentence.

## Curiosity Trigger

Identify one truthful knowledge gap, misconception, trade-off, or overlooked
step that the article can resolve. Do not manufacture urgency or fear.

## Thumbnail Strategy

Explain which reusable patterns or hooks fit the article and how the options
will balance clarity, curiosity, and trust in 2–3 sentences. Do not choose a
winning strategy or final text.

Use one supported hook type: question, common mistake, reversal, loss, or
checklist. Do not use information-delivery framing by itself. The hook must
match the article's Action Intent and never claim unsupported results.

## Information-first Options

Provide exactly three short Korean text options that communicate the topic or
practical value immediately. Each option must be 2–6 Korean words,
understandable at small size, truthful, and policy-compliant.

## Home-feed Curiosity Options

Provide exactly three short Korean text options designed for a portal home-feed
context. Use a supported question, knowledge gap, overlooked step, or gentle
contrast that makes the reader curious about the article's answer. Each option
must still reveal the topic, use 2–6 Korean words, remain understandable at
small size, and avoid vague bait such as `이것`, unsupported urgency, fear, or
promised outcomes.

Across the three options, use the supported question, common mistake,
reversal, loss, or checklist hook types where they fit the article.

## Human Selection Gate

Write exactly: `최종 문구는 사람이 선택합니다. 선택 전에는 이미지 프롬프트를 작성하지 않습니다.`

Do not include `Image Prompt`, `Recommended Option`, layout, colors, highlight
words, or image-generation instructions in Stage 1. Do not select, rank, merge,
or rewrite an option on the user's behalf.

## Stage 2: Final Prompt After Human Selection

Enter Stage 2 only when the user supplies one exact option from Stage 1. Use
these headings exactly, in this order:

## Selected Thumbnail Text

Repeat the human-selected option verbatim. Do not combine or rewrite it.

## Image Prompt

Write one image-generation prompt. Describe the visual subject, composition,
lighting, style, and a clear text placement area. Include the selected thumbnail
text in quotation marks and instruct the generator to render it verbatim inside
the image in large, high-contrast Korean typography. Do not add, omit,
translate, or alter any text. Do not make visual claims that the article cannot
support. A text-free image, separate text overlay, or fallback without the
required text is not allowed.

## Layout Recommendation

Specify the text position, visual focal point, hierarchy, and required empty
space in 2–4 concise sentences.

## Highlight Words

List 1–2 exact Korean words from the selected option to emphasize. Use
`없음` only when emphasis would harm clarity.

## Color Recommendation

Recommend a compact palette: one base color, one accent color, and one text
color. State the intended contrast or mood in one sentence.

## Self Evaluation

Briefly verify that the selected option is specific, readable, supported by
the article, and compliant with `Thumbnail Policy`.

### Thumbnail Score

- CTR Score (0-100): Likelihood that clear, relevant curiosity earns a click.
- Trust Score (0-100): Accuracy, clarity, and absence of deceptive framing.
- Curiosity Score (0-100): Strength of the supported knowledge gap.
- Overstatement Risk (0-100): Risk of unsupported, absolute, or excessive
  clickbait; lower is better.

Give all four scores as integers and add one concise sentence explaining the
main trade-off. A high CTR score never justifies a low trust score or high
overstatement risk.
