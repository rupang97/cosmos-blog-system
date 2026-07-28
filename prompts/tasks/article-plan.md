# Article Planning Task

작성 전에 반드시 아래 형식의 편집 브리프를 만드세요. 이 단계에서는 본문을 작성하지 마세요. 확인되지 않은 사실, 성과 수치, 독자 특성을 사실처럼 단정하지 마세요.

시리즈 자료와 검증된 Knowledge Library를 참고하되, Editorial Memory는 사람 검토로 승인된 항목만 참고 자료로 사용하세요.

AI가 선호할 법한 제목을 최적화하지 마세요. 검증된 사람 편집 결정만 편집 근거로 사용하세요. 사람의 제목 선택은 발행 성과가 검토되기 전까지 가설일 뿐입니다. 미발행 초안의 선택 기록과 `hypothesis` 상태의 결정은 제목 생성이나 순위 판단의 학습 근거로 사용하지 마세요.

근거 없는 사실과 수치를 만들지 않습니다. 근거가 부족한 판단을 확정하지 않습니다. 판단 가능한 경우에는 근거가 표시된 가설로 제안하고, 필수 근거가 부족하면 `research_needed`를 반환합니다. AI는 불확실성을 숨기지 않습니다.

판단 순서는 Truth and Evidence → Reader Value → Content Portfolio Fit → Search Feasibility → Project and Business Contribution입니다. 검색량이나 사업 기여가 높아도 새로운 독자 가치가 없으면 `create_new`를 추천하지 마세요.

## Strategy Evidence Review

### Search Evidence

- Search Demand:
- Search Intent:
- SERP Competition:
- Channel:
- Observed At:
- Source:

### Content Evidence

- Existing Articles:
- Existing Performance:
- Topic Overlap:
- Cannibalization Risk:
- Internal Link Opportunities:

### Project and Business Evidence

- Series Goal:
- Brand Goal:
- Business Goal:
- Expected Contribution:

### Knowledge Coverage Evidence

- Reader Already Knows:
- Reader Actually Wants:
- Understanding Gap:
- Existing Knowledge Assets:
- Missing Knowledge:

`Understanding Gap`은 검색자가 이미 알고 있는 내용과 실제 행동을 위해 추가로 이해해야 하는 내용 사이의 차이입니다. COSMOS Knowledge Engine의 검증된 규칙이 아니라 현재 독자의 이해 범위와 콘텐츠 지식 공백만 기록하세요.

### Evidence Gaps

-

## Editorial Decision Recommendation

- Evidence Status: sufficient | insufficient
- Recommended Action: create_new | update_existing | merge_existing | stop | research_needed
- Reader Value:
- Content Portfolio Fit:
- Search Feasibility:
- Project and Business Contribution:
- Recommendation Rationale:
- Required Next Evidence:

콘텐츠 공백만으로 `create_new`를 추천하지 말고 기존 발행량, 실제 성과, 주제 중복을 함께 봅니다. 기존 글 개선으로 해결되면 `update_existing`, 여러 글의 의도와 내용이 중복되어 독자 경험이나 검색 성과를 분산시키는 경우에만 `merge_existing`, 새 독자 가치가 없거나 프로젝트 목표와 맞지 않으면 `stop`, 필수 근거가 부족하면 수치를 만들지 말고 `research_needed`를 추천하세요. 검색자가 이미 아는 내용은 짧게 처리하고 `Understanding Gap`과 `Reader Actually Wants`를 Core Promise와 목차에 반영하세요. 다른 글의 소제목 구조를 그대로 복사하지 마세요. 고정 발행량 기준이나 근거 없는 숫자 점수는 만들지 마세요.

`Recommended Action: create_new`일 때만 아래의 완전한 Article Brief, Title Candidates, Keyword Psychology, Self Review, Planning Score를 출력합니다. 그 외에는 제목 후보와 새 글용 Article Brief를 만들지 말고 아래만 출력합니다.

## Recommended Action Brief

- Target Content:
- Proposed Change:
- Expected Reader Benefit:
- Risks:
- Human Review Notes:

아래 Article Brief부터는 `Recommended Action: create_new`일 때만 계속 출력하세요. 다른 Recommended Action에서는 여기서 멈춥니다.

# Article Brief

Planning flow: Reader Psychology → Action Intent → Problem → Solution → Search Intent → CTR Hooks → Thumbnail.

## Series

## Topic

## Title Candidates

`Keyword Psychology`를 먼저 확정한 뒤 정확히 5개의 제목 후보를 아래 순서와 형식으로 작성하세요. 전략마다 후보는 하나만 작성하고, 최종 제목을 추천하거나 자동 선택하지 마세요. 모든 평점은 1~5 정수이며, 연관 검색어는 2~3개입니다.

모든 제목 후보에는 `High Intent Keywords` 중 하나를 그대로 포함하세요. 제목은 문제형, 행동형, 체크리스트형, 호기심형, 생활정보형 중 해당 전략에 맞는 형식을 사용하되, 기사에서 답할 수 있는 내용만 약속하세요.

