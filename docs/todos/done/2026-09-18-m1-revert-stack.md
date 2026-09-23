# m1 — 취소도 거래로 쌓기 (append-only 롤백)

## 목적

사용자 요구: "취소를 완료하면 취소된 내역도 거래기록으로 나오게, 다시 또 취소할 수 있게, 쌓이는 구조로."
지금은 원거래에 `revertedAt` 만 찍는다. 앞으로는 취소가 **새 `revert` 거래**로 기록에 쌓이고, 그것도 다시 취소할 수 있다.

## 작업범위

- `app/utils/moneyLedger.ts` · `app/composables/useMoneyBoard.ts` · `test/moneyLedger.check.mjs`

## 계약

- C1. `revert(txId)` 는 대상 거래를 고치지 않고(단, `revertedById` 는 찍는다) **새 거래를 만든다**:
  `type: 'revert'`, `revertOfId: 대상 id`, `fromId`·`toId`·`amount` 는 대상 값 복사(표시용), 새 id·시각.
  새 거래는 `histories` 맨 앞에 쌓인다. 반환값은 새 거래(`MoneyTx | undefined`) 또는 기존처럼 boolean — 페이지는 반환값을 쓰지 않으니 판단.
- C2. **잔액 적용 규칙은 하나**(대상이 transfer·set·revert 어느 것이든 동일):
  - 대상 `deltas` 가 비어 있지 않으면 → 새 거래 `deltas` = 대상 `deltas` 부호 반전, 그걸 적용.
  - 대상 `deltas` 가 비어 있으면(∞ 가 낀 set 이거나 그걸 취소한 revert) → `toId` 잔액을 대상 `prevBalance` 로 복원.
    새 거래는 `deltas = {}`, `prevBalance = 복원 직전 잔액`. 그래야 새 거래를 다시 취소하면 원래대로 돌아간다.
  - 모든 거래는 `prevBalance`(`toId` 의 직전 잔액)를 기록해도 된다 — 규칙은 "deltas 가 비었을 때만 쓴다".
- C3. 이미 `revertedById` 가 있는 거래를 취소하려 하면 아무것도 하지 않는다(false/undefined). 되살리려면 그 revert 를 취소한다.
- C4. `revertedAt` 은 타입에서 제거됐다. 쓰는 곳 전부 정리.
- C5. self-check 갱신. 기존 시나리오(1~5)는 새 모델로 고쳐 유지하고 추가: 6. 취소의 취소: 철수→영희 3000 → 취소(원복) → 그 취소를 취소 ⇒ 다시 송금 상태. 기록은 3건, 최신 revert 만 취소 가능. 7. 3단 체인(송금→취소→취소→취소) ⇒ 원복 상태, 각 단계에서 취소 가능한 건 최신 1건뿐. 8. ∞ 체인: 은행 50000 → set ∞ → 취소(50000) → 그 취소를 취소(∞) → 또 취소(50000). NaN 없음.
  check 가 의미 있는지 한 번 확인하라(예: C2 의 prevBalance 기록을 빼면 8 이 실패하는지) — 확인 후 원복.

## 제외범위

- 화면·컴포넌트. 타입 파일.

## 공통 규율

- 타입 `app/types/MoneyBoardTypes.ts` 는 PL이 이번에 갱신했다(`revert` 타입, `revertOfId`, `revertedById`, `revertedAt` 제거). **수정 금지.**
- 다른 agent 3명이 머니 보드 파일을 동시에 고친다. **작업범위 밖 파일 금지.**
- 단위는 전역 pinia `useUnitStore()` 의 `currency.unit` / `currency.unitPosition`(`UNIT_POSITION.FRONT | BACK`, `~/types/RichEnums`)을 쓴다. 설정(m3)이 여기에 값을 넣는다.
- hex 금지(`--shell-*` 변수·Uno 토큰). SSR 안전(`window`·`document`·`ResizeObserver` 는 `onMounted`/핸들러 안). 템플릿 로직 금지. 죽은 코드 금지.
- 커밋·git 상태 변경 금지. `pnpm generate` 금지. dev 서버 새로 띄우지 마라.
- 검증 `CI=true pnpm exec eslint <내 파일>` · `pnpm typecheck`(다른 lane 이 작업 중이라 남의 파일 에러는 무시, 내 파일만).

## 보고

① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것

## 검증

```bash
node test/moneyLedger.check.mjs
CI=true pnpm exec eslint app/utils/moneyLedger.ts app/composables/useMoneyBoard.ts test/moneyLedger.check.mjs
pnpm typecheck
```
