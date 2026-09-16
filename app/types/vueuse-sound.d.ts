// `@vueuse/sound` 2.0.1 은 `dist/index.d.ts` 를 실제로 배포하지만 package.json `exports` 에
// `types` 조건이 없다. 그래서 `moduleResolution: bundler` 가 선언 파일을 찾지 못하고 TS7016
// (implicitly any) 이 난다. 라이브러리 쪽 문제이므로 배포된 선언을 그대로 다시 노출해 보정한다.
//
// `declare module` 블록 안의 상대경로 `export ... from` 은 해석되지 않고 조용히 any 가 되므로
// (그러면 타입을 잃는다) 반드시 `typeof import(...)` 형태로 써야 한다.
// 패키지가 `exports` 에 `types` 를 추가하면 이 파일은 지운다.
declare module '@vueuse/sound' {
  export const useSound: typeof import('../../node_modules/@vueuse/sound/dist/index').useSound
}
