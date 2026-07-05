import type { Meta, StoryObj } from "@storybook/react-vite";

import { withRouter } from "@/shared/lib/storybook/with-router";

import { NotFoundPage } from "./NotFoundPage";

const meta = {
  title: "Pages/Errors/NotFoundPage",
  component: NotFoundPage,
  tags: ["autodocs"],
  // "대시보드로 이동" Link를 쓰므로 라우터 데코레이터로 감싼다.
  decorators: [withRouter],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
