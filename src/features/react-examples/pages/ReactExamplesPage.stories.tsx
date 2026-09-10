import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ReactExamplesPage } from "./ReactExamplesPage";
import { projectsFixture } from "@/mocks/data/projects";
import type { Project } from "@/features/projects/model";

const meta = {
  title: "Features/React19/Examples",
  component: ReactExamplesPage,
  args: {
    requestId: "ready",
    projectsPromise: Promise.resolve(projectsFixture),
    onRefresh: fn(),
  },
  argTypes: { projectsPromise: { control: false } },
} satisfies Meta<typeof ReactExamplesPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const Loading: Story = {
  args: { projectsPromise: new Promise<Project[]>(() => {}) },
};
export const RetryError: Story = {
  render: function RetryExample(args) {
    const [attempt, setAttempt] = useState(0);
    const [promise, setPromise] = useState(() => {
      const failed = Promise.reject<Project[]>(
        new Error("데이터를 불러오지 못했습니다."),
      );
      void failed.catch(() => undefined);
      return failed;
    });
    return (
      <ReactExamplesPage
        {...args}
        requestId={String(attempt)}
        projectsPromise={promise}
        onRefresh={() => {
          setPromise(Promise.resolve(projectsFixture));
          setAttempt((value) => value + 1);
        }}
      />
    );
  },
};
