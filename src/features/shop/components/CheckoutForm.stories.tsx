import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect, userEvent, within } from "storybook/test";
import { CheckoutForm } from "./CheckoutForm";

const meta = {
  title: "Features/Shop/CheckoutForm",
  component: CheckoutForm,
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: { pending: false, disabled: false, onSubmit: fn() },
} satisfies Meta<typeof CheckoutForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByRole("textbox", { name: "받는 분" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "모의 주문 완료하기" }),
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "이름을 2자 이상",
    );
  },
};
export const SaveError: Story = {
  args: {
    error:
      "상품 가격이 변경되었습니다. 갱신된 금액을 확인하고 다시 주문하세요.",
  },
};
export const Pending: Story = { args: { pending: true } };
