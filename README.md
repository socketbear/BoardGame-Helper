# Board Game Helper V2
보드게임 헬퍼 서비스들을 하나씩 하나씩 모아둔 개인 프로젝트입니다.
해당 프로젝트는 `pnpm` 을 사용하여 개발되었습니다.

## 프로젝트 개발 모드로 실행 방법
```bash
pnpm install
pnpm dev
```

## 프로젝트 빌드 방법
Nuxt SSR 모드를 사용하나, 빌드는 정적으로 빌드하여 제공하게 구성했습니다.
```bash
pnpm generate
```

## 프로젝트 배포 방법
Netlify 를 사용하여 배포할 수 있는 설정을 구성하였습니다. (`netlify.toml` 참고)
git push 후, Netlify 에서 자동으로 배포하게 구성하는 것을 추천합니다.