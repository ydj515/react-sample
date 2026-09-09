import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./CodeBlock";
const meta = {
  title: "Features/Docs/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  args: { language: "bash", code: "mise install\npnpm install\npnpm dev" },
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongLine: Story = {
  args: {
    language: "tsx",
    code: 'const article = { title: "React Sample", description: "A long example that stays inside a horizontally scrollable code block on small screens." };',
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};
