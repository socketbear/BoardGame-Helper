# m3 — 설정 화면에 단위 선택 추가

## 목적

사용자 요구: "단위 선택이 빠져 있다. 기본 '만원'."
원인: 설정 화면의 `NumberSetter` 는 전역 `useUnitStore` 를 읽는데, 머니 보드는 그 값을 정하지 않는다.
부자만들기에 한 번 들어가면 거기서 넣은 `만원` 이 남아 있다가 보일 뿐이다.

## 작업범위

- `app/components/money-board/MoneyBoardSetup.vue`

## 계약

- C1. 설정 화면 맨 위에 "단위" 섹션. 프리셋 칩(부자만들기 이름 태그 모양 `name-tag` 류):
  `만원`(뒤) · `원`(뒤) · `₩`(앞) · `$`(앞) · `G`(뒤) · `점`(뒤) · `없음`(빈 문자열).
  **직접 입력** 칸도 둔다(입력하면 뒤에 붙는 단위로 적용). 선택된 칩은 표시가 달라야 한다.
- C2. 선택은 즉시 `useUnitStore().setUnit(unit, position)` 로 반영한다 — 아래 은행·플레이어 금액 칸(`NumberSetter`)이 바로 따라 바뀐다.
- C3. **설정 화면이 열릴 때 기본값 `만원`(BACK) 을 넣는다.** 부자만들기에서 남은 값에 의존하지 않는다.
- C4. `start` emit 인터페이스는 바꾸지 않는다(단위는 전역 스토어에 있다).
- C5. 부자만들기 `UnitSelector` 는 기호 전용이라 재사용하지 않는다. `UNIT_POSITION` 은 `~/types/RichEnums` 에서 import.

## 제외범위

- 보드·히스토리·엔진·페이지. `useUnitStore`·`NumberSetter`·`UnitSelector` 수정.

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
CI=true pnpm exec eslint app/components/money-board/MoneyBoardSetup.vue
pnpm typecheck
```
