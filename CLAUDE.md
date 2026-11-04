# 교토여행 (sh-trip)

가족용 교토 여행 PWA (2026-11-05 ~ 11-08). Spec: GitHub issue #1.
정적 Astro 사이트 + `@vite-pwa/astro`(v2, named export `AstroPWAIntegration`). 백엔드 없음.

## 구조

- 탭 4개: `홈`(`/`), `일정`(`/itinerary/`, `#dayN`으로 날짜 선택), `교토 명소`(`/landmarks/`), `일본 기본`(`/basics/`, 숙소 카드는 `#hotel`)
- 디자인 토큰과 공통 스타일은 `src/layouts/Base.astro`의 전역 style 하나에 있다
- 콘텐츠는 `src/content/`, 스키마는 `src/content.config.ts`
  - 일정(`itinerary.yaml`)은 오전/오후/저녁(`period`) 칸으로 묶고, 시각(`time`)은 예약·비행기·하루카에만 쓴다.
  - 일정이 명소를 `landmark: <id>`로 참조하면 그 명소가 "우리가 가는 곳"이 되고, 상세의 "○일째 ○○에 가요"도 여기서 계산된다. 별도 플래그 없음.
  - 명소의 "더 깊이 알아보기"(`history` 시대별 연표 + `stories` 2개)는 필수다.
- 여행 날짜 계산(`src/lib/tripDay.ts`)은 항상 JST 기준. 유일한 테스트 seam.
- `trailingSlash: 'always'`: 내부 링크는 항상 `/`로 끝낸다(오프라인 precache 키와 일치해야 함).

## 명령

- dev 서버는 백그라운드로: `npx astro dev --background` (`astro dev stop|status|logs`)
- `astro preview`는 한 번 띄우면 계속 살아 있고, 다시 실행해도 새 포트로 뜨지 않는다. 확인: `npx astro preview status`, 종료: `npx astro preview stop`
- `npm run build`는 테스트와 타입 검사까지 돌린다. Vercel 배포도 이 명령을 쓰므로 검사가 실패하면 배포되지 않는다.
- 폰 폭 화면 확인: `scripts/screenshot.sh <경로> [out.png]` (dev/preview 서버가 떠 있어야 함)

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
