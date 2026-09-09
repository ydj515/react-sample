import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { QueryFeedback } from "./query-feedback";

const meta = {
  title: "Shared/UI/QueryFeedback",
  component: QueryFeedback,
  tags: ["autodocs"],
  args: { pending: true, error: null, onRetry: fn() },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QueryFeedback>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Loading: Story = {};
export const Error: Story = {
  args: {
    pending: false,
    error: new globalThis.Error("데이터를 불러오지 못했습니다."),
  },
};

export const Retrying: Story = {
  args: {
    ...Error.args,
    retrying: true,
    errorMessage: "마지막으로 불러온 데이터를 표시합니다.",
  },
};
