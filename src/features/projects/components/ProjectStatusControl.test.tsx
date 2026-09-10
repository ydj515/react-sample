import { useSuspenseQuery } from "@tanstack/react-query";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { ProjectStatusControl } from "./ProjectStatusControl";
import { projectQueryOptions } from "@/features/projects/queries/project-queries";
import { projectsFixture } from "@/mocks/data/projects";
import { server } from "@/mocks/server";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

function Status() {
  const { data } = useSuspenseQuery(projectQueryOptions(projectsFixture[0].id));
  return <ProjectStatusControl project={data} />;
}
describe("optimistic project status", () => {
  it("shows the optimistic badge before the response and commits the server result", async () => {
    let finish!: () => void;
    const gate = new Promise<void>((resolve) => {
      finish = resolve;
    });
    let saved = projectsFixture[0];
    let writes = 0;
    server.use(
      http.get("/api/projects/:id", () => HttpResponse.json(saved)),
      http.patch("/api/projects/:id/status", async () => {
        writes++;
        await gate;
        saved = { ...saved, status: "completed" };
        return HttpResponse.json(saved);
      }),
    );
    renderWithProviders(
      <QueryBoundary>
        <Status />
      </QueryBoundary>,
    );
    const select = await screen.findByRole("combobox", {
      name: "프로젝트 상태 변경",
    });
    await userEvent.setup().selectOptions(select, "completed");
    expect(select).toHaveValue("completed");
    expect(select).toBeDisabled();
    expect(screen.getByText("완료", { selector: "span" })).toBeInTheDocument();
    await act(async () => {
      finish();
    });
    await waitFor(() => expect(select).toBeEnabled());
    expect(select).toHaveValue("completed");
    expect(writes).toBe(1);
  });
  it("rolls back the temporary value on failure and allows another attempt", async () => {
    server.use(
      http.patch("/api/projects/:id/status", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    renderWithProviders(
      <QueryBoundary>
        <Status />
      </QueryBoundary>,
    );
    const select = await screen.findByRole("combobox");
    await userEvent.setup().selectOptions(select, "paused");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "상태를 변경하지 못했습니다",
    );
    expect(select).toHaveValue("active");
    expect(select).toBeEnabled();
    server.resetHandlers();
    await userEvent.setup().selectOptions(select, "paused");
    await waitFor(() => expect(select).toBeEnabled());
    expect(select).toHaveValue("paused");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
