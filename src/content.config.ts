import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** 교토 명소 해설. 본문(Markdown) = 역사 이야기. */
const landmarks = defineCollection({
  loader: glob({ base: './src/content/landmarks', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      nameKo: z.string(),
      nameJa: z.string(),
      /** 한 줄 요약 */
      summary: z.string(),
      /** 여기서 꼭 볼 것 (3~5) */
      highlights: z.array(z.string()).min(3).max(5),
      /** 알아두면 재밌는 이야기 (1~2) */
      anecdotes: z.array(z.string()).min(1).max(2),
      hours: z.string(),
      fee: z.string(),
      mapsUrl: z.url(),
      image: image(),
      imageCredit: z.object({
        author: z.string(),
        license: z.string(),
        sourceUrl: z.url(),
      }),
      /** 더 깊이 알아보기 ①: 시대별 역사 */
      history: z
        .object({
          title: z.string(),
          subtitle: z.string(),
          eras: z
            .array(z.object({ era: z.string(), year: z.string(), text: z.string() }))
            .min(3)
            .max(8),
        }),
      /** 더 깊이 알아보기 ②③: 재밌는 이야기 */
      stories: z
        .array(
          z.object({
            title: z.string(),
            subtitle: z.string(),
            body: z.string(),
            /** 전설인지 기록인지 밝히는 출처 한 줄 */
            source: z.string(),
          }),
        )
        .length(2),
    }),
});

const itemStatus = z.enum([
  /** 예약 확정: 시각 + 예약 표시 + 구글맵 버튼 */
  'reserved',
  /** 정시(비행기, 하루카): 시각 표시 */
  'fixed',
  /** 예정: 시각 없이 시간대 칸 안에 순서대로 */
  'planned',
]);

/** 하루를 나누는 칸 */
export const PERIODS = ['morning', 'afternoon', 'evening'] as const;

/** 일자별 일정. 명소를 참조하면 그 명소가 "가는 곳"이 된다. */
const itinerary = defineCollection({
  loader: file('./src/content/itinerary.yaml'),
  schema: z.object({
    day: z.number().int().min(1).max(4),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    title: z.string(),
    items: z.array(
      z.object({
        period: z.enum(PERIODS),
        /** 가는 곳(place) / 먹는 것(meal) / 큰 이동(move) */
        kind: z.enum(['place', 'meal', 'move']),
        title: z.string(),
        status: itemStatus,
        /** 예약·정시 항목만: "18:00" */
        time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        /** 장소 구성, 메뉴 등 한 줄 설명 */
        detail: z.string().optional(),
        /** 행동에 도움이 되는 메모 */
        note: z.string().optional(),
        landmark: reference('landmarks').optional(),
        mapsUrl: z.url().optional(),
      }),
    ),
  }),
});

/** 보여주는 일본어 카드 분류. 화면에도 이 순서로 나온다. */
export const PHRASE_CATEGORIES = ['기본', '식당', '교통', '쇼핑', '도움'] as const;

/** 보여주는 일본어 카드 */
const phrases = defineCollection({
  loader: file('./src/content/phrases.yaml'),
  schema: z.object({
    ja: z.string(),
    ko: z.string(),
    /** 한글 발음 */
    reading: z.string().optional(),
    category: z.enum(PHRASE_CATEGORIES),
  }),
});

/** 일본 기본 가이드 카드. 본문(Markdown) = 3~5줄 설명. */
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    /** 홈 등 목록에 쓰는 한 줄 요약 */
    summary: z.string(),
    emoji: z.string(),
    order: z.number(),
  }),
});

/** 숙소 카드 (택시 기사에게 보여주기) */
const lodging = defineCollection({
  loader: file('./src/content/lodging.yaml'),
  schema: z.object({
    nameKo: z.string(),
    nameJa: z.string(),
    addressJa: z.string(),
    mapsUrl: z.url(),
    checkIn: z.string(),
    checkOut: z.string(),
    access: z.array(z.string()),
  }),
});

export const collections = { landmarks, itinerary, phrases, guides, lodging };
