import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatComposer } from "./ChatComposer";

const meta = {
  title: "Features/Chat/Composer",
  component: ChatComposer,
  args: { disabled: false, onSend: () => {}, onTyping: () => {} },
} satisfies Meta<typeof ChatComposer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Blocked: Story = { args: { disabled: true } };
