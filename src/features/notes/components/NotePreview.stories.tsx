import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotePreview } from "./NotePreview";

const meta = {
  title: "Features/Notes/Preview",
  component: NotePreview,
} satisfies Meta<typeof NotePreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Markdown: Story = {
  args: {
    source:
      "# 노트\n\n**굵게**와 [링크](https://example.com)\n\n- 태그 정리\n\n```ts\nconst count = 42;\n// 메모\n```",
  },
};
