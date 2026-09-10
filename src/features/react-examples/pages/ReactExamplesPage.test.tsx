/* eslint-disable testing-library/no-unnecessary-act -- use(Promise) requires an awaited async act scope when an interaction first suspends. */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReactExamplesPage } from "./ReactExamplesPage";
import { projectsFixture } from "@/mocks/data/projects";
import type { Project } from "@/features/projects/model";

it("shows the shell before deferred data and recovers with a new loader Promise", async () => {
  let reject!: (error: Error) => void;
  const projectsPromise = new Promise<Project[]>((_resolve, fail) => {
    reject = fail;
  });
  const refresh = vi.fn();
  const { rerender } = render(
    <ReactExamplesPage
      requestId="first"
      projectsPromise={projectsPromise}
      onRefresh={refresh}
    />,
  );
  expect(
    screen.getByRole("heading", { name: "React 19 예제" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  await act(async () => {
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "프로젝트 데이터 보기" }));
  });
  expect(
    await screen.findByRole("status", { name: "데이터 로딩 중" }),
  ).toBeInTheDocument();
  await act(async () => {
    reject(new Error("Deferred request failed"));
  });
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Deferred request failed",
  );
  await act(async () => {
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "다시 시도" }));
  });
  expect(refresh).toHaveBeenCalledOnce();
  await act(async () => {
    rerender(
      <ReactExamplesPage
        requestId="second"
        projectsPromise={Promise.resolve(projectsFixture)}
        onRefresh={refresh}
      />,
    );
  });
  expect(await screen.findByText("Design System")).toBeInTheDocument();
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "Context 설명 보기" }));
  expect(screen.getByText(/가장 가까운 Provider/)).toBeInTheDocument();
});

describe("DOM ref ownership", () => {
  it("disconnects the observer when its measured panel is removed", async () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
    try {
      render(
        <ReactExamplesPage
          requestId="observer"
          projectsPromise={Promise.resolve([])}
          onRefresh={() => {}}
        />,
      );
      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: "측정 패널 제거" }));
      expect(disconnect).toHaveBeenCalledOnce();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
