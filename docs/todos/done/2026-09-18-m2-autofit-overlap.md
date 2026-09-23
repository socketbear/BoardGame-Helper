# m2 — 금액 자동 축소 시 숫자와 단위가 겹치는 문제

## 증상 (사용자 스크린샷)

Player1 잔액 `6,000,000,000만원` 이 축소는 됐는데 숫자 끝이 `만원` 과 겹친다.

## PL 재현 결과 (360px, headless Chromium)

- 축소 배율 적용 후 행 글자 크기 14.78px. 측정용 span(24px) 폭 176px × 배율 = **108.4px** 로 계산.
- 실제 렌더된 숫자(`.animate-count`) `scrollWidth` = **112px**, 숫자 칸 폭 108.4px → 3.6px 넘침 → 단위와 겹침.
- 원인 1: **글자 폭은 크기에 정비례하지 않는다**(작은 크기에서 글리프 advance 반올림으로 넓어짐). 기본 크기 측정 × 배율은 과소평가된다.
- 원인 2: 숫자 칸이 flex 기본 `flex-shrink: 1` + 계산된 `min-width` 라, 행이 넘치면 숫자 칸이 계산값까지 **눌리고** 내용이 단위 쪽으로 삐져나온다.

## 작업범위

- `app/components/money-board/MoneyBox.vue`

## 계약

- C1. **축소된 크기에서 실제로 잰 값**으로 맞춘다. 권장: 측정용 span 을 배율이 적용되는 요소 **안**으로 옮겨 같은 글자 크기를 상속시키고,
  `s ← min(1, s × 사용가능폭 / 실측폭)` 을 렌더 후 재측정하며 수렴할 때까지(최대 3회, 변화 < 0.5px 이면 중단) 반복. 마지막에 내림.
  (기본 크기 × 배율 선형 가정 금지.)
- C2. 숫자 칸·단위 칸은 **`shrink-0`**. 보정이 어긋나도 겹치지 않고, 최악이어도 행 전체가 오른쪽 정렬로 넘칠 뿐이게 한다.
  숫자 칸 `min-width` 는 배율을 곱한 값이 아니라 **스케일된 상태의 실측 최대 후보 폭**.
- C3. 기존 요구 유지: 카운트 도중·증감 표시 포함 넘침 없음, 기본 크기보다 커지지 않음, 매 프레임 측정 금지(금액·단위·크기 변경 시에만), 1.2초 뒤 새 금액 기준 재조정.
- C4. 단위와 숫자 사이 간격 `0.15em` 정도(`₩1,000`·`1,000만원` 이 붙어 보이되 겹치지 않게). 판단.

## 검증 — 실제 브라우저 (필수)

PL이 만든 재현 스크립트: `/private/tmp/claude-501/-Users-socketbear-Workspace-BoardGame-Helper/d49eb637-9b08-43b8-bb85-03a9cfb459cf/scratchpad/repro.mjs` (playwright-core 는 `~/node_modules` 에 있음. **의존성 설치 금지**)

```bash
pnpm generate                                   # 이번엔 다른 agent 가 없어 허용한다
(cd .output/public && python3 -m http.server 4173 >/dev/null 2>&1 &)   # 이미 떠 있으면 생략
OUT=<네 출력 폴더> node /private/tmp/claude-501/-Users-socketbear-Workspace-BoardGame-Helper/d49eb637-9b08-43b8-bb85-03a9cfb459cf/scratchpad/repro.mjs            # 기본 360px, 6,000,000,000
W=390 OUT=... node /private/tmp/claude-501/-Users-socketbear-Workspace-BoardGame-Helper/d49eb637-9b08-43b8-bb85-03a9cfb459cf/scratchpad/repro.mjs
W=1280 OUT=... node /private/tmp/claude-501/-Users-socketbear-Workspace-BoardGame-Helper/d49eb637-9b08-43b8-bb85-03a9cfb459cf/scratchpad/repro.mjs
KEYS=1,2,3,4,5,6,7,8,9,0,000 OUT=... node /private/tmp/claude-501/-Users-socketbear-Workspace-BoardGame-Helper/d49eb637-9b08-43b8-bb85-03a9cfb459cf/scratchpad/repro.mjs   # 123억대
```

각 실행에서 **숫자 `right` ≤ 단위 `left`** 이고 **숫자 `scrollWidth` ≤ `clientWidth`**, 행 전체 폭 ≤ `amountWidth` 여야 한다.
결과 JSON 과 스크린샷(`box.png`) 경로를 보고에 붙인다. 스크린샷은 Read 로 직접 보고 겹침이 없는지 확인한다.
스크립트가 측정 구조 변경으로 안 맞으면 스크립트를 네 출력 폴더에 복사해서 고쳐 써라(원본 수정 금지).

## 제외범위

- 다른 파일. `CountNumber.vue`. 새 의존성.

## 공통 규율

- 커밋·git 상태 변경 금지. `CI=true pnpm exec eslint app/components/money-board/MoneyBox.vue` · `pnpm typecheck`.

## 보고

① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것
