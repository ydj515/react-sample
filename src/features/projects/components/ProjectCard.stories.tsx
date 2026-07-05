import type { Meta, StoryObj } from "@storybook/react-vite";

import type { Project } from "@/features/projects/model/project-types";
import { withRouter } from "@/shared/lib/storybook/with-router";

import { ProjectCard } from "./ProjectCard";

const sampleProject: Project = {
  id: "project-design-system",
  name: "Design System",
  owner: "Mina",
  status: "active",
  dueDate: "2026-08-01",
  description: "공통 UI 컴포넌트와 토큰을 정리합니다.",
  updatedAt: "2026-07-01T09:00:00.000Z",
};

const meta = {
  title: "Features/Projects/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  // Link를 쓰므로 메모리 라우터 데코레이터로 감싼다.
  decorators: [withRouter],
  parameters: { layout: "padded" },
  args: {
    project: sampleProject,
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Paused: Story = {
  args: {
    project: { ...sampleProject, status: "paused", name: "Billing Revamp" },
  },
};
