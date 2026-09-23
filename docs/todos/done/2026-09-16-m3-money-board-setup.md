# m3 — 설정 화면 + 금액 입력 다이얼로그

## 목적

게임 시작 전 **은행 금액(지정 또는 무한대)** 과 **플레이어**를 설정하는 화면, 그리고 거래·잔액 변경 때 쓰는 금액 입력창.

## 작업범위 (이 파일들만)

- `app/components/money-board/MoneyBoardSetup.vue` (신규)
- `app/components/money-board/AmountDialog.vue` (신규)

## 계약 — MoneyBoardSetup

- C1. **플레이어 구조는 부자만들기 설정 화면과 동일**하게(`app/pages/games/rich/index.vue` 의 `STAGE.PREPARE` 템플릿 참고):
  "플레이어 N" 제목 + 이름 input(지우기 X 버튼 포함) + 삭제 버튼(`tiny-del-btn`) → 색 선택(`tools-color-selector`) →
  시작 금액(`NumberSetter`) → 구분선. 하단에 추가(`tiny-btn`) · 완료(`tiny-btn`) 버튼.
  부자만들기의 **미리 정의된 이름 태그(preDefinedPlayers)는 제외**(부자만들기 데이터 전용).
- C2. 새 플레이어 추가 시 기본값도 부자만들기와 동일: 이름 `Player{N}`, 색 `bg-blue-400`, 시작 금액은 **첫 플레이어 금액 복사**.
  화면 진입 시 플레이어 1명이 이미 있다.
- C3. **은행 섹션**: 이름 input(기본 "은행") · 색 선택(`tools-color-selector :is-mono="true"`, 기본 `bg-gray-500`) ·
  **무한대 스위치**(`el-switch`, 기본 켜짐) · 스위치가 꺼졌을 때만 `NumberSetter` 로 금액 지정.
- C4. 완료 시 `start(actors)` emit. 배열 첫 원소가 은행(`isBank: true`, 무한대면 `balance: Number.POSITIVE_INFINITY`),
  그 뒤가 플레이어(`isBank: false`). 플레이어가 0명이면 완료 버튼 비활성.
- C5. `tools-color-selector`·`NumberSetter` 는 **재사용만** 한다(수정 금지, t1 소유). 부자만들기처럼 이벤트로 값 반영.
- C6. 이 컴포넌트는 설정 중 상태를 **로컬에 들고 있다가** 완료 때 한 번에 emit 한다(`useMoneyBoard` 호출 금지).

## 계약 — AmountDialog

- C7. `el-dialog` + 기존 `app/components/tools/Calculator.vue` 재사용. `Calculator` 는 `ref` 로 잡아
  `getNum()` 으로 값을 읽는다(부자만들기 `doneUseCalc` 와 같은 방식). **Calculator 수정 금지.**
- C8. 제목(`title` prop) 표시, 하단에 확인 버튼. 확인 → `confirm(amount)` emit 후 닫힘. 취소/바깥 클릭 → 닫힘만.
- C9. 모바일에서 다이얼로그가 화면을 넘지 않게(`width` 를 `min(22rem, 92vw)` 류로).
- C10. 열릴 때마다 계산기가 초기 상태여야 한다(이전 입력 잔존 금지 — `v-if` 로 매번 새로 마운트하거나 `destroy-on-close`).

## 제외범위

- 보드·화살표(m2). 히스토리(m4). 상태 엔진(m1). 사운드. 단위 선택(`UnitSelector`) — 범용 도구에서 제외.
- 부자만들기 파일·공용 tools 컴포넌트 수정.

## 공통 규율 (모든 money-board lane)

- 타입은 `app/types/MoneyBoardTypes.ts` 가 **단일 출처**다. **수정 금지** — 부족하면 PL에 보고.
- 컴포넌트 간 연결은 아래 "인터페이스 계약" 표를 그대로 따른다. 다른 lane 이 같은 표를 보고 동시에 작업한다.
- Nuxt auto-import 사용(`ref`·`computed`·`useUtils` 등 수동 import 금지). 컴포넌트는 `~/components/money-board/X.vue` 로 **명시 import**(부자만들기와 같은 방식).
- 색은 UnoCSS 토큰 또는 `app/assets/scss/shell.scss` 의 `--shell-*` 변수. **hex 하드코딩 금지.** 라이트/다크 둘 다 성립해야 한다.
- SSR 안전: `window`·`document`·`ResizeObserver`·`elementFromPoint` 는 이벤트 핸들러나 `onMounted` 안에서만.
- 템플릿에 로직 금지 — 조건·계산은 이름 붙은 `computed` 로.
- UI 문구 한국어. 내부 id 화면 노출 금지. 금액은 `toLocaleString()`, 무한대는 `∞`.
- 모바일 폭(360px)에서 깨지지 않아야 한다.
- **커밋 금지. git 상태 변경 금지**(add/commit/checkout/stash). PL이 통합 커밋한다.
- **`pnpm generate` 실행 금지**(`.output/` 충돌). PL이 통합 때 한 번 돌린다. dev 서버도 새로 띄우지 마라.
- 검증은 `CI=true pnpm exec eslint <내 파일>`. `CI=true` 없으면 일부 규칙이 꺼진다.
- `pnpm typecheck` 는 저장소 전체를 본다. 다른 lane 이 작업 중이라 **아직 없는 파일 에러가 나올 수 있다** — 내 파일 에러만 확인한다.
- 죽은 코드·추측성 추상화 금지. 안 쓰는 prop, "나중을 위한" 옵션 만들지 않는다.

## 인터페이스 계약 (전 lane 공통 — 페이지는 PL이 이 표대로 조립한다)

| 소유 | 파일                                         | props / v-model                                                           | emits                                                                                               |
| ---- | -------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| m1   | `composables/useMoneyBoard.ts`               | —                                                                         | 반환: `actors`, `histories`, `addActor`, `removeActor`, `transfer`, `setBalance`, `revert`, `reset` |
| m2   | `components/money-board/MoneyBoard.vue`      | `actors: MoneyActor[]`                                                    | `transfer(fromId, toId)` · `select(actorId)`                                                        |
| m3   | `components/money-board/MoneyBoardSetup.vue` | —                                                                         | `start(actors: Omit<MoneyActor, 'id'>[])`                                                           |
| m3   | `components/money-board/AmountDialog.vue`    | `v-model:open: boolean` · `title: string`                                 | `confirm(amount: number)`                                                                           |
| m4   | `components/money-board/HistoryPanel.vue`    | `v-model:open: boolean` · `histories: MoneyTx[]` · `actors: MoneyActor[]` | `revert(txId)`                                                                                      |

## 보고

① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것

## 검증

```bash
CI=true pnpm exec eslint app/components/money-board/MoneyBoardSetup.vue app/components/money-board/AmountDialog.vue
pnpm typecheck
```
