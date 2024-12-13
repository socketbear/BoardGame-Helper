import { appDescription } from './app/constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@element-plus/nuxt',
  ],
  ssr: true,

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/board-icon.svg', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/board-icon.svg' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
      script: [
        {
          children: 'if (navigator.serviceWorker) { navigator.serviceWorker.getRegistrations().then(function(registrations) { for(let registration of registrations) { registration.unregister() } }) }',
          type: 'text/javascript',
        },
      ],
    },
    // SPA 모드에서의 로딩 화면 설정 (선택사항)
    // pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: [
    '@unocss/reset/tailwind.css',
    'element-plus/theme-chalk/dark/css-vars.css',
    '~/assets/scss/main.scss',
  ],

  colorMode: {
    classSuffix: '',
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: true, // 발견 된 모든 페이지는 사전 빌드됨 (aka. SSG 모드)
      routes: ['/'], // 미리 렌더링 할 경로 목록, crawlLinks 가 true 일 때, 가장 먼저 빌드됨 (반드시 포함)
      // ignore: ['/hi'], // 미리 렌더링 하지 않을 경로 목록
    },
  },
  vite: {
    optimizeDeps: {
      include: ['howler'],
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
})
