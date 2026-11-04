# 교토여행 (sh-trip)

가족용 교토 여행 PWA (2026-11-05 ~ 11-08). Spec: GitHub issue #1.
정적 Astro 사이트 + `@vite-pwa/astro`(v2, named export `AstroPWAIntegration`). 백엔드 없음.

## 구조

- 탭 3개: `일정`(`/`), `교토 명소`(`/landmarks/`), `일본 기본`(`/basics/`)
- 콘텐츠는 `src/content/`, 스키마는 `src/content.config.ts`
  - 일정(`itinerary.yaml`)이 명소를 `landmark: <id>`로 참조하면 그 명소가 "우리가 가는 곳"이 된다. 별도 플래그 없음.
- 여행 날짜 계산(`src/lib/tripDay.ts`)은 항상 JST 기준. 유일한 테스트 seam.
- `trailingSlash: 'always'`: 내부 링크는 항상 `/`로 끝낸다(오프라인 precache 키와 일치해야 함).

## 명령

- `npm run dev` (백그라운드: `npx astro dev --background`, `astro dev stop|status|logs`)
- `npm test` / `npm run check` / `npm run build`

## 콘텐츠 원칙

- 독자는 일본이 처음인 부모님. 해요체, 큰 글씨.
- public 저장소: 예약자명, 연락처, 예약번호 등 개인정보 금지.

## Agent skills

### Issue tracker

GitHub Issues on akfangus/sh-trip via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.
