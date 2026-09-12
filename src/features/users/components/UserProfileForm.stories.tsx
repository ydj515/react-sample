import { loadManagementApi } from "@/mocks/storybook/load-management-api";
import { FormDocs } from "@/shared/lib/storybook/form-docs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { managementFixture } from "@/mocks/data/management";
import { withManagementApi } from "@/mocks/storybook/with-management-api";
import { UserProfileForm } from "./UserProfileForm";

const meta = {
  title: "Features/Users/ProfileForm",
  component: UserProfileForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      page: FormDocs,
      story: { inline: false, height: 740 },
      description: {
        component:
          "회원 기본 정보를 편집합니다. 저장은 MSW 메모리에 반영되며 스토리를 다시 열면 초기화됩니다.",
      },
    },
  },
  decorators: [
    withManagementApi,
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
  loaders: [loadManagementApi],
  args: { user: managementFixture.users[0]! },
} satisfies Meta<typeof UserProfileForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("닉네임"));
    await userEvent.type(canvas.getByLabelText("닉네임"), "minjun_updated");
    await userEvent.selectOptions(
      canvas.getByLabelText("회원 등급"),
      "Platinum",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "회원 정보 저장" }),
    );
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "회원 정보 저장" }),
      ).toBeDisabled(),
    );
    await expect(canvas.getByLabelText("닉네임")).toHaveValue("minjun_updated");
  },
};
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("이름"));
    await userEvent.click(
      canvas.getByRole("button", { name: "회원 정보 저장" }),
    );
    await expect(await canvas.findByRole("alert")).toBeVisible();
  },
};
export const SaveError: Story = {
  args: {
    user: { ...managementFixture.users[0]!, id: "missing-profile-story" },
  },
  parameters: {
    docs: {
      description: {
        story:
          "삭제된 사용자에 저장을 시도했을 때 오류를 표시하고 입력을 보존합니다.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("닉네임"));
    await userEvent.type(canvas.getByLabelText("닉네임"), "unsaved_profile");
    await userEvent.click(
      canvas.getByRole("button", { name: "회원 정보 저장" }),
    );
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "사용자를 찾을 수 없습니다.",
    );
    await expect(canvas.getByLabelText("닉네임")).toHaveValue(
      "unsaved_profile",
    );
    await expect(canvas.getByLabelText("닉네임")).toBeEnabled();
  },
};
export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-[358px]">
        <Story />
      </div>
    ),
  ],
};
