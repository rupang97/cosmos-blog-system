# Proven Patterns

사람이 승인한 규칙을 거쳐 승격된 검증 패턴만 저장합니다.
가설, 초안, 거절된 결정, 검토되지 않은 성과는 이 파일에 저장하지 않습니다.

## Pattern Contract

```markdown
## Pattern #<pattern-id>

- Pattern: <pattern>
- Status: validated
- Validated Count: <positive integer>
- Applies To: <scope>
- Evidence References: #<validation-event-id>
```

`Status`는 반드시 `validated`여야 하며 모든 Evidence Reference는 실제 Validation Event를 가리켜야 합니다.
