import { describe, expect, it } from 'vitest';
import { tripDayOf } from './tripDay';

describe('tripDayOf', () => {
  it('11/5 낮(일본 시간)은 Day 1', () => {
    expect(tripDayOf(new Date('2026-11-05T12:00:00+09:00'))).toEqual({ kind: 'day', day: 1 });
  });

  it('11/6 낮(일본 시간)은 Day 2', () => {
    expect(tripDayOf(new Date('2026-11-06T12:00:00+09:00'))).toEqual({ kind: 'day', day: 2 });
  });

  it('출발 전날(11/4 밤, 일본 시간)은 여행 전', () => {
    expect(tripDayOf(new Date('2026-11-04T23:59:00+09:00'))).toMatchObject({ kind: 'before' });
  });

  it('귀국 다음 날(11/9 0시, 일본 시간)은 여행 후', () => {
    expect(tripDayOf(new Date('2026-11-09T00:00:00+09:00'))).toEqual({ kind: 'after' });
  });

  it('일본 자정을 넘기면 다음 날로 바뀐다 (UTC로 표현된 시각)', () => {
    // 2026-11-05 14:59 UTC = 11/5 23:59 JST, 15:00 UTC = 11/6 00:00 JST
    expect(tripDayOf(new Date('2026-11-05T14:59:00Z'))).toEqual({ kind: 'day', day: 1 });
    expect(tripDayOf(new Date('2026-11-05T15:00:00Z'))).toEqual({ kind: 'day', day: 2 });
  });

  it('마지막 날 밤 늦게까지 Day 4', () => {
    expect(tripDayOf(new Date('2026-11-08T23:59:00+09:00'))).toEqual({ kind: 'day', day: 4 });
  });

  it('출발일 0시(일본 시간)부터 Day 1', () => {
    expect(tripDayOf(new Date('2026-11-05T00:00:00+09:00'))).toEqual({ kind: 'day', day: 1 });
  });

  it('여행 전에는 출발까지 남은 날 수(D-day)를 알려준다', () => {
    expect(tripDayOf(new Date('2026-11-04T08:00:00+09:00'))).toEqual({ kind: 'before', daysLeft: 1 });
    expect(tripDayOf(new Date('2026-11-01T23:59:00+09:00'))).toEqual({ kind: 'before', daysLeft: 4 });
  });
});
