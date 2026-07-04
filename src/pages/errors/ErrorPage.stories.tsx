import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorPage } from "./ErrorPage";

const meta = {
  title: "Pages/Errors/ErrorPage",
  component: ErrorPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: new Error("프로젝트 목록을 불러오지 못했습니다."),
    reset: () => {},
  },
};
