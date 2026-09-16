# BoardGame-Helper

Nuxt 4 + Vue 3 보드게임 헬퍼 모음. pnpm 사용.

## 작업 전 반드시 읽을 것

- [`docs/harness/pl-request.md`](docs/harness/pl-request.md) — **사용자와의 소통 창구.** lane 분리, 작업계약서, 검수 체크리스트, 보고 형식.
- [`docs/harness/nuxt-standards.md`](docs/harness/nuxt-standards.md) — 코드 표준(디렉터리 계약, SSR 주의, 스타일 우선순위).
- [`docs/harness/commit-message.md`](docs/harness/commit-message.md) — 커밋·브랜치 규칙.

## 검증

```bash
pnpm lint && pnpm typecheck && pnpm generate
```

`pnpm generate`(prerender)까지 통과해야 완료다. dev 에서만 되는 건 완료가 아니다.
