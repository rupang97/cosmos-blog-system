# Editorial Rules

실제 검증 근거를 바탕으로 사람이 승인한 편집 규칙만 저장합니다.
AI는 규칙을 생성하거나 승인하거나 자동 추가할 수 없습니다.
모든 규칙은 하나 이상의 Validation Event를 참조해야 합니다.

## Rule Contract

```markdown
## Rule #<rule-id>

### Rule

<human-approved rule>

### Reason

<reason grounded in evidence>

### Evidence Reference

- Validation Event #<event-id>

### Since

<date>

### Version

<version>
```

`No evidence → No rule.` 기존 규칙을 덮어쓰지 말고 변경은 새 버전의 규칙 항목으로 추가합니다.
