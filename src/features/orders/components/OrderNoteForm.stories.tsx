import { loadManagementApi } from "@/mocks/storybook/load-management-api";
import { FormDocs } from "@/shared/lib/storybook/form-docs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import { withManagementApi } from "@/mocks/storybook/with-management-api";
import { Card } from "@/shared/ui/card";
import { OrderNoteForm } from "./OrderActions";

const meta = {
  title: "Features/Orders/NoteForm",
  component: OrderNoteForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      page: FormDocs,
      story: { inline: false, height: 340 },
      description: {
        component:
          "1~1,000자의 관리자 메모를 저장합니다. 저장이 완료되면 입력을 비웁니다.",
      },
    },
  },
  decorators: [
    withManagementApi,
    (Story) => (
      <Card className="max-w-xl p-5">
        <Story />
      </Card>
    ),
  ],
  loaders: [loadManagementApi],
  args: { orderId: managementFixture.orders[0]!.id },
} satisfies Meta<typeof OrderNoteForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "메모 추가" }));
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "메모를 입력하세요.",
    );
  },
};
export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText("관리자 메모"),
      "수령 확인을 완료했습니다.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "메모 추가" }));
    await waitFor(() =>
      expect(canvas.getByLabelText("관리자 메모")).toHaveValue(""),
    );
  },
};
export const SaveError: Story = {
  args: { orderId: "missing-note-story" },
  parameters: {
    docs: {
      description: {
        story:
          "존재하지 않는 주문에 메모를 저장하면 오류를 표시하고 메모를 보존합니다.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("관리자 메모"), "보존할 메모");
    await userEvent.click(canvas.getByRole("button", { name: "메모 추가" }));
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "주문을 찾을 수 없습니다.",
    );
    await expect(canvas.getByLabelText("관리자 메모")).toHaveValue(
      "보존할 메모",
    );
  },
};
