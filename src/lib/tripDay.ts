export type TripDay =
  | { kind: 'day'; day: number }
  | { kind: 'before'; daysLeft: number }
  | { kind: 'after' };

const DAY_MS = 24 * 60 * 60 * 1000;
/** 일본 시간은 UTC+9 고정(서머타임 없음) */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
/** 여행 첫날(Day 1)의 일본 날짜. 일정표(itinerary.yaml)의 날짜는 빌드 때 이 값과 맞는지 검사한다. */
export const TRIP_START_DATE = '2026-11-05';
export const TRIP_DAYS = 4;
const TRIP_START_JST_DATE_MS = Date.parse(`${TRIP_START_DATE}T00:00:00Z`);

/** Day N의 일본 날짜("YYYY-MM-DD") */
export function tripDateOf(day: number) {
  return new Date(TRIP_START_JST_DATE_MS + (day - 1) * DAY_MS).toISOString().slice(0, 10);
}

/** 어떤 시각이 일본 날짜 기준으로 여행 며칠째인지 돌려준다. */
export function tripDayOf(instant: Date): TripDay {
  const jstDateMs = Math.floor((instant.getTime() + JST_OFFSET_MS) / DAY_MS) * DAY_MS;
  const day = (jstDateMs - TRIP_START_JST_DATE_MS) / DAY_MS + 1;
  if (day < 1) return { kind: 'before', daysLeft: 1 - day };
  if (day > TRIP_DAYS) return { kind: 'after' };
  return { kind: 'day', day };
}

export type DayPeriod = 'morning' | 'afternoon' | 'evening';

/** 어떤 시각이 일본 시간으로 오전(~12시) / 오후(12~17시) / 저녁(17시~)인지 돌려준다. */
export function periodOf(instant: Date): DayPeriod {
  const jstHour = new Date(instant.getTime() + JST_OFFSET_MS).getUTCHours();
  if (jstHour < 12) return 'morning';
  if (jstHour < 17) return 'afternoon';
  return 'evening';
}
