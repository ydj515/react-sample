import { loadManagementApi } from "@/mocks/storybook/load-management-api";
import { FormDocs } from "@/shared/lib/storybook/form-docs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import { withManagementApi } from "@/mocks/storybook/with-management-api";
import { Card } from "@/shared/ui/card";
import { UserAccessForm } from "./UserAccessForm";

const meta = {
  title: "Features/Users/AccessForm",
  component: UserAccessForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      page: FormDocs,
      story: { inline: false, height: 820 },
      description: {
        component:
          "역할·이용 상태와 세부 권한을 저장하는 샘플입니다. 실제 로그인 세션의 접근 권한은 바꾸지 않습니다.",
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
  args: { user: managementFixture.users[0]! },
} satisfies Meta<typeof UserAccessForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Invited: Story = {
  args: {
    user: managementFixture.users.find((user) => user.status === "invited")!,
  },
};
export const Suspended: Story = {
  args: {
    user: managementFixture.users.find((user) => user.status === "suspended")!,
  },
};
export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(
      canvas.getByLabelText("사용자 역할"),
      "manager",
    );
    await userEvent.click(
      canvas.getByRole("switch", { name: "상품 리뷰 작성" }),
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "변경 사항 저장" }),
    );
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "변경 사항 저장" }),
      ).toBeDisabled(),
    );
    await expect(
      canvas.getByRole("switch", { name: "상품 리뷰 작성" }),
    ).not.toBeChecked();
  },
};
export const SaveError: Story = {
  args: {
    user: { ...managementFixture.users[0]!, id: "missing-access-story" },
  },
  parameters: {
    docs: {
      description: {
        story: "삭제된 사용자에 대한 저장 실패와 입력 보존을 확인합니다.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(
      canvas.getByLabelText("사용자 역할"),
      "viewer",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "변경 사항 저장" }),
    );
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "사용자를 찾을 수 없습니다.",
    );
    await expect(canvas.getByLabelText("사용자 역할")).toHaveValue("viewer");
    await expect(canvas.getByLabelText("사용자 역할")).toBeEnabled();
  },
};
