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

점수 / 15

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


# COSMOS 품질 루브릭

Fail Gate를 모두 통과한 글만 아래 항목을 평가합니다. 각 점수에는 글의 구체적인 근거를 반드시 붙입니다.

| 평가 항목 | 배점 | 확인 기준 |
| --- | ---: | --- |
| Search Intent | 15 | 검색한 독자의 질문, 기대하는 해결 범위, 본문의 답변이 일치하는가 |
| Title Quality | 10 | 제목이 주제를 명확히 약속하고 본문이 그 약속을 과장 없이 이행하는가 |
| Introduction | 10 | 독자의 상황과 읽을 이유를 자연스럽게 제시하는가 |
| Explanation | 10 | 원리와 실행 방법을 이해하기 쉽고 충분한 맥락으로 설명하는가 |
| Logical Structure | 5 | 섹션의 순서, 제목, 연결이 논리적으로 자연스러운가 |
| Fact Accuracy | 15 | 검증 가능한 근거가 있고 불확실한 내용을 단정하지 않는가 |
| Human Texture | 10 | Scene usage 3, Specificity 3, Sensory details 2, Concrete examples 2를 충족하며 예시는 명확히 예시로 표시하는가 |
| SEO | 10 | 독자가 사용하는 자연스러운 표현을 쓰며 키워드를 과도하게 반복하지 않는가 |
| Readability | 5 | 문단, 문장 길이, 목록, 소제목이 읽기 쉬운가 |
| Reader Next Action | 5 | 독자가 안전하고 현실적인 다음 행동을 할 수 있는가 |
| Brand Voice | 5 | 신뢰를 우선하고 전문적이며 이해하기 쉬운 한국어를 쓰는가 |

총점은 100점입니다.

Human Texture가 6 / 10 미만이면 Quality Report에 `Human Texture Warning`을 추가합니다.

## 품질 등급

| 총점 | 등급 |
| ---: | --- |
| 90~100 | `publish_ready` |
| 85~89 | `minor_revision` |
| 80~84 | `rewrite_sections` |
| 80 미만 | `major_revision` |

점수가 낮은 항목은 해당 약한 섹션의 Rewrite Plan 및 Knowledge Suggestions와 연결합니다. Fail Gate가 실패한 글에는 점수와 등급을 부여하지 않습니다.


# Article Brief

# Article Brief

## Series

living-info

## Topic

24절기 대서의 뜻과 시기를 간단히 설명하고, 가장 더운 절기를 건강하게 보내기 위한 생활 수칙을 안내한다.

## Title Candidates

### 1. Search-first

- Title: 대서 뜻과 시기, 가장 더운 절기에 챙길 생활수칙
- Related Search Keywords: 대서 뜻, 대서 시기, 대서 생활수칙
- Estimated Search Intent Match: 5
- Estimated CTR: 4
- Brand Fit: 5
- Reason: 대서의 기본 정보를 찾는 독자에게 뜻·시기·실천 정보를 제목에서 바로 제시합니다.

### 2. Curiosity-first

- Title: 대서가 오면 왜 더위가 더 버거울까, 일상에서 준비할 것들
- Related Search Keywords: 대서 더위, 여름철 건강수칙, 폭염 대비
- Estimated Search Intent Match: 4
- Estimated CTR: 5
- Brand Fit: 4
- Reason: 절기의 의미를 일상적인 불편과 연결해 읽을 이유를 자연스럽게 만듭니다.

### 3. Checklist

- Title: 대서 전 확인할 5가지, 물·그늘·휴식으로 더위 대비하기
- Related Search Keywords: 대서 건강수칙, 폭염 대비, 온열질환 예방
- Estimated Search Intent Match: 5
- Estimated CTR: 4
- Brand Fit: 5
- Reason: 더위가 본격화되기 전 바로 점검할 행동을 명확한 체크리스트 형식으로 약속합니다.

### 4. Living Information

- Title: 대서에는 어떻게 지내면 좋을까, 무리하지 않는 한여름 생활법
- Related Search Keywords: 대서, 여름 생활정보, 더위 피하는 법
- Estimated Search Intent Match: 4
- Estimated CTR: 4
- Brand Fit: 5
- Reason: 계절의 흐름을 따라 차분하고 실용적인 생활 정보를 찾는 독자에게 맞는 제목입니다.

### 5. Trend / Seasonal

- Title: 24절기 대서, 한여름을 무리 없이 보내는 현실적인 방법
- Related Search Keywords: 24절기 대서, 대서 뜻, 한여름 건강관리
- Estimated Search Intent Match: 4
- Estimated CTR: 5
- Brand Fit: 5
- Reason: 절기의 계절성을 살리면서도 독자의 실제 관심사인 한여름 생활 관리로 연결합니다.

## Target Reader

대서의 뜻과 시기를 확인하면서, 폭염이 잦은 한여름에 일상에서 무리하지 않는 방법을 찾는 한국 독자

## Primary Search Intent

대서가 무엇인지 알고, 이 시기에 더위에 대비하기 위해 무엇을 실천하면 좋은지 알고 싶다.

## Secondary Search Intent

폭염특보와 온열질환 예방 수칙을 확인하고, 외출과 실내 생활을 조절하는 기준을 알고 싶다.

## Reader Pain Points

