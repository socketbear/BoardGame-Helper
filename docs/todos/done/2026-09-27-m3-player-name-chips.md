# m3 — 플레이어 이름 칩(최근 사용 이름 빠른 선택)

## 목적

사용자 요구: 설정에서 기본 `Player1` 대신 직접 입력한 이름으로 완료하면, 다음에 설정 화면을 열 때
그 이름들이 input 오른쪽에 칩으로 나타나 바로 선택되게 한다. 저장은 localStorage, 최대한 단순하게.

## 작업범위

- `app/components/money-board/MoneyBoardSetup.vue` (이 파일만)

## 계약

- C1. localStorage 키 `money-board-player-names`, 값은 JSON `string[]`. **SSR 안전**: 읽기는
  `onMounted` 안에서만, 쓰기는 완료 버튼 핸들러(클라이언트 이벤트) 안에서만. 읽기/쓰기는
  `try`/`catch` 로 감싸고 파싱 실패 시 빈 목록으로 시작한다(편의 캐시이므로 조용히 비어도 된다).
- C2. 완료(`start`) 클릭 시 현재 플레이어 이름들을 저장한다: trim, 빈 문자열 제외,
  자동 기본값(`^Player\d+$`) 제외, 중복 제거 — **최근 사용한 이름이 앞으로 오게** 하고
  최대 10개만 유지한다.
- C3. 설정 화면에는 저장된 이름들이 각 플레이어 input **오른쪽에 칩**으로 나온다.
  - 칩 클릭 → 그 플레이어의 `name` 칸을 해당 이름으로 채운다(다른 상태 변경 없음).
  - 칩 목록은 모든 플레이어 행이 같은 목록을 공유한다.
  - 칩 컨테이너: 가로 공간을 채우고 넘치면 가로 스크롤
    (`flex min-w-0 flex-1 gap-1 overflow-x-auto whitespace-nowrap` 류).
  - input 은 칩 자리를 남기기 위해 고정 폭(`w-32 shrink-0` 류)으로 바꾼다. 삭제 버튼은 맨 오른쪽 유지.
  - 칩 스타일은 이 파일 단위 칩과 동일하게: `name-tag` shortcut + `bg-gray-200`(선택 상태 개념 없음).
    새 전역 CSS·shortcut 추가 금지.
- C4. `start` emit 인터페이스·은행 섹션·다른 컴포넌트·페이지는 건드리지 않는다.
- C5. 템플릿에 로직 금지 — 칩 목록은 `computed`/`ref` 로.

## 제외범위

- 보드·히스토리·엔진·페이지·`AmountDialog`·타입 파일. pinia 스토어 사용 금지(이 기능은 로컬 상태+localStorage).

## 공통 규율

- hex 색 금지. 이 파일의 기존 칩 스타일을 따른다.
- `pnpm generate` 금지. dev 서버 새로 띄우지 마라. 커밋·git 상태 변경 금지.
- 검증: `CI=true pnpm exec eslint app/components/money-board/MoneyBoardSetup.vue` ·
  `pnpm typecheck`(남의 파일 에러는 무시, 이 파일 에러만 0 이어야 한다).

## 보고

① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것
