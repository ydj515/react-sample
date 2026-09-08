import { FormDocs } from "@/shared/lib/storybook/form-docs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import {
  withManagementApi,
  loadManagementApi,
} from "@/mocks/storybook/with-management-api";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/shared/ui/card";
import { orderQueryOptions } from "../queries/order-queries";
import { OrderStatusForm } from "./OrderActions";
const shipping = managementFixture.orders.find(
  (order) => order.status === "배송중",
)!;
const meta = {
  title: "Features/Orders/StatusForm",
  component: OrderStatusForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      page: FormDocs,
      story: { inline: false, height: 300 },
      description: {
        component:
          "대기 → 배송중 → 완료 또는 대기 → 취소 흐름입니다. 저장 응답을 query로 구독하여 가능한 다음 상태도 갱신합니다.",
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
  render: function LiveOrderStatus(args) {
    const query = useQuery({
      ...orderQueryOptions(args.order.id),
      initialData: args.order,
    });
    const order = query.data;
    return (
      <OrderStatusForm key={`${order.id}-${order.status}`} order={order} />
    );
  },
} satisfies Meta<typeof OrderStatusForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Awaiting: Story = {
  args: {
    order: managementFixture.orders.find((order) => order.status === "대기")!,
  },
};
export const Shipping: Story = {};
export const Completed: Story = {
  args: {
    order: managementFixture.orders.find((order) => order.status === "완료")!,
  },
};
export const Cancelled: Story = {
  args: {
    order: managementFixture.orders.find((order) => order.status === "취소")!,
  },
};
export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "상태 변경" }));
    await expect(
      await canvas.findByText(/처리가 종료된 주문입니다/),
    ).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: "상태 변경" }),
    ).not.toBeInTheDocument();
  },
};
export const SaveError: Story = {
  args: { order: { ...shipping, id: "missing-status-story" } },
  parameters: {
    docs: {
      description: {
        story: "존재하지 않는 주문의 상태 변경 요청을 거부하는 예제입니다.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "상태 변경" }));
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "주문을 찾을 수 없습니다.",
    );
  },
};
