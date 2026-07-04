import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "Shared/UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    // 모달은 화면 전체에 오버레이가 깔리므로 중앙 정렬 레이아웃이 보기 좋다.
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold text-slate-950 dark:text-slate-50">
          Delete project
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?
        </DialogDescription>
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="danger">Delete</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ),
  // 인터랙션 테스트: 트리거로 모달을 열고 내용 노출 후 닫는다.
  // DialogContent는 포털로 body에 렌더되므로 screen으로 조회한다.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    await expect(await screen.findByText("Delete project")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await expect(screen.queryByText("Delete project")).not.toBeInTheDocument();
  },
};
