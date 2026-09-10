import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { ErrorPage } from "./ErrorPage";
import { NotFoundPage } from "./NotFoundPage";
import { TestRouter } from "@/shared/lib/test/TestRouter";

it("sets recovery page titles when no content page remains mounted", async () => {
  const reset = vi.fn();
  const view = render(<ErrorPage error={new Error("Failure")} reset={reset} />);
  expect(
    screen.getByRole("heading", { name: "문제가 발생했습니다." }),
  ).toBeInTheDocument();
  expect(document.title).toBe("문제가 발생했습니다 | React Sample");
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "다시 시도" }));
  expect(reset).toHaveBeenCalledOnce();
  view.unmount();
  render(
    <TestRouter>
      <NotFoundPage />
    </TestRouter>,
  );
  await screen.findByRole("heading", { name: "페이지를 찾을 수 없습니다." });
  expect(document.title).toBe("페이지를 찾을 수 없습니다 | React Sample");
});
