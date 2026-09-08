import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { DetailTabs } from "./detail-tabs";
const meta = {
  title: "Shared/UI/DetailTabs",
  component: DetailTabs,
  tags: ["autodocs"],
  args: {
    label: "상세 메뉴",
    panelId: "demo-panel",
    value: "profile",
    onChange: fn(),
    tabs: [
      { value: "profile", label: "기본 정보" },
      { value: "orders", label: "주문 내역" },
      { value: "activity", label: "활동 로그" },
      { value: "access", label: "권한 설정" },
    ],
  },
} satisfies Meta<typeof DetailTabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function TabDemo(args) {
    const [value, setValue] = useState(args.value);
    return (
      <>
        <DetailTabs {...args} value={value} onChange={setValue} />
        <div
          role="tabpanel"
          id={args.panelId}
          aria-labelledby={`${args.panelId}-${value}`}
          tabIndex={0}
          className="p-5"
        >
          {args.tabs.find((tab) => tab.value === value)?.label} 콘텐츠
        </div>
      </>
    );
  },
};
