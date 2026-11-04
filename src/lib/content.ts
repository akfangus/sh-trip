import { getCollection } from 'astro:content';

export async function getDays() {
  const days = await getCollection('itinerary');
  return days.sort((a, b) => a.data.day - b.data.day);
}

/**
 * 일정에서 참조된 명소 = "가는 곳". 첫 등장 순서대로, 처음 나오는 Day와 함께 돌려준다.
 */
export async function getVisitedLandmarks() {
  const visited = new Map<string, number>();
  for (const day of await getDays()) {
    for (const item of day.data.items) {
      if (item.landmark && !visited.has(item.landmark.id)) {
        visited.set(item.landmark.id, day.data.day);
      }
    }
  }
  return visited;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** "2026-11-05" → "11월 5일 (목)" */
export function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}월 ${d}일 (${weekday})`;
}
