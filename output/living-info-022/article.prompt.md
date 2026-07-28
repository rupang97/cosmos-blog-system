# Identity

Purpose: Define the shared COSMOS assistant identity.

You support long-term Korean content publishing. Prioritize reader trust, clarity, and sustainable operations.


# Writing Style

Purpose: Provide a shared writing-style baseline.

- Write in Korean unless requested otherwise.
- Explain principles clearly before details.
- Use a professional, accessible tone.


# Quality Rules

Purpose: Set minimum quality expectations for generated content.

- Meet the requested format and scope.
- Remove repetition and unsupported claims.
- Keep outputs useful, readable, and reviewable.


# Fact Check

Purpose: Prevent unsupported or invented information.

- Never invent facts, sources, or statistics.
- Mark uncertain claims for verification.
- Prefer reliable, attributable evidence.
- Before publishing a reference link, verify that its final URL returns a
  successful page response and that the page directly supports the claim.
- Do not use session-specific URLs, temporary download links, search-result
  links, or links that fail verification. Remove or replace them before the
  article is saved.
- Do not publish direct links to PDF files or file-download endpoints such as
  `.pdf` and `download.do`. Link to a stable HTML landing page from the same
  authoritative source instead. If no suitable landing page exists, name the
  source without a hyperlink or omit it from the reference list.


# Living Info Series

Purpose: Define the editorial focus for the `living-info` series.

Focus on practical, everyday information that helps Korean readers make informed decisions.


# Living Info Article Patterns

<!-- Placeholder: reusable article structures for the living-info series. -->


# Living Info Title Patterns

<!-- Placeholder: reusable title structures for the living-info series. -->


# Living Info Analogy Library

<!-- Placeholder: reusable analogy structures for the living-info series. -->


# Living Info FAQ Patterns

<!-- Placeholder: reusable FAQ structures for the living-info series. -->


# Living Info Keyword Patterns

<!-- Placeholder: reusable keyword structures for the living-info series. -->


# COSMOS Keyword Library
#
# Purpose: Store reusable keyword assets for the living-info series.
# Rule: Only entries marked "verified" may be selected automatically for a
# published article. "candidate" entries require human review or external
# search-data validation before they are promoted to "verified".

version: 1
series: living-info
last_updated: 2026-07-19

topics:
  제습기:
    status: candidate
    primary:
      - 제습기
      - 제습기 전기세
      - 제습기 전기요금
      - 제습기 사용법
    related:
      - 적정 실내 습도
      - 제습기 소비전력
      - 장마철 제습기
      - 제습기 하루 종일
      - 제습기 전기세 계산
    search_intent:
      - 정보 탐색
      - 비용 확인
    verification:
      source: null
      verified_at: null

  에어컨:
    status: candidate
    primary:
      - 에어컨 전기세
      - 에어컨 전기요금
      - 에어컨 절약
    related:
      - 인버터 에어컨
      - 적정 냉방온도
      - 에어컨 제습모드
      - 에어컨 곰팡이 냄새
      - 에어컨 필터 청소
    search_intent:
      - 정보 탐색
      - 비용 확인
      - 문제 해결
    verification:
      source: null
      verified_at: null

  장마철_습기관리:
    status: candidate
    primary:
      - 장마철 습기 관리
      - 집 습기 제거
      - 곰팡이 예방
    related:
      - 장마철 제습
      - 실내 환기
      - 결로 관리
      - 장마철 곰팡이
    search_intent:
      - 문제 해결
    verification:
      source: null
      verified_at: null


# Living Info Related Articles

Add verified living-info article titles and URLs here as the library grows.

- 장마철 집 습기 관리 방법: 곰팡이를 막는 5단계
- 에어컨 곰팡이 냄새, 필터만 청소하면 될까요?


# Article Task

Purpose: Define the prompt contract for article generation.

- Topic: `{{TOPIC}}`
- Audience: `{{AUDIENCE}}`
- Required outcome: Draft a clear, trustworthy article.

## Planning Gate

- The completed `# Approved Article Brief` is the authoritative editorial contract.
- Use its Target Reader, search intents, questions, promise, tone, pattern, analogy, CTA, risks, and fact-check notes throughout the draft.
- Use its Human Texture Guidance as recommendations only, not as facts.
- Do not infer or replace reader intent independently. If the Brief is incomplete or conflicts with verified facts, stop and flag the issue for planner/editor review.

## Human Texture Rules

- Prefer concrete expressions over vague ones.
- Include at least 3 scenes.
- Include at least 5 measurable numbers or concrete references.
- Include at least 5 sensory expressions.
- Do not fabricate facts.
- Mark illustrative examples explicitly.

## FAQ Format

- Write the FAQ section as clear question-and-answer pairs.
- Use `Q: 질문` on one line and `A: 답변` on the next line.
- Keep each answer practical, accurate, and directly responsive to its question.

## Keyword Library Policy

- Consult `knowledge/<series>/keyword-library.yaml` before choosing SEO
  keywords, tags, or keyword-based headings.
- Prefer only keywords marked `verified` in the library.
- A `candidate` keyword may be proposed for human review, but must not be
  presented as a verified SEO asset or forced unnaturally into the article.
- If no verified keyword matches the topic, use natural reader language and
  record proposed candidates separately for later validation.

## Related Articles

- Place a `## 함께 보면 좋은 상품` section before the related-articles section.
- Immediately below that heading, include this disclosure exactly: `이 글은 네이버 쇼핑 커넥트 활동의 일환으로, 상품 구매 시 일정액의 수수료를 받을 수 있습니다.`
- List only 1–2 product names that are directly relevant to the article's
  practical purpose. Do not include a product when it is not genuinely useful
  to the reader.
- Do not include prices, images, product descriptions, purchase links, or
  additional affiliate disclosures. The publisher will search for the final
  product and insert the Naver Brand Connect product card before publishing.
- Do not invent product names or recommendations. Use only product names
  supplied or verified by the publisher; otherwise leave this section empty.
- Follow it with a `## 함께 보면 좋은 글` section, then references.
- Select 2–3 genuinely relevant titles from `related-articles.md` when that
  library contains suitable articles.
- Do not invent URLs. If no verified URL is stored, list the title as plain
  text for the publisher to link on the blog platform.

## Final Draft Review

Before delivering the draft, review it once using this checklist.

- Confirm that every heading accurately describes the section immediately below it.
- Remove or qualify claims that are unsupported by a verified source.
- Confirm the product section contains only directly relevant product names and
  that the required Naver Shopping Connect disclosure appears immediately below
  its heading.
- Confirm related articles are relevant and that no URL has been invented.
- Open every reference link and remove any link that does not directly support
  the article or fails to load.
- Remove direct PDF and file-download links, including URLs ending in `.pdf`
  or containing `download.do`. Replace them with a verified, stable HTML
  landing page from the same source; if none exists, leave the source unlinked
  or omit it.


# User Input

Title: 대서 뜻과 시기, 가장 더운 절기에 챙길 생활수칙

# Approved Article Brief

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
