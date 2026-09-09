import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";

const meta = {
  title: "Shared/UI/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: { "aria-label": "목록 검색", placeholder: "이름 또는 키워드 검색" },
} satisfies Meta<typeof SearchInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
