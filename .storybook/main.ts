import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // 스토리는 컴포넌트와 같은 위치(co-location)에 두어 유지보수를 쉽게 한다.
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs", // autodocs 문서 자동 생성
    "@storybook/addon-a11y", // 접근성 검사
    "@storybook/addon-themes", // 라이트/다크 테마 토글
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal(viteConfig) {
    // 앱 전용 TanStack Router 플러그인(라우트 생성/HMR)은 Storybook에 불필요하다.
    // 세 플러그인 모두 "tanstack" 접두사를 쓰므로 이름으로 걸러 빌드 부하를 줄인다.
    const isTanstackRouterPlugin = (plugin: unknown): boolean =>
      typeof plugin === "object" &&
      plugin !== null &&
      "name" in plugin &&
      typeof (plugin as { name: unknown }).name === "string" &&
      (plugin as { name: string }).name.includes("tanstack");

    viteConfig.plugins = (viteConfig.plugins ?? [])
      .flat(Infinity)
      .filter((plugin) => !isTanstackRouterPlugin(plugin));

    return viteConfig;
  },
};

export default config;
