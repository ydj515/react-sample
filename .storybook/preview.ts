import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

// Tailwind v4 전역 스타일을 스토리에도 그대로 적용한다.
import "../src/app/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // 다크 테마 대비를 위해 캔버스 배경 옵션을 제공한다.
    backgrounds: {
      options: {
        light: { name: "light", value: "#f8fafc" },
        dark: { name: "dark", value: "#0f172a" },
      },
    },
  },
  decorators: [
    // 프로젝트의 다크모드는 [data-theme="dark"] 커스텀 variant로 동작하므로
    // html 요소의 data-theme 속성을 토글하도록 설정한다.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
