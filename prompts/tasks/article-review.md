# Article Review Task

## Article Brief Alignment

Use the supplied Article Brief as the evaluation contract. Confirm that the final article keeps the Core Promise, answers the planned Reader Questions, and fits the Target Reader and Primary Search Intent. If any of these checks fail, mark the Search Intent Fail Gate as `fail` and explain the mismatch.

완성된 글의 발행 준비 상태를 검토하세요. 글을 작성하거나 고쳐 쓰지 마세요. Quality Engine은 AI 검토자일 뿐이며, 최종 발행 결정은 사람 편집자가 합니다.

## 검토 순서

1. 다음 Fail Gate를 각각 `pass` 또는 `fail`과 근거로 평가합니다.
   - Factually incorrect information
   - Search intent mismatch
   - Misleading or exaggerated claims
   - Violation of PROJECT_RULES
   - Missing required article sections
2. 하나라도 `fail`이면 전체 `status`는 반드시 `fail`입니다. 점수와 품질 등급을 계산하거나 출력하지 마세요.
3. 모두 `pass`이면 `knowledge/shared/quality-rubric.md`의 모든 항목을 평가하세요. 각 항목은 반드시 `점수 / 배점`과 구체적 이유를 포함해야 합니다.
4. 약한 섹션만 Rewrite Plan에 적으세요. 전체 글 또는 이미 충분한 섹션의 재작성은 제안하지 마세요.
5. 수정 전에 도움이 될 Knowledge Engine 라이브러리를 경로와 이유로 제안하세요. 제안은 약한 섹션과 직접 연결되어야 합니다.
6. 통과한 글에는 Overall Confidence(0~100 정수)를 기록하세요. 85 미만이면 `Human review recommended.`를 추가하세요.

## 출력 형식

아래 Markdown 구조를 정확히 따르세요. 모든 상태값과 품질 등급은 코드 형식의 소문자 값을 사용하세요.

# Quality Report

## Status

`pass` 또는 `fail`

## Fail Gates

- Fact Accuracy: `pass` 또는 `fail` — 이유
- Search Intent: `pass` 또는 `fail` — 이유
- Claims: `pass` 또는 `fail` — 이유
- PROJECT_RULES: `pass` 또는 `fail` — 이유
- Required Sections: `pass` 또는 `fail` — 이유

Fail Gate가 하나라도 실패한 경우에는 여기서부터 아래 세 섹션만 출력하세요.

## Rewrite Plan

- 약한 섹션 이름 — 필요한 개선

## Knowledge Suggestions

- `knowledge/{series}/library.md` — 필요한 이유

## Summary

- 결과 요약
- 결과 요약
- 결과 요약

모든 Fail Gate를 통과한 경우에는 다음 섹션을 이어서 출력하세요.

## Scores

### Search Intent

점수 / 10

Reason: 이유

### Keyword Psychology

점수 / 10

Reason: 이유

모든 항목을 같은 방식으로 작성한 뒤 `TOTAL / 100`을 적으세요.

Human Texture 점수가 6 / 10 미만이면 다음 섹션을 추가하세요.

## Human Texture Warning

- 부족한 Human Texture 요소와 보완이 필요한 섹션

## Quality Level

`publish_ready`, `minor_revision`, `rewrite_sections`, `major_revision` 중 하나

## Rewrite Plan

- 약한 섹션 이름 — 필요한 개선

## Knowledge Suggestions

- `knowledge/{series}/library.md` — 필요한 이유

수정 또는 Knowledge 제안이 없으면 `Not required.`라고 적으세요.

## Confidence

0~100 정수

85 미만이면 `Human review recommended.`

## Summary

- 결과 요약
- 결과 요약
- 결과 요약
