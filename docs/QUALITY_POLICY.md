# COSMOS 품질 정책

## 목적

Quality Engine은 완성된 글의 발행 준비 상태를 검토하는 독립 모듈입니다. 이 엔진은 글을 자동으로 다시 쓰지 않습니다. 약한 섹션과 보완에 필요한 Knowledge Engine 자료를 기록하여, 사람 편집자 또는 미래의 Rewrite Engine이 제한된 범위에서 수정할 수 있게 합니다.

Quality Engine은 AI 검토자이며 최종 발행 결정권자가 아닙니다. 최종 발행 결정은 항상 사람 편집자에게 있습니다.

## 검토 흐름

1. 완성된 글을 Fail Gate로 먼저 검토합니다.
2. 하나라도 실패하면 `quality.status`를 `fail`로 기록합니다. 점수와 등급은 계산하지 않습니다.
3. 모든 Fail Gate를 통과하면 루브릭을 평가하고 점수, 등급, 약한 섹션, Knowledge 제안, 신뢰도를 기록합니다.
4. 수정이 필요하면 Rewrite Engine은 `quality.rewriteSections`와 `quality.knowledgeSuggestions`만 읽어 해당 섹션만 다시 작성할 수 있습니다.

## Fail Gate

다음 중 하나라도 실패하면 발행 준비 상태는 실패입니다.

- 사실과 다른 정보가 있다.
- 검색 의도와 글의 해결 범위가 맞지 않는다.
- 오해를 부르거나 과장된 주장이 있다.
- `PROJECT_RULES`를 위반했다.
- 필수 글 섹션이 없다.

Fail Gate 실패 결과에는 Failed Gates, Rewrite Plan, Knowledge Suggestions만 보고합니다. 점수와 품질 등급은 보고하거나 계산하지 않습니다.

## 통과 후 평가

Fail Gate를 모두 통과한 글만 [품질 루브릭](../knowledge/shared/quality-rubric.md)으로 평가합니다. 평가자는 각 항목에 반드시 `점수 / 배점`과 근거를 적어야 합니다.

| 총점 | 품질 등급 |
| ---: | --- |
| 90~100 | `publish_ready` |
| 85~89 | `minor_revision` |
| 80~84 | `rewrite_sections` |
| 80 미만 | `major_revision` |

Rewrite Plan은 약한 섹션만 대상으로 합니다. 전체 글 재생성은 제안하지 않습니다.

## 근거 기반 설명

주요 설명 섹션은 필요한 경우 `핵심 주장 → 이유 → 원리 → 검증된 구체적 사실 또는 실제 사례 → 예외·한계 → 적용 방법` 순서로 전개합니다. 이 순서는 반복되는 소제목이 아니라 자연스러운 문단 구조로 사용합니다.

구체적 사실은 대상, 조건, 날짜, 단위 또는 범위와 검증 가능한 출처를 포함해야 합니다. 실제 사례도 출처와 맥락을 밝히고 근거 범위를 넘어 일반화하지 않습니다. 검증된 사례가 없으면 생략하거나 `예시:`로 표시한 설명용 예시만 사용하며, 개인 경험은 생성하지 않습니다.

Quality Engine은 별도 점수를 추가하지 않고 기존 Explanation, Fact Accuracy, Reader Next Action 항목에서 이를 평가합니다.

## Knowledge 제안

수정 전에 관련 Knowledge Engine 라이브러리와 필요한 이유를 제안합니다. 예를 들어 설명에 일상 비유가 부족하면 `knowledge/{series}/analogy-library.md`를, 섹션 구성이 약하면 `knowledge/{series}/article-patterns.md`를 제안할 수 있습니다.

## 신뢰도

통과한 평가에는 전체 신뢰도 0~100을 기록합니다. 신뢰도가 85 미만이면 사람 검토를 권장합니다. 신뢰도는 글의 품질 점수와 별개로, 검토 근거가 충분한 정도를 나타냅니다.

## 매니페스트 형식

품질 정보는 매니페스트의 전용 `quality` 객체에 저장합니다.

```json
{
  "status": "draft",
  "quality": {
    "status": "pass",
    "score": 87,
    "level": "minor_revision",
    "confidence": 92,
    "rewriteSections": ["FAQ", "Reader Action Checklist"],
    "knowledgeSuggestions": [
      {
        "library": "knowledge/living-info/analogy-library.md",
        "reason": "설명에 독자가 공감할 일상 비유가 부족합니다."
      }
    ]
  }
}
```
