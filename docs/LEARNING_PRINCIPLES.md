# COSMOS Learning Principles

## Core Principle

COSMOS는 콘텐츠 생성기가 아니라 증거를 축적하는 편집 운영체제입니다. AI의 선호나 추정은 학습 근거가 아닙니다. 재사용 가능한 지식은 실제 발행 결과를 사람이 검토하고 승인한 검증된 편집 결정에서만 만들어집니다.

- AI never learns from drafts.
- AI never learns from hypotheses.
- AI never learns from rejected decisions.
- Only validated editorial decisions become reusable knowledge.
- Evidence precedes Rules.
- Rules precede Patterns.
- Patterns precede Recommendations.
- Humans approve every promotion.

## Learning Pipeline

```text
Draft
  ↓
Hypothesis
  ↓
Validation Event
  ↓
Evidence
  ↓
Editorial Rule
  ↓
Proven Pattern
  ↓
Planner Recommendation
```

다음 전이는 금지합니다.

- `Draft → Learning`
- `Hypothesis → Pattern`
- `Rejected → Rule`

어떤 단계도 건너뛸 수 없습니다. AI는 승격을 제안할 수는 있어도 실행하거나 승인할 수 없습니다. 모든 승격은 사람이 근거를 검토하고 승인해야 합니다.

## Memory Promotion Levels

### Level 0 — Draft

작성 중이거나 미발행인 콘텐츠입니다. 학습, 규칙, 패턴, 추천에 사용할 수 없습니다.

### Level 1 — Hypothesis

사람이 선택했지만 실제 성과로 검증되지 않은 편집 결정입니다. `title-decisions.md` 같은 append-only 감사 기록에 보존할 수 있지만 재사용 지식은 아닙니다.

### Level 2 — Validated Evidence

실제 발행 후 성과를 사람이 검토하고 `validated` Validation Event로 승인한 근거입니다. `rejected` 이벤트는 실패 기억으로 보존하지만 재사용 지식의 근거가 될 수 없습니다.

### Level 3 — Editorial Rule

하나 이상의 validated Validation Event를 근거로 사람이 승인한 규칙입니다. 근거가 없으면 규칙도 없습니다.

### Level 4 — Proven Pattern

검증된 규칙과 반복된 validated evidence를 바탕으로 사람이 승격한 패턴입니다. 가설은 이 단계에 저장할 수 없습니다.

### Level 5 — Planner Recommendation

Planner가 `editorial-rules.md`와 `proven-patterns.md`만 참고해 만드는 추천입니다. 추천은 최종 결정이 아니며 사람 편집자가 선택합니다.

## Planner Knowledge Boundary

Planner가 읽을 수 있는 Editorial Evidence는 다음 두 파일뿐입니다.

- `knowledge/editorial/editorial-rules.md`
- `knowledge/editorial/proven-patterns.md`

Planner는 다음 자료를 직접 학습하거나 추천 근거로 사용하지 않습니다.

- drafts
- hypotheses
- rejected titles or decisions
- `title-decisions.md`
- `validation-events.md`
- `evidence-log.md`
- `failed-patterns.md`

Validation Event는 증거 사슬의 원천이지만 Planner의 직접 입력이 아닙니다. 사람 승인 과정을 거친 Rule과 Proven Pattern만 Planner까지 도달합니다.

## Append-only Safety

- 과거 편집 결정을 덮어쓰거나 삭제하지 않습니다.
- Validation Event를 덮어쓰거나 삭제하지 않습니다.
- 거절된 결정과 실패 패턴을 삭제하지 않습니다.
- 수정, 반려, 승격은 기존 항목 변경이 아니라 참조 ID를 가진 새 이벤트나 새 버전으로 추가합니다.
- 미래 분석과 자동 순위화는 validated evidence만 사용합니다.

## Manifest Validation State

새 글의 매니페스트는 검증 전 상태를 명시합니다.

```json
{
  "validation": {
    "status": "pending",
    "eventId": null,
    "validatedAt": null
  }
}
```

이 객체는 기존 `planning.titleDecisionStatus`를 대체하지 않습니다. Planning 선택은 `hypothesis`로 유지되고, 별도 실제 성과 검증이 완료되어야 validation 상태가 바뀔 수 있습니다.
