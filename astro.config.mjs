// @ts-check
import { AstroPWAIntegration } from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

// 모든 페이지가 /path/index.html 로 빌드되고, 링크는 항상 끝에 / 를 붙인다.
// 서비스워커 precache 키(/path/)와 실제 이동 URL이 같아야 오프라인에서도 열린다.
export default defineConfig({
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    AstroPWAIntegration({
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: {
        name: '교토여행',
        short_name: '교토여행',
        description: '우리 가족 교토 여행 안내 (2026.11.5~11.8)',
        lang: 'ko',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#e6e7e6',
        theme_color: '#e6e7e6',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 앱 전체(페이지, 이미지 포함)를 미리 받아 두어 현지에서 데이터 없이도 보이게 한다.
        globPatterns: ['**/*.{html,js,css,svg,png,jpg,jpeg,webp,avif,ico,txt,woff2}'],
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        // 본문 웹폰트(Pretendard, jsDelivr)는 처음 받을 때 저장해 두고 이후 오프라인에서 쓴다.
        // 제목 서체는 public/fonts 에 들어 있어 위 globPatterns 로 미리 받는다.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/gh\/orioncactus\/pretendard.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pretendard',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      experimental: { directoryAndTrailingSlashHandler: true },
    }),
  ],
});
