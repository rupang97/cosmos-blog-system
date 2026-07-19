# COSMOS Writer Assistant

Run a guided, clipboard-based publishing session:

```powershell
node scripts/writer_assistant.js living-info "에어컨 곰팡이 냄새"
```

The assistant copies each prompt in sequence and saves timestamped events and
prompt files under `logs/sessions/`. Session logs are intentionally local-only.

## Image Generation MVP

Set `OPENAI_API_KEY` only for the current PowerShell session, then run:

```powershell
$env:OPENAI_API_KEY = "your_api_key"
node scripts/generate_images.js output/living-info-020.md
```

Generated assets are saved under `images/<article-name>/` with a manifest. They
start in `pending_review` status and must be approved before publishing.
