# PL Request — 작업 운영 하네스 (Nuxt 4 + Vue 3)

**이 문서가 사용자와의 소통 창구다.** 개발팀장(사용자)의 지시를 받아 PL이 **작업계약서**를 쓰고
lane별 서브 개발자에게 맡긴 뒤, 산출물을 **통합·검증**한다.
PL은 직접 대량 구현하지 않고 계약·검수·통합을 책임진다.

## Lane (파일 충돌 없게 영역 분리)

> 이 표는 **누적 기록**이다 — 끝난 lane도 "그때 그 파일을 누가 소유했나"를 남기려고 지우지 않는다.

| lane | 영역                                                                                                          | 소유                       |
| ---- | ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `s1` | `app/types/` · `app/constants/` — 타입·enum·네비게이션/메타 상수                                              | 공유 계약                  |
| `c1` | `app/composables/` — IndexedDB·로거·유틸·pinia 스토어(게임 무관 인프라)                                       | 공통 인프라                |
| `l1` | `app/layouts/` · `app/components/layout/` · `app/assets/scss/` · `app/app.vue`                                | 앱 셸·테마                 |
| `t1` | `app/components/tools/` 공용(Calculator·NumberPad·NumberSetter·ColorSelector·UnitSelector)                    | 공용 툴 컴포넌트           |
| `g1` | `app/pages/games/rich/` + `components/tools/FinancialStatement/` + `types/Rich*` + `composables/data/rich.ts` | 부자만들기                 |
| `g2` | `app/pages/games/hanabi/` + `components/HanabiCard*.vue` + `types/HanabiTypes.ts`                             | 하나비                     |
| `g3` | `app/pages/games/fantasy-kingdom/`                                                                            | 판타지 왕국                |
| `g4` | `app/pages/games/seven-wonders-duel/`                                                                         | 세븐 원더스 듀얼           |
| `g5` | `app/pages/games/cascadia/` + `components/tools/CascadiaHistoryViewer.vue`                                    | 카스카디아                 |
| `p1` | `app/pages/index.vue` · `about.vue` · `[...all].vue` — 게임 외 페이지                                         | 일반 페이지                |
| `x1` | `nuxt.config.ts` · `uno.config.ts` · `eslint.config.js` · `netlify.toml` · `Dockerfile` · `package.json`      | 빌드·배포 설정             |
| `m1` | `app/utils/moneyLedger.ts` · `app/composables/useMoneyBoard.ts` · `test/moneyLedger.check.mjs`                | 머니 보드 엔진(거래·롤백)  |
| `m2` | `app/components/money-board/MoneyBoard.vue` · `MoneyBox.vue`                                                  | 머니 보드 화살표 드래그    |
| `m3` | `app/components/money-board/MoneyBoardSetup.vue` · `AmountDialog.vue`                                         | 머니 보드 설정·금액 입력   |
| `m4` | `app/components/money-board/HistoryPanel.vue`                                                                 | 머니 보드 히스토리·롤백    |
| `t2` | `app/pages/tools/` · `app/types/MoneyBoardTypes.ts` (PL 직접)                                                 | 범용 도구 페이지·타입 계약 |

### 진행 기록

| lane                     | 작업                                                                                                   | 상태                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `l1`                     | 앱 셸 레이아웃 개편(AppHeader/AppFooter/AppNavDrawer 분리, `game` 레이아웃, `shell.scss`)              | 완료 `refactor/app-shell-layout` |
| `x1`                     | `@vueuse/sound` TS7016 2건 — ambient d.ts 보정                                                         | 완료 `chore/x1-lint-typecheck`   |
| `g1`                     | rich TS2532 4건 · `no-alert`(라우터 가드) · FinancialStatement lint                                    | 완료 `chore/x1-lint-typecheck`   |
| `g2`                     | 하나비 TS2345 2건(`StyleValue` 좁히기) · lint                                                          | 완료 `chore/x1-lint-typecheck`   |
| `g4`                     | 세븐원더스 lint                                                                                        | 완료 `chore/x1-lint-typecheck`   |
| `g3`·`g5`·`l1`·`p1`·`c1` | 포맷팅 부채(PL 직접 `eslint --fix`)                                                                    | 완료 `chore/x1-lint-typecheck`   |
| `s1`                     | `HanabiTypes.PopoverItem.style?: object` → `CSSProperties`(g2의 `buttonStyle` 헬퍼 제거 가능)          | 대기                             |
| `g2`                     | `HanabiCard.vue` scoped CSS hex 하드코딩 · 다크모드 미대응                                             | 대기                             |
| `m1`~`m4`·`t2`           | 범용 머니 보드(`/tools/money-board`) — 화살표 송금·잔액 변경·단건 롤백                                 | 완료 `feat/money-board`          |
| `x1`                     | 재사용 `Calculator.vue` 의 `bg-white` 하드코딩 — 다크모드에서 계산기만 밝음(부자만들기·머니 보드 공통) | 대기                             |

### 선후 관계

