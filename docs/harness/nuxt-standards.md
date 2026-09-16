# Nuxt/Vue 개발 표준 (모든 lane 공통)

Nuxt 4(compat) · Vue 3 `<script setup>` · TypeScript · UnoCSS · Element Plus · Pinia · SCSS.
목표: **게임 단위로 넣고 빼기 쉬움 · 타입 안전 · 정적 생성 가능 · 사람 친화 UI**.

## 디렉터리 계약

- `app/pages/` — 라우팅. 페이지는 **조립만** 한다(데이터 가져오고 컴포넌트 배치).
- `app/components/layout/` — 앱 셸(헤더·푸터·드로어). `l1` 소유, 게임이 건드리지 않는다.
- `app/components/tools/` — 여러 게임이 쓰는 공용 위젯. 특정 게임 전용이면 여기 두지 않는다.
- `app/composables/` — 상태·로직·인프라. 화면 없는 로직은 전부 여기.
- `app/types/` · `app/constants/` — 타입/enum/상수. 게임 간 공유되는 것만.
- `app/assets/scss/` — 전역 스타일. `shell.scss`가 테마 CSS 변수의 단일 출처.

Nuxt auto-import를 쓴다(`ref`·`computed`·composable·컴포넌트). 수동 import 로 중복시키지 않는다.
교차 폴더 import 는 `~/` alias, 형제 파일은 상대경로.

## 컴포넌트 규율

- `<script setup lang="ts">` + `defineProps`/`defineEmits` 에 타입 명시. `any` 지양.
- **템플릿에 로직 금지.** 조건·계산은 `computed`로 이름을 붙여 올린다.
- 컴포넌트는 작게. props 로 받고 emit 으로 알린다 — 부모의 상태를 직접 수정하지 않는다.
- 점수 계산·판정 같은 게임 규칙은 **순수 함수**(`composables/` 또는 `utils`)로 빼서
  화면 없이 콘솔/노드로 확인 가능하게 한다.

## SSR · 정적 생성 (자주 깨지는 곳)

- `ssr: true` + `nitro.prerender.crawlLinks` → 빌드가 모든 페이지를 **서버에서 한 번 렌더**한다.
- `window`·`document`·`localStorage`·`indexedDB`·`Audio`는 서버에 없다.
  setup 최상단에서 만지지 말고 `onMounted` 또는 `import.meta.client` 가드 안에서, 또는 VueUse 경유.
- 브라우저 전용 UI는 `<ClientOnly>` 로 감싼다.
- **코드 고치면 `pnpm generate` 까지 돌린다.** dev 에서만 되는 건 완료가 아니다.

## 스타일

1. UnoCSS 유틸 / `uno.config.ts` shortcut(`btn`·`icon-btn`·`calc-border` …)
2. Element Plus 컴포넌트 + 그 CSS 변수(`--el-*`)
3. 그래도 안 되면 `<style scoped>`

- 색은 `shell.scss`의 `--shell-*` 변수나 Uno 토큰으로. 컴포넌트에 hex 하드코딩 금지.
- 다크모드는 `html.dark` (`@nuxtjs/color-mode`, `classSuffix: ''`). 새 색은 라이트/다크 **둘 다** 정의.
- SCSS 는 `@use` 만 쓴다(`@import` 는 Dart Sass 3.0 에서 제거).
- 새 전역 shortcut·CSS 변수 추가는 `l1`/`x1` 소유.

## 상태

- 게임 내부 상태는 컴포넌트/composable 의 `ref`·`reactive`.
- 게임을 넘나드는 설정(통화 단위 등)만 pinia store(`defineStore` + setup 문법 + `acceptHMRUpdate`).
- 영속은 `useIndexedDB`. 저장/복구 실패를 무시하지 말고 사용자에게 알리거나 `useLogger`로 남긴다.

## 검증 (코드 바꾸면 반드시)

```bash
pnpm lint       # eslint --fix 필요하면 pnpm lint --fix
pnpm typecheck  # vue-tsc --noEmit
pnpm generate   # prerender 통과까지
```

### 현재 baseline (2026-09-16 측정)

- `pnpm generate` — **통과** (11 routes prerender). 이건 깨뜨리면 안 되는 선이다.
- `pnpm lint` — 61 errors / 16 warnings (대부분 `--fix` 가능). **기존 부채.**
- `pnpm typecheck` — 8 errors (`@vueuse/sound` 타입 해석 실패, `rich/index.vue` undefined 접근). **기존 부채.**

규칙: 새 작업은 **baseline 수치를 늘리지 않는다.** 만진 파일의 lint/type 에러는 그 lane에서 정리한다.
전체 청소는 `x1` lane 계약서로 따로 처리한다.

자동 테스트 러너는 없다. 비자명 로직은 순수 함수로 분리하고, 화면 확인 결과를 보고에 적는다.
테스트 러너 도입이 필요해지면 `x1` lane 계약서로 처리한다 — 미리 깔지 않는다.

## 코드 규율

- 죽은 코드·추측성 추상화 금지. 필요할 때 추가한다.
- 구현 하나뿐인 인터페이스, 안 바뀌는 값의 config, "나중을 위한" 스캐폴딩 금지.
- UI 문구는 한국어. 내부 식별자·개발용어를 화면에 노출하지 않는다.
- 커밋 규칙은 [`commit-message.md`](./commit-message.md), 작업 운영은 [`pl-request.md`](./pl-request.md).
