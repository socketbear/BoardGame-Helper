# m4 — 히스토리 패널 + 단건 롤백

## 목적

거래 기록을 보여주고, **아무 항목이나 하나씩 취소**할 수 있게 한다.

## 작업범위 (이 파일만)

- `app/components/money-board/HistoryPanel.vue` (신규)

## 계약

- C1. **열고 닫는 장치**: `el-drawer`(오른쪽, 모바일에선 폭 `90%` 류). `v-model:open` 으로 제어.
  여는 버튼은 페이지(PL)가 둔다 — 이 컴포넌트는 서랍 본체만.
- C2. 목록은 `histories` 순서 그대로(최신이 위). 각 행:
  시각(`HH:mm:ss`, `dayjs` 이미 설치됨) · 내용 · 금액 · [취소] 버튼.
  - transfer: `{보낸이} → {받은이}` · 금액
  - set: `{대상} 잔액 변경` · `→ {변경 후 잔액}`
  - 이름은 `actors` 에서 id 로 찾는다. **삭제돼서 못 찾으면 "(삭제됨)"**. id 를 화면에 내보내지 않는다.
  - 무한대 금액은 `∞`.
- C3. **취소된 거래**(`revertedAt` 있음): 취소선 + 흐리게 + "취소됨" 표시, [취소] 버튼 없음.
- C4. [취소] 클릭 → `ElMessageBox.confirm` 으로 한 번 확인("이 거래를 취소할까요? 잔액이 되돌려집니다.").
  확인 시 `revert(txId)` emit. 거절(reject)은 조용히 무시(여기는 라우터 가드가 아니므로 빈 catch 가 맞다).
- C5. 기록이 없으면 빈 상태 문구("아직 거래가 없습니다.").
- C6. 이 컴포넌트는 **표시 + emit 만.** 상태 변경·`useMoneyBoard` 호출 금지.

## 제외범위

- 시점 복원(일괄 롤백) — 사용자가 단건 취소만 선택했다. 필터·검색·내보내기.
- 보드(m2)·설정(m3)·엔진(m1). 부자만들기 `HistoryViewer` 수정.

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
CI=true pnpm exec eslint app/components/money-board/HistoryPanel.vue
pnpm typecheck
```
