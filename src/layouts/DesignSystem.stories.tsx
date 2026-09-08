import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarBrand, SidebarNavigation } from "./SidebarNavigation";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { PageHeader } from "@/shared/ui/page-header";

function DesignSystem() {
  return (
    <div className="bg-canvas text-ink flex min-h-[640px]">
      <aside className="border-line bg-surface hidden w-64 shrink-0 flex-col border-r lg:flex">
        <div className="border-line compact:h-14 flex h-16 items-center border-b px-5">
          <SidebarBrand />
        </div>
        <SidebarNavigation activeGroup="대시보드" compact={false} />
      </aside>
      <div className="min-w-0 flex-1">
        <header className="border-line bg-surface compact:h-14 flex h-16 items-center justify-between gap-4 border-b px-6">
          <div className="w-full max-w-md">
            <GlobalSearch />
          </div>
          <ThemeToggle />
        </header>
        <main className="compact:gap-4 compact:p-4 grid gap-6 p-6">
          <PageHeader
            title="디자인 시스템"
            description="메뉴, 입력, 콘텐츠에 같은 색상과 간격을 적용합니다."
            actions={<Button>주요 작업</Button>}
          />
          <Card className="compact:p-4 grid gap-5 p-5">
            <h2 className="text-sm font-semibold">색상 역할</h2>
            <div className="flex flex-wrap gap-3">
              {[
                ["표면", "bg-surface text-ink border-line"],
                ["보조 표면", "bg-surface-muted text-ink border-line"],
                ["주요 작업", "bg-brand text-on-brand border-brand"],
                ["선택", "bg-brand-soft text-brand border-brand-soft"],
              ].map(([label, className]) => (
                <span
                  key={label}
                  className={`rounded-control border px-4 py-3 text-sm ${className}`}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">대기</Badge>
              <Badge variant="success">완료</Badge>
              <Badge variant="warning">진행 중</Badge>
              <Badge variant="danger">취소</Badge>
              <Badge variant="info">안내</Badge>
            </div>
          </Card>
          <Card className="compact:p-4 grid gap-5 p-5">
            <h2 className="text-sm font-semibold">입력과 버튼</h2>
            <progress
              className="progress-meter w-full"
              aria-label="프로젝트 진행률"
              value={64}
              max={100}
            />
            <div className="flex flex-wrap items-end gap-3">
              <label className="grid gap-2 text-sm">
                이름
                <Input placeholder="보고서 이름" />
              </label>
              <label className="grid gap-2 text-sm">
                기간
                <Select defaultValue="month">
                  <option value="month">이번 달</option>
                  <option value="week">이번 주</option>
                </Select>
              </label>
              <Button>검색</Button>
              <Button variant="secondary">초기화</Button>
              <Button variant="ghost">더 보기</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
const meta = {
  title: "Layouts/DesignSystem",
  component: DesignSystem,
  parameters: { layout: "fullscreen" },
  decorators: [withRouter],
} satisfies Meta<typeof DesignSystem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
