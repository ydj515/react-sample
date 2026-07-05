import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeToggle } from "./ThemeToggle";

const meta = {
  title: "Layouts/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// 전역 ui-store의 theme 상태를 토글한다. 상단 툴바의 테마 스위처와 함께 확인.
export const Default: Story = {};
