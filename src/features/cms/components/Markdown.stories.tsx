import type { Meta, StoryObj } from "@storybook/react-vite";
import { Markdown } from "./Markdown";

const meta = {
  title: "Features/CMS/Markdown",
  component: Markdown,
  args: {
    source:
      "## 게시글 미리보기\n\n**강조**와 `코드`, [문서](/docs)\n\n- 접근성\n- 안전한 렌더링\n\n> HTML은 텍스트로 표시합니다.",
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
