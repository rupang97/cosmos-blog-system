# COSMOS Planning Policy

## Editorial Decision Gate

최상위 규칙은 **AI가 콘텐츠를 생성하기 전에 콘텐츠를 생성할 가치가 있는지 먼저 평가한다**입니다. Planner는 Strategy Evidence를 바탕으로 `Recommended Action`을 제안할 뿐이고, `Human Decision`은 사람 편집자가 확정합니다. 두 값이 달라도 오류가 아닙니다.

판단은 Truth and Evidence → Reader Value → Content Portfolio Fit → Search Feasibility → Project and Business Contribution 순서로 합니다. 근거 없는 사실과 수치를 만들지 않으며, 필수 근거가 부족하면 `research_needed`를 제안합니다. 검색량이나 사업 기여가 높아도 새로운 독자 가치가 없으면 `create_new`를 제안하지 않습니다.

Writer는 Human Decision이 `create_new`일 때만 실행합니다. `update_existing`, `merge_existing`, `stop`, `research_needed`는 Decision Record를 남기고 정상 종료하며, 기존 글 수정·Writer/SEO/Thumbnail 프롬프트 생성·시리즈 번호 증가·제목 결정 기록을 하지 않습니다.

Decision Record는 감사용 `hypothesis`이며 Planner의 재사용 지식이나 자동 학습 입력이 아닙니다. 실제 발행, 성과 검토, 사람 승격 전에는 Editorial Rule 또는 Proven Pattern으로 사용할 수 없습니다.

`split_existing`, `redirect`, 자동 Update/Merge 실행은 현재 범위 밖입니다.

## 목적

Planning Engine은 글쓰기 전에 독자와 약속을 명확히 하는 독립 모듈입니다. 공식 파이프라인은 `Topic → Planner → Writer → Quality → Publish`이며, 모든 글은 승인된 Article Brief에서 시작합니다.

## 필수 게이트

Writer는 완료된 Article Brief와 85점 이상인 Planning Score 없이는 시작할 수 없습니다. Planner는 다음 질문에 답해야 합니다.

- 이 글의 독자는 누구인가?
- 독자는 왜 검색하는가?
- 어떤 문제를 해결하려 하는가?
- 읽은 뒤 무엇을 이해해야 하는가?
- 어떤 행동을 해야 하는가?
- 글이 반드시 지켜야 할 약속은 무엇인가?

Planner Self Review는 다음 7개 기준을 이유와 함께 평가합니다.

- Target Reader: 0~100점
- Search Intent: 0~100점
- Reader Value: 0~100점
- Originality: 0~100점
- Brand Fit: 0~100점
- Risk: 0~100점
- Keyword Quality: 0~20점

`Planning Score`는 7개 점수를 각각 100점 기준으로 환산한 뒤 산술평균하여 반올림한 값입니다. 즉 앞의 6개 점수는 그대로 사용하고, Keyword Quality는 `(점수 / 20) × 100`으로 환산합니다. Planning Score가 85점 미만이거나 Keyword Quality가 15/20 미만이면 `needs_improvement`이며, 구체적인 개선 제안 없이는 다음 단계로 진행할 수 없습니다. Article Brief에는 반드시 `- Keyword Quality: <점수>/20`를 포함해야 하며, 누락 시 작성 단계는 실패합니다.

## 제목 후보와 사람 선택

Planner는 최종 제목 하나를 출력하거나 자동으로 추천하지 않습니다. 모든 `article-brief.md`에는 `Title Candidates` 섹션이 있어야 하며, Search-first, Curiosity-first, Checklist, Living Information, Trend / Seasonal 전략별로 정확히 하나씩 총 5개 후보를 저장합니다.

각 후보에는 제목, 연관 검색어 2~3개, 검색 의도 적합도 1~5, 예상 CTR 1~5, 브랜드 적합도 1~5, 이유가 포함되어야 합니다. 이 평점은 비교를 돕는 추정치이며 실제 성과로 취급하지 않습니다.

