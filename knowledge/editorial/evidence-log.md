# Editorial Evidence Log

검증 이벤트에서 편집 결론으로 이어지는 근거 사슬을 기록합니다.
모든 항목은 하나 이상의 Validation Event를 참조해야 합니다. 근거가 없으면 규칙을 만들 수 없습니다.

## Contract

```markdown
## Evidence #<evidence-id>

### Rule

<candidate rule supported by evidence>

### Evidence

Validation Events:

- #<event-id>

### Conclusion

<promote, retain, or reject with reason>
```

`No evidence → No rule.`
