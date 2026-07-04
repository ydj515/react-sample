import type { Meta, StoryObj } from "@storybook/react-vite";

import { toast, useToastStore } from "@/stores/toast-store";

import { Button } from "./button";
import { Toaster } from "./toast";

const meta = {
  title: "Shared/UI/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      // 스토리 간 토스트가 누적되지 않도록 초기화한다.
      useToastStore.getState().clear();
      return <Story />;
    },
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// 버튼으로 각 variant의 토스트를 띄워 본다(우측 하단에 표시).
export const Playground: Story = {
  render: () => (
    <div className="flex gap-2 p-8">
      <Button onClick={() => toast.success("프로젝트가 생성되었습니다.")}>
        Success
      </Button>
      <Button
        variant="danger"
        onClick={() => toast.error("요청을 처리하지 못했습니다.")}
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.info("정보 메시지입니다.")}
      >
        Info
      </Button>
      <Toaster />
    </div>
  ),
};