최종 제목은 사람 편집자만 선택합니다. Writer는 선택된 제목이 브리프의 5개 후보 중 하나와 정확히 일치할 때만 시작하며, 선택된 제목은 `manifest.json`의 `title`에 기록합니다. 충분한 성과 데이터가 쌓인 뒤 자동 선택을 검토할 수 있지만 현재 버전은 자동 선택하지 않습니다.

제목을 선택한 뒤 편집자는 선택 이유(`Selection Reason`)를 한 문장으로 선택 입력할 수 있습니다. 입력된 값은 `manifest.json`의 `planning.selectionReason`에 저장합니다. 이유를 생략하면 매니페스트에는 `null`을 저장합니다.

`title-decisions.md`는 기존 기록을 덮어쓰지 않는 append-only 장기 편집 지식입니다. 각 결정에는 선택된 제목만이 아니라 브리프의 5개 후보를 모두 저장하며, 하나는 `selected`, 나머지 네 개는 `rejected`로 표시합니다. 후보별 전략, 검색어, 예상 점수, 생성 이유도 함께 보존합니다. 선택 이유를 생략한 경우에도 후보 전체와 `Not provided` 상태를 기록합니다.

현재 버전은 이 기록을 제목 자동 선택이나 자동 순위화에 사용하지 않습니다. 충분한 성과 데이터가 축적된 미래 버전에서 자동 제목 순위화의 근거로 검토할 수 있습니다.

## Editorial Validation Rule

제목은 AI 선호에 맞춰 최적화하지 않습니다. 편집 판단의 근거는 검증된 사람 편집 결정이어야 합니다.

사람이 선택한 제목도 처음에는 `hypothesis`입니다. 실제 발행이 완료되고 실제 성과를 사람이 검토한 뒤에만 해당 결정을 `validated`로 인정할 수 있습니다. 미발행 초안, 성과를 검토하지 않은 발행물, AI가 추정한 성과는 검증 근거가 아닙니다.

매니페스트는 최초 선택 상태를 `planning.titleDecisionStatus: "hypothesis"`로 명시합니다.

`title-decisions.md`의 초기 선택 기록은 다음 상태를 가집니다.

- `Status: hypothesis`
- `Published: false`
- `Performance Reviewed: false`

파일은 append-only이므로 기존 가설 기록을 수정해 `validated`로 바꾸지 않습니다. 향후 성과 검토 기능은 동일한 `Decision ID`를 참조하는 별도 validation 이벤트를 추가해야 합니다. 이 이벤트에는 발행 확인, 실제 성과 근거, 사람 검토 결과가 있어야 합니다.

미래의 자동 제목 순위화는 연결된 validation 이벤트가 있는 `validated` 결정만 입력으로 사용할 수 있습니다. `hypothesis`, 미발행 초안, 검토되지 않은 성과 기록은 학습·랭킹·추천에서 반드시 제외합니다. 현재 버전에는 자동 순위화를 구현하지 않습니다.

## 모듈 연결

- Planner는 Article Brief와 자기 검토 결과를 만듭니다.
- Writer는 Brief를 입력으로 받아야 하며 독자 의도를 독자적으로 추정하지 않습니다.
- Quality Engine은 완성 글을 Brief와 비교해 약속 이행, 계획된 질문의 답변, 목표 독자 적합성을 평가합니다.
- Publish Package는 `article-brief.md`와 매니페스트의 `planning` 객체를 포함합니다.

## Editorial Memory

Planner는 `knowledge/editorial/editorial-rules.md`와 `knowledge/editorial/proven-patterns.md`만 Editorial Memory 입력으로 사용합니다. 초안, 가설, 거절된 제목, `title-decisions.md`, `validation-events.md`, `evidence-log.md`, `failed-patterns.md`는 직접 읽지 않습니다.

AI가 만든 문구, 제목, 비유 또는 추정 성과는 자동으로 저장하거나 학습에 사용하지 않습니다. 검증 이벤트도 Planner의 직접 지식이 아니며, 사람이 승인한 Rule과 Proven Pattern으로 단계적으로 승격되어야 합니다. 전체 정책은 [Learning Principles](LEARNING_PRINCIPLES.md)를 따릅니다.

향후 흐름은 `Planner → Writer → Quality → Publish → Performance Review → Editorial Memory Update → Knowledge Engine Improvement`입니다.
