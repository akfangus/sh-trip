/**
 * 지금 시각. 주소에 ?now=2026-11-06T13:00 처럼 붙이면 그 일본 시각으로 화면을 미리 볼 수 있다.
 * (시간대를 적지 않으면 일본 시간으로 본다)
 */
export function currentTime(): Date {
  const param = new URLSearchParams(location.search).get('now');
  if (param) {
    const withZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(param) ? param : `${param}+09:00`;
    const t = new Date(withZone);
    if (!Number.isNaN(t.getTime())) return t;
  }
  return new Date();
}
