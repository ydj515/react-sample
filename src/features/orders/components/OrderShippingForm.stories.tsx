import { FormDocs } from "@/shared/lib/storybook/form-docs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import {
  withManagementApi,
  loadManagementApi,
} from "@/mocks/storybook/with-management-api";
import { Card } from "@/shared/ui/card";
import { OrderShippingForm } from "./OrderShippingForm";

const shipping = managementFixture.orders.find(
  (order) => order.status === "배송중",
)!;
const meta = {
  title: "Features/Orders/ShippingForm",
  component: OrderShippingForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      page: FormDocs,
      story: { inline: false, height: 380 },
      description: {
        component:
          "택배사와 운송장 번호를 저장합니다. 운송장은 영문·숫자·하이픈만 허용합니다.",
      },
    },
  },
  decorators: [
    withManagementApi,
    (Story) => (
      <Card className="max-w-sm p-5">
        <Story />
      </Card>
    ),
  ],
  loaders: [loadManagementApi],
  args: { order: shipping },
} satisfies Meta<typeof OrderShippingForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const BeforeShipment: Story = {
  args: {
    order: managementFixture.orders.find((order) => order.status === "대기")!,
  },
};
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("운송장 번호"));
    await userEvent.type(canvas.getByLabelText("운송장 번호"), "잘못된 번호");
    await userEvent.click(
      canvas.getByRole("button", { name: "배송 정보 저장" }),
    );
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "운송장은 영문, 숫자, 하이픈만 입력하세요.",
    );
  },
};
export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("운송장 번호"));
    await userEvent.type(canvas.getByLabelText("운송장 번호"), "DEMO-20250909");
    await userEvent.click(
      canvas.getByRole("button", { name: "배송 정보 저장" }),
    );
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "배송 정보 저장" }),
      ).toBeDisabled(),
    );
    await expect(canvas.getByLabelText("운송장 번호")).toHaveValue(
      "DEMO-20250909",
    );
  },
};
export const SaveError: Story = {
  args: { order: { ...shipping, id: "missing-shipping-story" } },
  parameters: {
    docs: {
      description: {
        story:
          "삭제된 주문의 배송 정보를 저장할 때 오류와 입력 보존을 확인합니다.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("운송장 번호"));
    await userEvent.type(canvas.getByLabelText("운송장 번호"), "UNSAVED-123");
    await userEvent.click(
      canvas.getByRole("button", { name: "배송 정보 저장" }),
    );
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "주문을 찾을 수 없습니다.",
    );
    await expect(canvas.getByLabelText("운송장 번호")).toHaveValue(
      "UNSAVED-123",
    );
  },
};
