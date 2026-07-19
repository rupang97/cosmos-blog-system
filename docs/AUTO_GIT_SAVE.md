# COSMOS Auto Git Save

This local harness watches the project and creates one Git commit after five
seconds without a new file change. It excludes `.git`, `node_modules`, and
`logs` from watch events. Git ignores remain respected, so `.env` is never
staged.

Start it in a dedicated VS Code terminal:

```powershell
node scripts/auto_git_save.js
```

Keep that terminal running while you work. Stop the harness with `Ctrl+C`.

To save currently pending changes once and exit:

```powershell
node scripts/auto_git_save.js --once
```

The harness creates local commits only. Push remains a separate deliberate
action.
