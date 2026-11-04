import { getCollection } from 'astro:content';
import { TRIP_DAYS, tripDateOf } from './tripDay';

/** Day 순서대로 일정을 돌려준다. 일정표 날짜가 여행 날짜 계산과 어긋나면 빌드를 멈춘다. */
export async function getDays() {
  const days = (await getCollection('itinerary')).sort((a, b) => a.data.day - b.data.day);
  const mismatch = days.length !== TRIP_DAYS || days.some((d) => d.data.date !== tripDateOf(d.data.day));
  if (mismatch) {
    throw new Error(
      `itinerary.yaml 날짜가 src/lib/tripDay.ts(TRIP_START_DATE, TRIP_DAYS)와 맞지 않아요: ` +
        days.map((d) => `Day ${d.data.day}=${d.data.date}`).join(', '),
    );
  }
  return days;
}

export type Period = 'morning' | 'afternoon' | 'evening';
export const PERIOD_LABEL: Record<Period, string> = { morning: '오전', afternoon: '오후', evening: '저녁' };

export interface Visit {
  day: number;
  date: string;
  period: Period;
}

/**
 * 일정에서 참조된 명소 = "가는 곳". 첫 등장 순서대로, 처음 가는 날과 시간대를 함께 돌려준다.
 */
export async function getVisitedLandmarks() {
  const visited = new Map<string, Visit>();
  for (const day of await getDays()) {
    for (const item of day.data.items) {
      if (item.landmark && !visited.has(item.landmark.id)) {
        visited.set(item.landmark.id, { day: day.data.day, date: day.data.date, period: item.period });
      }
    }
  }
  return visited;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function dateParts(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return { m, d, weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] };
}

/** "2026-11-05" → "11월 5일 (목)" */
export function formatDate(isoDate: string) {
  const { m, d, weekday } = dateParts(isoDate);
  return `${m}월 ${d}일 (${weekday})`;
}

/** "2026-11-05" → "11월 5일 목요일" */
export function formatDateLong(isoDate: string) {
  const { m, d, weekday } = dateParts(isoDate);
  return `${m}월 ${d}일 ${weekday}요일`;
}

/** "2026-11-05" → "5일 목" */
export function formatDayShort(isoDate: string) {
  const { d, weekday } = dateParts(isoDate);
  return `${d}일 ${weekday}`;
}
