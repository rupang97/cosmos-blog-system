# Scripts

Automation and utility scripts that support COSMOS workflows.

`generate_article.js` starts with Planner. It saves an article-specific package
in `output/<series>-<number>/`, copies the planning prompt, and requires a path
to a completed Article Brief plus a Planning Score of at least 85 before it
creates any Writer prompt or article draft. The package contains:

- `article-plan.prompt.md`
- `article-brief.md`
- `article.prompt.md`
- `thumbnail.prompt.md`
- `infographic-01.prompt.md`
- `infographic-02.prompt.md`
- `tags.prompt.md`
- `seo.prompt.md`
- `seo-package.prompt.md`
- `publish.md` (the ordered convenience bundle)

`writer_assistant.js` accepts the same approved Article Brief and Planning Score
before it copies Writer prompts to the clipboard. This keeps the guided session
behind the same Planning Gate as `generate_article.js`.

The manifest includes `planning.score`, `planning.approved`, and
`planning.brief`. The Quality review prompt receives the same Article Brief and
must evaluate promise, questions, and target-reader alignment.

Planning starts from a topic and must store exactly five strategy-specific title
candidates in `article-brief.md`. After planning, a human editor selects one of
those candidates. Only that human-selected title is passed to Writer and stored
as the manifest's top-level `title`; the system never selects a title automatically.
The editor may also enter a one-sentence Selection Reason. It is stored at
`planning.selectionReason`. Every decision appends all five candidates to
`knowledge/editorial/title-decisions.md` without overwriting earlier decisions;
the chosen candidate is marked `selected` and the other four are marked `rejected`.
These records start as `hypothesis`, `Published: false`, and
`Performance Reviewed: false`. They are audit records, not ranking data. Only a
future append-only validation event based on reviewed real publishing
performance may make a decision eligible for automatic ranking.

Prompt types are configured in `lib/promptBuilder.js`. Adding a type requires a
task contract in `prompts/tasks` and one entry in the prompt-type list.

`validate_editorial_evidence.js` checks the Sprint 12 evidence contracts,
including the Planner knowledge allowlist, pending manifest validation state,
required metrics, and forbidden draft/rejected-evidence promotions:

```powershell
node scripts/validate_editorial_evidence.js
```
