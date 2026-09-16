# Commit Message Harness

이 저장소에서 커밋 메시지를 작성할 때 지켜야 할 기준이다.

## 기본 규칙

- 항상 한글로 작성한다.
- 제목은 `<타입>: <요약>` 형식, 50자 이내. (기존 히스토리와 동일 — 이모지·티켓 접두어 없음)
- 본문에는 구체적인 변경사항을 `-` 목록으로 나열한다.
- 하나의 목적을 한 커밋으로. lane(`s1`·`g1`·`l1` …)이 여럿 섞이면 lane 단위로 나눈다.

## 커밋 타입

- `feat`: 새로운 기능 (게임 추가, 화면 추가)
- `fix`: 버그 수정
- `docs`: 문서 (README, `docs/`)
- `style`: 스타일/포맷팅 (동작 변화 없음)
- `refactor`: 리팩토링
- `perf`: 성능 개선
- `chore`: 빌드/설정 (`nuxt.config.ts`·`netlify.toml`·CI)
- `deps`: 의존성 변경

## 예시

```text
refactor: 앱 셸 레이아웃 구조 개편

- layout/AppHeader, AppFooter, AppNavDrawer 컴포넌트 분리
- 게임 전용 game 레이아웃 추가 및 각 게임 페이지에 적용
- 네비게이션 항목을 constants/navigation.ts로 통합
```

## 브랜치

- `origin/main` 기준으로 `<타입>/<슬러그>` 브랜치를 만든다. 예: `refactor/app-shell-layout`, `feat/cascadia-helper`.
- `main` 직접 커밋 금지. PR로 병합한다.

## 깃허브

- `origin` = https://github.com/socketbear/BoardGame-Helper.git
