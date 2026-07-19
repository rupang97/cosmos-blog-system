# Scripts

Automation and utility scripts that support COSMOS workflows.

`generate_article.js` creates the article draft and its manifest, then saves a
Publishing Package v1 in `output`:

- `article.prompt.md`
- `thumbnail.prompt.md`
- `infographic-01.prompt.md`
- `infographic-02.prompt.md`
- `tags.prompt.md`
- `seo.prompt.md`
- `seo-package.prompt.md`
- `publish.md` (the ordered convenience bundle)

Prompt types are configured in `lib/promptBuilder.js`. Adding a type requires a
task contract in `prompts/tasks` and one entry in the prompt-type list.
