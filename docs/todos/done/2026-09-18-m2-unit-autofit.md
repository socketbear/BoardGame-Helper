# m2 — 네모에 단위 표시 + 금액 글자 자동 축소

## 목적

사용자 요구: "단위가 실제 본 화면에 나오지 않는다", "금액이 너무 커서 사이즈를 벗어나면 금액 크기를 작게, JS 동적 구성이 필요하면 그렇게."

## 작업범위

- `app/components/money-board/MoneyBox.vue` (필요하면 `MoneyBoard.vue` 는 건드리지 않는 선에서 이 파일만)

## 계약

- C1. 잔액 옆에 단위를 표시한다. `useUnitStore().currency` 의 `unitPosition` 이 FRONT 면 앞, BACK 이면 뒤. 단위가 빈 문자열이면 표시 없음.
  무한대(`∞`)에도 단위를 붙인다(`∞만원`).
- C2. **어떤 순간에도 금액+단위가 네모 폭을 넘치지 않는다** — CountNumber 가 1초간 숫자를 굴리는 **도중**과
  증감 표시(+/−)까지 포함. 넘치면 **글자를 줄인다**(줄바꿈·말줄임 금지). 기본 크기(지금 `text-2xl sm:text-4xl`)보다 커지지는 않는다.
- C3. 방법은 판단하되 권장: 보이지 않는 측정용 span 에 **이전·새 금액 중 긴 쪽 문자열 + 단위**를 기본 크기로 넣고
  `scale = min(1, 사용 가능 폭 / 측정 폭)` 으로 글자 크기를 정한다. 사용 가능 폭은 `ResizeObserver`(네모)로 갱신.
  매 프레임 측정 금지. 금액이 바뀔 때·네모 크기가 바뀔 때만.
  카운트가 끝나면(약 1초) 새 금액 기준으로 다시 맞춘다 — 커지는 방향 전환은 애니메이션이 끝난 뒤.
- C4. CountNumber 는 여전히 수정 금지. 숫자 부분은 CountNumber, 단위는 이 컴포넌트가 따로 그린다.
  CountNumber 루트가 블록이라 한 줄 배치가 깨지면 감싸는 요소 쪽에서 `inline-flex`/`whitespace-nowrap` 로 맞춘다.
- C5. 확인용: 360px 2열에서 `-12,345,678만원` 이 한 줄에 들어가야 한다(글자가 작아져서라도). 계산 근거를 보고에 적는다.

## 제외범위

- 화살표·포인터 처리(`MoneyBoard.vue`). 설정·히스토리·엔진.

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
CI=true pnpm exec eslint app/components/money-board/MoneyBox.vue
pnpm typecheck
```

브라우저로 못 본 부분은 ④에 PL 육안 확인 항목으로.
