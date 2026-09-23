# m4 — 히스토리: 확인창 z-index 수정 + 취소 거래 표시 + 단위

## 목적

사용자 요구: "취소 확인창이 dim 아래에 있어서 누를 수 없다", "취소도 기록으로 쌓이고 다시 취소할 수 있게", 금액에 단위.

## 작업범위

- `app/components/money-board/HistoryPanel.vue`

## 계약

- C1. **z-index**: 원인은 `@element-plus/nuxt` 가 앱에 z-index 카운터를 주입하는데(`ZINDEX_INJECTION_KEY`),
  `ElMessageBox.confirm()` 을 앱 컨텍스트 없이 부르면 전역 카운터를 따로 써서 서랍 딤 아래로 깔리는 것.
  setup 에서 `getCurrentInstance()?.appContext` 를 잡아 **4번째 인자**로 넘긴다(`confirm(message, title, options, appContext)`, 2.9.0 타입 확인됨).
  z-index 숫자를 하드코딩해서 덮지 마라.
- C2. 행 종류 3가지:
  - transfer: `{보낸이} → {받은이}` · 금액
  - set: `{대상} 잔액 변경` · `→ {변경 후 잔액}`
  - **revert**: `revertOfId` 를 따라 원래 거래(transfer/set)까지 거슬러 올라가 그 내용을 보여주고,
    체인 깊이가 홀수면 "취소", 짝수면 "다시 적용" 라벨. (예: 송금 → 취소(1) → 다시 적용(2) → 취소(3))
    원거래를 못 찾으면 "(알 수 없는 거래)".
- C3. `revertedById` 가 있는 행: 흐리게 + "취소됨" 표시, [취소] 버튼 없음. **없는 행은 revert 포함 전부 [취소] 가능.**
  (`revertedAt` 은 타입에서 제거됐다.)
- C4. 금액에 단위: `useUnitStore().currency` 로 앞/뒤. 무한대는 `∞`+단위. 방향 부호가 필요하면 판단.
- C5. 확인 문구: 일반 행 "이 거래를 취소할까요? 잔액이 되돌려집니다." / revert 행 "이 취소를 되돌릴까요? 잔액이 다시 적용됩니다."
- C6. 표시 + `revert(txId)` emit 만. 상태 변경 금지.

## 제외범위

- 엔진·보드·설정·페이지.

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
CI=true pnpm exec eslint app/components/money-board/HistoryPanel.vue
pnpm typecheck
```
