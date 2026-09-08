import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";
const meta = {
  title: "Shared/UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    "aria-label": "관리자 메모",
    placeholder: "처리 내용을 입력하세요.",
    className: "w-80",
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "수정할 수 없는 메모입니다." },
};
