# Validation Events

실제 발행 성과를 사람이 검토한 결과만 기록하는 append-only 로그입니다.
기존 이벤트를 수정하거나 덮어쓰지 않습니다. 새 검토 결과는 새 이벤트로 추가합니다.

이벤트 상태는 `validated` 또는 `rejected`만 허용합니다. 두 상태 모두 실제 발행, 성과 검토, 사람 승인을 전제로 합니다. 지표를 아직 확보하지 못한 경우 값은 `null`일 수 있습니다.

## Record Contract

```markdown
## Validation Event #<event-id>

- Date: <date>
- Article: <article>
- Series: <series>
- Decision: <decision>
- Status: validated | rejected
- Published: true
- Performance Reviewed: true
- Human Approved: true

### Metrics

- ctr: null
- searchTraffic: null
- averageReadTime: null
- scrollDepth: null
- returnVisitors: null
- comments: null
- shares: null
- likes: null

### Editor Review

<human review>

### Summary

<summary>
```
