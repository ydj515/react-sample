import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { QueryFeedback } from "./query-feedback";

it("shows a safe message when a query fails with a non-Error value", () => {
  render(
    <QueryFeedback pending={false} error={{ code: 500 }} onRetry={() => {}} />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "알 수 없는 오류가 발생했습니다.",
  );
});
