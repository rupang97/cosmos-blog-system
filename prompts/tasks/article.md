# Article Task

Purpose: Define the prompt contract for article generation.

- Topic: `{{TOPIC}}`
- Audience: `{{AUDIENCE}}`
- Required outcome: Draft a clear, trustworthy article.

## FAQ Format

- Write the FAQ section as clear question-and-answer pairs.
- Use `Q: 질문` on one line and `A: 답변` on the next line.
- Keep each answer practical, accurate, and directly responsive to its question.

## Keyword Library Policy

- Consult `knowledge/<series>/keyword-library.yaml` before choosing SEO
  keywords, tags, or keyword-based headings.
- Prefer only keywords marked `verified` in the library.
- A `candidate` keyword may be proposed for human review, but must not be
  presented as a verified SEO asset or forced unnaturally into the article.
- If no verified keyword matches the topic, use natural reader language and
  record proposed candidates separately for later validation.

## Related Articles

- End every article with a `## 함께 읽으면 좋은 글` section before references.
- Select 2–3 genuinely relevant titles from `related-articles.md` when that
  library contains suitable articles.
- Do not invent URLs. If no verified URL is stored, list the title as plain
  text for the publisher to link on the blog platform.
