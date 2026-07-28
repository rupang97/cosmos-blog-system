# Article Task

Purpose: Define the prompt contract for article generation.

- Topic: `{{TOPIC}}`
- Audience: `{{AUDIENCE}}`
- Required outcome: Draft a clear, trustworthy article.

## Planning Gate

- The completed `# Approved Article Brief` is the authoritative editorial contract.
- Use its Target Reader, search intents, questions, promise, tone, pattern, analogy, CTA, risks, and fact-check notes throughout the draft.
- Use its Human Texture Guidance as recommendations only, not as facts.
- Do not infer or replace reader intent independently. If the Brief is incomplete or conflicts with verified facts, stop and flag the issue for planner/editor review.

## Evidence-Backed Explanation

- In each major explanatory section where relevant, develop the idea in this order: claim → reason → principle → verified concrete fact or real-world case → exception or limitation → practical application.
- Connect these elements as natural prose. Do not expose the labels as repetitive headings.
- Concrete facts must include the relevant subject, condition, date, unit, or scope and a verifiable source.
- Real-world cases must come from a verifiable source, identify their context, and not be generalized beyond the evidence.
- If no verified case exists, omit it or use a clearly marked illustrative example. Never invent a case.
- End with safe, specific steps the target reader can apply under the stated conditions.
- Do not generate first-person anecdotes or personal experience.

## Human Texture Rules

- Prefer concrete expressions over vague ones.
- Include at least 3 scenes.
- Include at least 5 measurable numbers or concrete references.
- Include at least 5 sensory expressions.
- Do not fabricate facts.
- Mark illustrative examples explicitly.

## FAQ Format

- Write the entire result in Markdown.
- Preserve the designated template's section order and headings exactly.
- Include the FAQ under the exact heading `## 자주 묻는 질문`.
- Write at least three FAQ items as clear question-and-answer pairs.
- Every question must start with `Q:` and every answer must start with `A:`.
- Use exactly this format, with one blank line between each question and answer
  and one blank line between FAQ items:

  Q: 질문 내용

  A: 답변 내용
- Do not use `### 질문`, `질문:`, `답변:`, `Q :`, or `A :` in the FAQ.
- Keep each answer practical, accurate, and directly responsive to its question.
- Before output, validate that `## 자주 묻는 질문` exists, every question and
  answer starts exactly with `Q:` and `A:`, no `###` FAQ question remains, no
  `Q :` or `A :` form remains, and every question has exactly one answer.
- If validation fails, revise and validate again without outputting the invalid result.

## Keyword Library Policy

- Consult `knowledge/<series>/keyword-library.yaml` before choosing SEO
  keywords, tags, or keyword-based headings.
- Prefer only keywords marked `verified` in the library.
- A `candidate` keyword may be proposed for human review, but must not be
  presented as a verified SEO asset or forced unnaturally into the article.
- If no verified keyword matches the topic, use natural reader language and
  record proposed candidates separately for later validation.

## Related Articles

- Place a `## 함께 보면 좋은 상품` section before the related-articles section.
- Immediately below that heading, include this disclosure exactly: `이 글은 네이버 쇼핑 커넥트 활동의 일환으로, 상품 구매 시 일정액의 수수료를 받을 수 있습니다.`
- List only 1–2 product names that are directly relevant to the article's
  practical purpose. Do not include a product when it is not genuinely useful
  to the reader.
- Do not include prices, images, product descriptions, purchase links, or
  other affiliate disclosures. The publisher will search for the final
  product and insert the Naver Brand Connect product card before publishing.
- Do not invent product names or recommendations. Use only product names
  supplied or verified by the publisher; otherwise leave this section empty.
- Then include references.
- Select 2–3 genuinely relevant titles from `related-articles.md` when that
  library contains suitable articles.
- Do not invent URLs. If no verified URL is stored, list the title as plain
  text for the publisher to link on the blog platform.

## Final Draft Review

Before delivering the draft, review it once using this checklist.

- Confirm that every heading accurately describes the section immediately below it.
- Remove or qualify claims that are unsupported by a verified source.
- Confirm the product section contains only directly relevant product names and
  that the required Naver Shopping Connect disclosure appears immediately below
  its heading.
- Confirm related articles are relevant and that no URL has been invented.
- Open every reference link and remove any link that does not directly support
  the article or fails to load.
- Remove direct PDF and file-download links, including URLs ending in `.pdf`
  or containing `download.do`. Replace them with a verified, stable HTML
  landing page from the same source; if none exists, leave the source unlinked
  or omit it.
