export type TripDay = { kind: 'day'; day: number } | { kind: 'before' } | { kind: 'after' };

const DAY_MS = 24 * 60 * 60 * 1000;
/** 일본 시간은 UTC+9 고정(서머타임 없음) */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
/** Day 1 = 2026-11-05 (JST) */
const TRIP_START_JST_DATE_MS = Date.UTC(2026, 10, 5);
const TRIP_DAYS = 4;

/** 어떤 시각이 일본 날짜 기준으로 여행 며칠째인지 돌려준다. */
export function tripDayOf(instant: Date): TripDay {
  const jstDateMs = Math.floor((instant.getTime() + JST_OFFSET_MS) / DAY_MS) * DAY_MS;
  const day = (jstDateMs - TRIP_START_JST_DATE_MS) / DAY_MS + 1;
  if (day < 1) return { kind: 'before' };
  if (day > TRIP_DAYS) return { kind: 'after' };
  return { kind: 'day', day };
}
