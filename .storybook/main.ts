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
};

export default config;
