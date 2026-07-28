# COSMOS Writer Assistant

Run a guided, clipboard-based publishing session after the Article Brief has
received a Planning Score of at least 85:

```powershell
node scripts/writer_assistant.js living-info "사람이 선택한 후보 제목" output/article-brief.md 85
```

The assistant copies each Writer prompt in sequence and saves the approved
brief, timestamped events, and prompt files under `logs/sessions/`. Session
logs are intentionally local-only. The supplied score must exactly match the
integer recorded in the brief's `## Planning Score` section.
The title argument must exactly match one of the five candidates in the brief's
`## Title Candidates` section. The assistant validates the human selection and
never chooses a title automatically.

## Image Generation MVP

Set `OPENAI_API_KEY` only for the current PowerShell session, then run:

```powershell
$env:OPENAI_API_KEY = "your_api_key"
node scripts/generate_images.js output/living-info-019.md
```

Generated assets are saved under `images/<article-name>/` with a manifest. They
start in `pending_review` status and must be approved before publishing.
