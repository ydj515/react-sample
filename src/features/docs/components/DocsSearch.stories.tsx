import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { DocsSearch } from "./DocsSearch";
const meta = {
  title: "Features/Docs/Search",
  component: DocsSearch,
  decorators: [withRouter],
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DocsSearch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Results: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox"), "키보드");
    await expect(
      canvas.getByRole("list", { name: "문서 검색 결과" }),
    ).toBeVisible();
  },
};
export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox"), "없는문서xyz");
    await expect(canvas.getByRole("status")).toHaveTextContent("검색 결과 0개");
  },
};
