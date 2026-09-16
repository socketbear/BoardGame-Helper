# x1 — @vueuse/sound 타입 해석 실패 정리

## 목적

`TS7016` 2건(`@vueuse/sound` 가 implicitly any)을 없앤다. 이 패키지는 타입 파일이 실제로 있는데
(`node_modules/@vueuse/sound/dist/index.d.ts`) package.json `exports` 가 그걸 노출하지 않아
`moduleResolution: bundler` 에서 해석에 실패한다. **라이브러리 쪽 문제**이므로 우리 쪽에서 보정한다.

## 영향 파일 (에러가 나는 곳 — 직접 고치지 말 것)

- `app/components/tools/NumberSetter.vue` (t1 소유)
- `app/pages/games/rich/index.vue` (g1 소유, 다른 계약서 진행 중)

## 작업범위 (이 파일들만)

- `tsconfig.json` 또는 새 ambient 선언 파일 1개(`app/types/` 아래 `*.d.ts`)
- 필요하면 `package.json`(의존성 버전)

## 계약

- C1. `pnpm typecheck` 에서 `@vueuse/sound` 관련 `TS7016` 2건이 사라진다.
- C2. **가장 짧은 해법을 고른다.** 후보 순서대로 시도:
  (a) `tsconfig.json` `compilerOptions.paths` 에 `@vueuse/sound` → `./node_modules/@vueuse/sound/dist/index.d.ts` 매핑,
  (b) `app/types/vueuse-sound.d.ts` 에 `declare module '@vueuse/sound'` 로 실제 타입 재노출.
  `noImplicitAny` 끄기·`skipLibCheck` 로 덮기·`any` 로 뭉개기 **금지**(타입을 잃으면 실패한 작업이다).
- C3. Nuxt 가 생성하는 `.nuxt/tsconfig.json` 을 `extends` 하는 구조를 깨뜨리지 않는다.
  `tsconfig.json` 을 바꾼다면 기존 `extends` 를 유지하고 필요한 키만 추가한다.
- C4. **런타임 동작·번들 변경 금지.** 타입 레벨 보정만.
- C5. 위 "영향 파일" 2개는 이 lane에서 수정하지 않는다(다른 lane 소유).

## 제외범위

- 의존성 업그레이드로 해결하려는 시도는 먼저 PL에 보고(버전 올리면 런타임 영향).
- `@vueuse/sound` 제거·대체. 다른 lint 부채.
- `pnpm generate` 실행 금지(`.output/` 충돌).

## 검증

```bash
pnpm typecheck   # @vueuse/sound TS7016 2건이 사라졌는지 확인
pnpm exec eslint tsconfig.json app/types/   # 새로 만든 파일이 lint 통과하는지
```

## 보고

① 한 일 ② 바꾼 파일 ③ 검증 결과(명령+출력) ④ 남은 것·막힌 것 — (b)를 골랐다면 왜 (a)가 안 됐는지도.