- 대서라는 절기의 뜻은 알지만 생활과 어떻게 연결되는지 모르겠다.
- 더운 날에도 출퇴근, 장보기, 돌봄 등으로 외출을 피하기 어렵다.
- 물을 마시고 쉬어야 한다는 원칙은 알지만 미리 준비할 순서가 막막하다.
- 더위로 몸이 불편할 때 어느 정도에서 활동을 멈춰야 할지 판단하기 어렵다.

## Reader Questions

- 대서는 어떤 절기이며 언제쯤인가?
- 대서 무렵에는 왜 기상 정보를 더 자주 확인해야 하는가?
- 더운 시간대의 외출과 활동은 어떻게 조절할 수 있는가?
- 물, 그늘, 휴식은 일상에서 어떻게 준비하는가?
- 어지럼이나 메스꺼움이 생기면 어떻게 해야 하는가?

## Core Promise

대서의 의미를 정확하고 짧게 짚은 뒤, 절기 자체를 건강 위험의 근거로 과장하지 않고 기상 정보 확인, 햇볕 차단, 수분 섭취, 휴식, 이상 신호 대응으로 이어지는 생활 가이드를 제공한다.

## Main Takeaway

대서는 더위가 깊어지는 시기를 가리키는 절기다. 절기 이름만으로 하루의 위험을 판단하기보다, 실제 기온과 폭염특보를 확인하고 물·그늘·휴식의 기본 수칙으로 일정을 조절하는 편이 중요하다.

## Recommended Tone

계절의 감각은 살리되 불안을 키우지 않고, 원리와 행동을 분명하게 설명하는 차분한 한국어

## Recommended Article Pattern

대서의 일상 장면 도입 → 뜻과 시기 → 절기와 실제 날씨를 구분해 보는 법 → 물·그늘·휴식 준비 → 외출과 실내 활동 조절 → 이상 신호 대응 → 오늘의 체크리스트

## Suggested Analogy

대서는 달력에 찍힌 폭염 경보가 아니라, 여름 생활의 속도를 한 번 점검하라는 계절의 표지판에 가깝다.

## Recommended CTA

이번 주 시간별 예보와 폭염특보를 확인하고, 외출 시간·그늘 경로·물과 휴식 장소를 한 가지씩 미리 정한다.

## Potential Risks

- 대서가 매년 특정 날짜에 고정된다고 단정하지 않는다.
- 대서라는 절기만으로 실제 폭염 여부나 건강 위험을 판단하지 않는다.
- 온열질환 증상과 응급 대응을 의료 진단처럼 단정하지 않는다.
- 물 섭취가 모든 사람에게 같은 양으로 적용된다고 말하지 않는다.
- 폭염특보 여부와 관계없이 개인의 건강 상태와 활동 환경에 따라 위험이 달라질 수 있음을 밝힌다.

## Fact Check Notes

- 기상청 24절기 자료에서 대서의 위치와 해당 연도의 절기 날짜를 확인한다.
- 기상청 날씨누리의 폭염 국민행동요령에서 기상 정보 확인, 야외활동 자제, 무더위쉼터 확인 방법을 확인한다.
- 질병관리청의 최신 온열질환 예방 자료에서 물·그늘·휴식, 햇볕 차단, 활동 자제, 취약계층 유의사항을 확인한다.
- 증상과 응급 조치는 질병관리청의 온열질환 안내를 근거로 하며, 의식 저하 등 응급 상황은 119 도움 요청으로 안내한다.

## Planner Self Review

- Target Reader: 92 — 절기 정보를 확인하는 독자와 한여름 생활 수칙이 필요한 독자를 구체적으로 연결합니다.
- Search Intent: 93 — 대서의 뜻·시기와 더위 대비 행동을 함께 해결하되, 어느 한쪽으로 흐르지 않게 설계했습니다.
- Reader Value: 92 — 기상 확인부터 외출·휴식·이상 신호 대응까지 실제 생활의 순서로 안내합니다.
- Originality: 88 — 절기 설명을 민속 지식 나열에 머물지 않고 현재의 생활 계획으로 확장합니다.
- Brand Fit: 95 — 수치나 효과를 과장하지 않고 공식 안전수칙과 독자의 선택을 우선합니다.
- Risk: 92 — 절기와 실제 폭염을 구분하고 의료·수분 섭취 관련 단정의 한계를 분명히 했습니다.

## Planning Score

92

## Planning Improvement Suggestions

- 사람 편집자가 다섯 후보 중 최종 제목을 직접 선택한 뒤에만 본문을 작성합니다.
- 선택한 제목이 약속하는 범위에 맞춰 절기 설명과 생활수칙의 비중을 조정합니다.


# Article To Evaluate

# 대서 뜻과 시기, 가장 더운 절기에 챙길 생활수칙

## 소개

{{INTRO}}

## 본문

{{BODY}}

## 요약

{{SUMMARY}}

## 자주 묻는 질문

{{FAQ}}

## 함께 보면 좋은 상품

이 글은 네이버 쇼핑 커넥트 활동의 일환으로, 상품 구매 시 일정액의 수수료를 받을 수 있습니다.

{{RECOMMENDED_PRODUCT_NAMES}}

## 함께 보면 좋은 글

{{RELATED_ARTICLES}}

## 태그

{{TAGS}}

## 썸네일 프롬프트

{{THUMBNAIL_PROMPT}}

## 인포그래픽 1 프롬프트

{{INFOGRAPHIC_1_PROMPT}}

## 인포그래픽 2 프롬프트

{{INFOGRAPHIC_2_PROMPT}}

