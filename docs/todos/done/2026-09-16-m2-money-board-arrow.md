# m2 — 보드 + 화살표 드래그

## 목적

참가자 네모를 배치하고, **네모는 제자리에 둔 채** 누른 지점에서 손가락/커서까지 **곡선 화살표**가 따라오게 한다.
대상 네모 위에 오면 화살표 끝이 그 네모 **가장자리**(중심을 향하도록)로 스냅되고 하이라이트된다. (PL 정정: 목적의 "중심"과 C3 의 "가장자리"가 어긋났었다. C3 이 맞다.)

## 작업범위 (이 파일들만)

- `app/components/money-board/MoneyBoard.vue` (신규) — 컨테이너 + SVG 화살표 레이어 + 포인터 처리
- `app/components/money-board/MoneyBox.vue` (신규) — 네모 하나(표시 전용)

## 계약

- C1. **interact.js 쓰지 않는다.** 네이티브 Pointer Events(`pointerdown` on 네모, `pointermove`/`pointerup`/`pointercancel`
  은 `window` 에 등록·해제)로 마우스·터치 통합. 네모에 `touch-action: none`.
- C2. **탭 vs 드래그**: 이동 거리 8px 미만에서 손을 떼면 **탭** → `select(actorId)` emit (자기 자신 금액 변경).
  8px 이상 움직였다가 **다른 네모** 위에서 떼면 `transfer(fromId, toId)` emit. 빈 곳이나 **자기 자신** 위에서 떼면 취소(아무 emit 없음).
- C3. **화살표**: 보드 위에 절대배치된 SVG 1장(`pointer-events: none`). 출발 = 누른 네모의 중심.
  경로는 2차/3차 베지어 **곡선**(직선 금지) — 두 점의 수직 방향으로 휘게 해서 "유려하게" 보이게.
  끝에 화살촉(`<marker>`). 색은 `--shell-accent`. 선 굵기 3~4px, 둥근 끝.
  대상 네모 위에 있으면 끝점을 대상 중심이 아니라 **대상 네모의 가장자리**에 붙여 화살촉이 네모에 가려지지 않게 한다.
- C4. **대상 찾기**: `document.elementFromPoint(x, y)?.closest('[data-actor-id]')`. 좌표는 보드 컨테이너 기준으로 변환
  (`getBoundingClientRect`). 스크롤돼 있어도 어긋나지 않아야 한다.
- C5. **하이라이트**: 드래그 중 출발 네모와 hover 중인 대상 네모에 링(`ring-4` 류 Uno 유틸)을 준다.
- C6. `MoneyBox` 는 기존 `app/components/drag/Box.vue` 의 **겉모습을 그대로** 따른다(`h-32 w-32 border-4 rounded-lg`,
  `color` 의 bg 클래스 + 같은 계열 600 테두리, 회색 계열은 흰 글자). 내용: 이름(굵게) + 잔액(우측 정렬).
  무한대면 `∞`. `data-actor-id` 속성을 루트에 단다. **drag/Box.vue 는 수정하지 않는다**(부자만들기가 씀).
- C7. 네모 배치: `flex flex-wrap gap-4` 정도로 충분. 좌표 계산은 드래그 **시작 시점**에 한 번 측정하고
  move 중에는 포인터 좌표만 갱신(매 프레임 레이아웃 측정 금지). 대상 hover 판정만 move 마다 `elementFromPoint`.
- C8. 드래그 중 텍스트 선택·스크롤이 일어나지 않게 한다. `pointerup` 누락 대비 `pointercancel` 도 같은 정리 경로로.
- C9. 언마운트 시 window 리스너를 반드시 해제한다.

## 제외범위

- 금액 입력 UI(m3 `AmountDialog`). 히스토리(m4). 상태 변경 — 이 lane 은 **emit 만** 한다. `useMoneyBoard` 호출 금지.
- 새 의존성. `drag/Box.vue` 수정.

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
CI=true pnpm exec eslint app/components/money-board/MoneyBoard.vue app/components/money-board/MoneyBox.vue
pnpm typecheck
```

브라우저 확인 수단이 없으면 보고 ④에 "PL 육안 확인 필요 항목"을 구체적으로 적어라(탭/드래그/취소/스냅/모바일).