### 1. Search-first

- Title:
- Related Search Keywords:
- Estimated Search Intent Match:
- Estimated CTR:
- Brand Fit:
- Reason:

### 2. Curiosity-first

- Title:
- Related Search Keywords:
- Estimated Search Intent Match:
- Estimated CTR:
- Brand Fit:
- Reason:

### 3. Checklist

- Title:
- Related Search Keywords:
- Estimated Search Intent Match:
- Estimated CTR:
- Brand Fit:
- Reason:

### 4. Living Information

- Title:
- Related Search Keywords:
- Estimated Search Intent Match:
- Estimated CTR:
- Brand Fit:
- Reason:

### 5. Trend / Seasonal

- Title:
- Related Search Keywords:
- Estimated Search Intent Match:
- Estimated CTR:
- Brand Fit:
- Reason:

최종 제목 선택은 항상 사람 편집자의 책임입니다. 성과 데이터가 충분히 쌓이기 전에는 어떤 후보도 선택된 제목으로 표시하지 마세요.

## Target Reader

## Keyword Psychology

### Action Intent

독자가 지금 당장 해결하려는 행동을 한 문장으로 작성하세요.

### Problem

독자가 겪는 문제를 한 문장으로 작성하세요.

### Solution

글이 해결하는 행동을 한 문장으로 작성하세요.

### High Intent Keywords

검색량보다 행동 의지가 강한 키워드를 3~7개 추천하세요. 각 키워드는 문제 해결, 확인, 비교, 구매 또는 다음 행동과 연결해야 합니다.

### Low Intent Keywords

검색량이 있더라도 행동 의지가 낮은 넓은 키워드를 별도로 2~5개 분류하세요. High Intent Keywords보다 우선하지 마세요.

### Primary Keyword

- Keyword:
- Intent:
- Evidence Status: `candidate` 또는 `verified`
- Evidence Source:
- Observed At:
- Channel Fit: `naver`, `google`, `both`
- Lifecycle: `evergreen`, `seasonal`, `event`

`candidate`는 초안·사람 검토 대기 상태이며, 발행 전 사람이 근거를 확인한 뒤에만 `verified`로 변경할 수 있습니다.

### Supporting Long-tail Keywords

3~5개를 아래 형식으로 작성하세요. 각 키워드는 `주제어 + 행동어 + 구체 조건(대상·지역·시기·상황)` 원칙을 따르십시오. 검색량·경쟁·CPC·성과 수치를 추정하거나 발명하지 마십시오. 근거 없는 `바로가기`, `다운로드` 표현으로 클릭을 유도하지 마십시오. 제목 후보는 Primary Keyword 또는 Supporting Long-tail Keyword 중 하나와 자연스럽게 연결해야 합니다.

- 
- 
- 

## Primary Search Intent

## Secondary Search Intent

## Reader Pain Points

## Reader Questions

## Core Promise

## Main Takeaway

## Recommended Tone

## Recommended Article Pattern

## Suggested Analogy

## Recommended CTA

## Potential Risks

## Fact Check Notes

## Evidence-backed Explanation Guidance

- Core claims and reasons:
- Relevant principles:
- Verified concrete facts and sources:
- Verified real-world cases and sources:
- Exceptions and limits:
- Application steps:

Use `Not available` when a verified fact or real-world case is unavailable. Never invent a case. Do not add personal experience. Apply the sequence `claim → reason → principle → verified concrete fact or real-world case → exception or limitation → practical application` only to major explanatory sections where it improves understanding.

## Human Texture Guidance

- Recommended scenes:
- Recommended sensory details:
- Recommended concrete numbers:
- Recommended locations:
- Recommended examples:

Use this section for recommendations only. Do not rewrite text here. Do not invent facts. Mark illustrative examples clearly as examples.

## Planner Self Review

각 항목을 구체적인 이유와 함께 평가하세요. 기존 항목은 0~100 정수 점수이며, Keyword Quality는 0~20 정수 점수입니다.

- Target Reader
- Search Intent
- Reader Value
- Originality
- Brand Fit
- Risk
- Keyword Quality: <score>/20 — <reason>

일곱 항목을 100점 기준으로 환산해 평균 낸 값을 `Planning Score`로 기록하세요. `Keyword Quality`가 15/20 미만이거나 `Planning Score`가 85 미만이면 본문 작성은 금지됩니다. 그 경우 반드시 아래에 개선 제안을 적고, 개선된 브리프를 다시 평가하세요. Keyword Quality는 다음 네 항목을 각각 5점 만점으로 평가합니다.

- 행동 의도와 문제 적합성: 5점
- 검색 수요 근거의 존재와 최신성: 5점
- 롱테일 구체성: 5점
- 본문이 실제로 답할 수 있는 범위와 신뢰 위험: 5점

## Planning Score

## Planning Improvement Suggestions
