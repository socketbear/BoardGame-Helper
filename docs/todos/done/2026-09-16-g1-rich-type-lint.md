# g1 — 부자만들기 lint/type 부채 정리

## 목적

`g1` 소유 파일의 typecheck 4건 · lint 위반을 없앤다. **동작 변경 금지**(리팩토링 아님).

## 작업범위 (이 파일들만)

- `app/pages/games/rich/index.vue`
- `app/components/tools/FinancialStatement/main.vue`
- `app/components/tools/FinancialStatement/HistoryViewer.vue`

## 계약

- C1. `app/pages/games/rich/index.vue` 34·35·45·46 행 `TS2532: Object is possibly 'undefined'` 제거.
  배열 인덱스 접근이 원인이면 옵셔널 체이닝/가드/조기 리턴으로 **좁힌다**. `!` non-null 단언과
  `as any` 금지 — 실제로 undefined 가능한 경로면 화면이 깨지지 않게 처리한다.
- C2. 위 3개 파일의 lint 위반 제거: `pnpm exec eslint --fix <파일들>` 먼저 돌리고, 남은 건 수동.
- C3. 렌더 결과·계산 결과가 바뀌면 안 된다. 점수/금액 계산식은 손대지 않는다.
- C4. **(추가 발급 2026-09-16 — g4 계약서에서 이관)** 237행 `window.confirm('게임을 종료하시겠습니까?')`
  가 `no-alert` 에러다. **Element Plus `ElMessageBox.confirm`** 으로 교체한다(`@element-plus/nuxt`
  auto-import, 별도 import 불필요). 문구는 그대로 유지.
  **주의 — 이 confirm 은 `onBeforeRouteLeave` 네비게이션 가드 안에 있다.**
  기존 동작: 확인 → `next()`(이탈), 취소 → `next(false)`(이탈 차단).
  `ElMessageBox` 는 취소 시 reject 하므로 **catch 에서 반드시 `next(false)` 를 호출해야 한다.**
  빈 `.catch(() => {})` 로 삼키면 `next` 가 영영 안 불려 **라우터가 영구 대기로 멈춘다.**
  `isGameStarted.value === false` 인 else 경로는 동기 `next()` 그대로 둔다.
  교체 후 "게임 시작 → 다른 페이지로 이동 시도 → 확인/취소" 각각의 결과를 직접 확인하고 보고에 적는다.

## 제외범위

- `@vueuse/sound` 모듈 타입 해석 에러(`TS7016`) — `x1` lane 소유. **건드리지 말 것.**
- 다른 lane 파일 전부. 새 기능·리팩토링·의존성 추가.
- `pnpm generate` 실행 금지(`.output/` 충돌). PL이 통합 때 한 번 돌린다.

## 검증

```bash
CI=true pnpm exec eslint app/pages/games/rich/index.vue app/components/tools/FinancialStatement/
# no-alert 포함 0건이어야 한다
pnpm typecheck   # rich/index.vue 의 TS2532 4건이 사라졌는지 확인(TS7016은 남아있는 게 정상)
```

## 보고

① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것
