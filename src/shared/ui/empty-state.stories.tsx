import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Shared/UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: { title: "조건에 맞는 결과가 없습니다.", onReset: fn() },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithoutReset: Story = { args: { onReset: undefined } };
