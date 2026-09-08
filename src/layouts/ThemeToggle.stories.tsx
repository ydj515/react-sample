import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeToggle } from "./ThemeToggle";

const meta = {
  title: "Layouts/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "투명 배경의 아이콘 버튼. 달은 채움, 해는 선으로 표시하며 현재 다크 모드 여부를 aria-pressed로 제공한다.",
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// 전역 ui-store의 theme 상태를 토글한다. 상단 툴바의 테마 스위처와 함께 확인.
export const Default: Story = {};