- `s1`(타입·상수) 선행 → 나머지. `c1`(composable) → 이를 쓰는 게임 lane.
- `l1`(셸) → 페이지 lane(`p1`, `g*`). 레이아웃 계약이 바뀌면 페이지가 따라간다.
- 게임 lane `g1`~`g5`는 파일 범위가 완전히 분리 → **항상 병렬 가능**.
- 한 계약서 = 한 lane = 좁은 파일 범위. 계약에 **작업범위·계약·제외범위·검증·보고** 명시.

## 작업계약서 형식

`docs/todos/YYYY-MM-DD-<lane>-<slug>.md`. 완료·검증되면 `docs/todos/done/` 로 이동.
필수 절: 목적 / 작업범위(파일) / 계약(C1..) / 제외범위 / 검증(명령) / 보고(4항목).

보고 4항목: **① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것**.

## 검수(리뷰) 체크리스트 — PL이 통합 때 확인

1. **컴포넌트 경계 (강조)**: 게임 lane이 다른 게임의 컴포넌트·타입을 직접 안 쓴다. 공용이 필요하면
   `t1`(공용 툴) 또는 `c1`(composable)로 올리고 계약서에 명시. 게임 하나를 통째로 빼도 나머지가 안 깨져야 한다.
2. **SSR/prerender 안전 (강조)**: `ssr: true` + `crawlLinks` 정적 생성이다. `window`·`document`·
   `localStorage`·`indexedDB`를 setup 최상단에서 직접 만지지 않는다 → `onMounted`/`import.meta.client`/
   VueUse 경유. `pnpm generate`가 깨지면 그 lane은 미완성.
3. **다크모드**: 색은 `app/assets/scss/shell.scss`의 `--shell-*` CSS 변수 또는 UnoCSS 토큰으로.
   컴포넌트에 색 하드코딩 금지. 라이트/다크 둘 다 눈으로 확인.
4. **스타일 우선순위**: UnoCSS 유틸/shortcut → Element Plus 컴포넌트 → 그래도 안 되면 scoped CSS.
   전역 CSS 추가는 `l1` 소유이고 계약서에 이유를 쓴다.
5. **상태·로직 분리**: 템플릿에 계산 로직 금지. 점수 계산·판정은 순수 함수나 composable로 빼서
   화면 없이 검증 가능하게. 게임 간 공유 상태는 pinia.
6. **사람 친화 UI**: 한국어, 개발용어·내부 식별자 노출 금지. 모바일 폭에서 깨지지 않게.
7. **조용한 실패 금지**: IndexedDB 저장 실패·복구 실패 등은 사용자에게 보이게 하거나 `useLogger`로 남긴다.
8. **죽은 코드**: 개편으로 안 쓰이게 된 컴포넌트(`Header.vue`·`Footer.vue` 등)는 지우고 계약서에 적는다.

## 통합·검증 규율

- 서브 보고를 그대로 믿지 않는다. PL이 실제로 아래를 돌려 재확인한다.

  ```bash
  CI=true pnpm lint      # CI=true 필수 — 없으면 에디터 감지로 unused-imports 등 일부 규칙이 꺼진다
  pnpm typecheck
  pnpm generate   # prerender 까지 통과해야 완료 (현재 통과 중 — 깨뜨리면 반려)
  ```

- **2026-09-16 부로 세 관문 모두 0건이다.** baseline 은 이제 "늘리지 않기"가 아니라 **0 유지**다.
- **서브 agent 에게 `pnpm generate` 를 금지한다**(`.output/` 동시 쓰기 충돌). PL 이 통합 때 한 번만 돌린다.
  agent 에게는 `CI=true pnpm exec eslint <자기 파일>` 로 범위를 좁혀 돌리게 한다.
- `pnpm generate` 는 `.nuxt/` 를 dev 서버와 공유한다. 통합 검증 중 dev 서버가 떠 있었다면 재시작한다.

- 자동 테스트 러너는 아직 없다. 비자명한 점수 계산 로직은 순수 함수로 빼고,
  최소한 `pnpm dev` 로 해당 화면을 직접 눌러 확인한 결과를 보고에 쓴다.
  (테스트 러너가 필요해지면 그때 `x1` lane에서 도입한다 — 미리 깔지 않는다.)
- **PL 이 쓴 문서(계약서·하네스)도 lint 대상이다.** 마크다운 표·코드블록이 prettier 규칙에 걸린다. 계약서 발급 직후 `CI=true pnpm lint --fix` 를 돌린다.
- `.output/`·`.nuxt/`·`dist/`·`.DS_Store` 커밋 금지.
- 커밋 규칙은 [`commit-message.md`](./commit-message.md), 코드 표준은 [`nuxt-standards.md`](./nuxt-standards.md).

## PL이 사용자에게 보고하는 방식

- **막히면 추측해서 진행하지 않고 보고한다** — 무엇이 없어서/모호해서 막혔는지, 선택지 2개 이내로.
- 끝났으면 "한 일 / 검증 명령과 결과 / 남은 것" 세 줄. 장문 금지.
