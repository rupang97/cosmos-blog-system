# SEO Package Task

Purpose: Define the prompt contract for a complete, trustworthy SEO package.

- Article title: `{{TITLE}}`
- Use the supplied series context and keyword knowledge as editorial guidance.
- Keep every recommendation relevant to the article title and avoid invented
  search-volume data, ranking promises, or unsupported claims.
- Treat the Approved Article Brief as the source of truth: use its Primary Keyword
  and Supporting Long-tail Keywords first. Do not independently reselect a
  Primary Keyword from the title. Prefer natural wording and the article's real
  answerable scope over keyword repetition.

## Required Output

Provide the following clearly labeled sections in Korean:

1. **Original title**: Repeat the supplied article title exactly.
2. **SEO title variations**: Provide exactly three distinct, accurate title
   variations. Preserve the topic and avoid clickbait.
3. **Related search keywords**: Provide 8–10 relevant Korean search keywords.
4. **Primary keyword and supporting long-tail keywords**: Repeat the approved
   Primary Keyword and its 3–5 Supporting Long-tail Keywords. If a brief field
   is unavailable, state that it is unavailable rather than inventing one.
5. **Blog tags**: Provide exactly ten concise, non-duplicative blog tags.
6. **Search intent analysis**: State the likely primary search intent and any
   relevant secondary intent, with a short rationale grounded in the title.
7. **Meta description**: Write one clear Korean meta description that accurately
   describes the article without making unsupported promises.
