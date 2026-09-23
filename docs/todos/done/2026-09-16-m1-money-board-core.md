# m1 — 머니 보드 상태·거래·롤백 엔진

> **통합 정정 (PL)**: `removeActor` 는 호출처가 없어 통합 때 삭제했다. 진행 중에는 참가자를 지울 수 없는 구조(설정 화면에서만 삭제)라
> "삭제된 참가자의 거래 취소" 경우도 생기지 않는다.

## 목적

보드의 **모든 잔액 변화와 롤백**을 담당한다. 화면 없이 검증되는 순수 로직 + 얇은 반응형 래퍼.

## 작업범위 (이 파일들만)

- `app/utils/moneyLedger.ts` (신규) — **순수 함수만.** Vue·Nuxt 의존 0.
- `app/composables/useMoneyBoard.ts` (신규) — `moneyLedger` 를 감싼 반응형 상태.
- `test/moneyLedger.check.mjs` (신규) — 실행 가능한 self-check.

## 계약

- C1. `moneyLedger.ts` 는 Vue/Nuxt 를 import 하지 않는다. 타입은 `import type` 만(상대경로 `../types/MoneyBoardTypes`).
  `enum`·`namespace` 금지(Node 타입 스트리핑이 못 지운다). 최소한 아래를 export:
  - `applyDeltas(actors, deltas, sign: 1 | -1): void` — actor 배열 잔액에 증감 적용(제자리 수정).
  - `makeTransfer(actors, fromId, toId, amount, id, now): MoneyTx`
  - `makeSet(actors, actorId, amount, id, now): MoneyTx`
- C2. **transfer** — from −amount, to +amount. `deltas` 에 두 actor 증감 기록. `amount` 필드 = 이동 금액.
  from === to 거나 amount <= 0 이면 거래를 만들지 않는다(composable 이 `undefined` 반환).
- C3. **set** — 대상 잔액을 amount 로 **덮어쓴다**. `deltas = { [id]: amount - 이전잔액 }`. `amount` 필드 = 변경 후 잔액.
- C4. **revert** — 해당 거래의 `deltas` 를 **부호 반전해 재적용**하고 `revertedAt` 을 찍는다.
  잔액 복원 방식 금지(뒤 거래가 어긋난다). 이미 `revertedAt` 이면 아무것도 안 하고 `false`. 취소 거래는 목록에서 지우지 않는다.
- C5. **무한 은행** — balance 가 `Infinity` 면 유한 증감을 더해도 Infinity 가 유지된다. transfer 에는 별도 분기 금지.
  **set 만 예외**가 있다(PL이 타입에 `prevBalance` 를 추가했다):
  - set 은 항상 `prevBalance` 에 이전 잔액을 기록한다.
  - 이전·새 값이 **둘 다 유한**하면 `deltas = { [id]: 새 − 이전 }` → 롤백은 부호 반전(일반 규칙).
  - 하나라도 무한이면 `deltas = {}` → 롤백은 **`prevBalance` 로 복원**. 이 예외가 필요한 이유(∞ − ∞ = NaN)를 주석 한 줄로 남긴다.
  - transfer 에서 delta 는 항상 유한(금액)이라 예외 없음.
- C6. `useMoneyBoard()` 반환(인터페이스 계약 표):
  `actors: Ref<MoneyActor[]>` · `histories: Ref<MoneyTx[]>`(최신이 앞) ·
  `addActor(input: Omit<MoneyActor, 'id'>): MoneyActor` · `removeActor(id)` ·
  `transfer(fromId, toId, amount): MoneyTx | undefined` · `setBalance(id, amount): MoneyTx | undefined` ·
  `revert(txId): boolean` · `reset()`. id 는 `useUtils().getUniqueId()`. 히스토리 개수 제한 없음. 영속 없음(메모리만).
- C7. **self-check** `test/moneyLedger.check.mjs`: `node:assert` 로 `../app/utils/moneyLedger.ts` 를 직접 import
  (Node 25 타입 스트리핑). `node test/moneyLedger.check.mjs` 로 돌아야 한다. 반드시 포함할 시나리오:
  1. 철수 10000 → set 철수 5000 → transfer 철수→영희 3000 → **set 거래 취소** ⇒ 철수 **7000**, 영희 +3000.
     (잔액 복원 방식이면 5000 이 나온다 — 이게 실패해야 이 check 가 의미 있다.)
  2. 무한 은행 → 철수 transfer 1000 ⇒ 은행 ∞ 유지, 철수 +1000. 그 거래 취소 ⇒ 철수 원복, 은행 ∞.
  3. 은행 50000 → set 은행 ∞ → 취소 ⇒ 은행 **50000**(NaN 아님). 은행 ∞ → set 50000 → 취소 ⇒ 은행 **∞**.
  4. 같은 거래 두 번 revert ⇒ 두 번째는 false, 잔액 변화 없음.
  5. 결과에 `NaN` 이 어디에도 없어야 한다.

## 제외범위

- 화면·컴포넌트 전부. 영속(IndexedDB). 사운드·단위. 테스트 러너 도입(vitest 등 설치 금지).

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
node test/moneyLedger.check.mjs          # 전부 통과 출력
CI=true pnpm exec eslint app/utils/moneyLedger.ts app/composables/useMoneyBoard.ts test/moneyLedger.check.mjs
pnpm typecheck
```
