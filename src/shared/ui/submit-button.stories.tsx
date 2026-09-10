import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SubmitButton } from "./submit-button";

const meta = {
  title: "Shared/UI/SubmitButton",
  component: SubmitButton,
  args: { children: "저장", pendingLabel: "저장 중…" },
} satisfies Meta<typeof SubmitButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FormAction: Story = {
  render: function ActionForm(args) {
    const [message, setMessage] = useState("");
    return (
      <form
        className="grid gap-4"
        action={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setMessage("저장했습니다.");
        }}
      >
        <SubmitButton {...args} />
        <p role="status">{message}</p>
      </form>
    );
  },
};
