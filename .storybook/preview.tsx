import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";

// Tailwind v4 전역 스타일을 스토리에도 그대로 적용한다.
import "../src/app/styles/index.css";

// html 요소의 data-density 속성을 토글하는 내부 컴포넌트.
// 훅은 컴포넌트 안에서만 호출할 수 있어 데코레이터와 분리한다.
function DensityRoot({
  density,
  children,
}: {
  density: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-density", density);
    return () => root.removeAttribute("data-density");
  }, [density]);

  return <>{children}</>;
}

// 밀도(density) 토글: 앱의 [data-density="compact"] 커스텀 variant를 툴바에서 전환해
// 컴포넌트의 compact: 스타일 분기를 Storybook에서도 눈으로 검증할 수 있게 한다.
const withDensity: Decorator = (Story, context) => {
  const density =
    context.globals.density === "compact" ? "compact" : "comfortable";

  return (
    <DensityRoot density={density}>
      <Story />
    </DensityRoot>
  );
};

export const globalTypes = {
  density: {
    description: "밀도(compact) 토글",
    defaultValue: "comfortable",
    toolbar: {
      title: "Density",
      icon: "component",
      items: [
        { value: "comfortable", title: "Comfortable" },
        { value: "compact", title: "Compact" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    // 스토리를 기본적으로 중앙에 배치한다(전체 화면이 필요한 스토리는 개별 override).
    layout: "centered",
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
    withDensity,
  ],
};

export default preview;
