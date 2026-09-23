# g2 — 하나비 lint/type 부채 정리

## 목적

`g2` 소유 파일의 typecheck 2건 · lint 위반을 없앤다. **동작 변경 금지.**

## 작업범위 (이 파일들만)

- `app/components/HanabiCard.vue`
- `app/components/HanabiCardPopover.vue`

## 계약

- C1. `HanabiCard.vue:175` `TS2345` — `style.backgroundColor: string | null` 이 Vue `StyleValue` 와
  안 맞는 문제. `null` 대신 `undefined` 를 쓰거나 타입을 `StyleValue`로 정확히 좁힌다.
- C2. `HanabiCardPopover.vue:29` `TS2345` — `style: object | undefined` 를 `StyleValue`로 좁힌다.
  `computed` 반환 타입을 명시하는 쪽이 보통 가장 짧다.
- C3. `as any`·`@ts-ignore`·`@ts-expect-error` 금지. 타입을 실제로 맞춘다.
- C4. lint 위반 제거: `pnpm exec eslint --fix <파일들>` 먼저, 남은 건 수동.
- C5. 카드 색·선택 상태 등 **화면에 보이는 결과가 바뀌면 안 된다.** 라이트/다크 둘 다 확인.

## 제외범위

- `app/types/HanabiTypes.ts` 변경(필요하면 PL에 보고). 다른 lane 파일 전부. 새 기능·리팩토링.
- `pnpm generate` 실행 금지(`.output/` 충돌).

## 검증

```bash
pnpm exec eslint app/components/HanabiCard.vue app/components/HanabiCardPopover.vue
pnpm typecheck   # 위 2건이 사라졌는지 확인
```

## 보고

① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것
