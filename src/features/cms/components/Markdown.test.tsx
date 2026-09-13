import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown } from "./Markdown";
import { safeMarkdownUrl } from "@/features/cms/model/markdown-url";

describe("safe Markdown", () => {
  it("renders headings, lists, quotes, code, bold and links", () => {
    render(
      <Markdown
        source={
          "# 제목\n\n**강조** `값` [문서](/docs)\n- 하나\n- 둘\n1. 첫째\n> 인용\n```js\nalert(1)\n```"
        }
      />,
    );
    expect(screen.getByRole("heading", { name: "제목" })).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute(
      "href",
      "/docs",
    );
    expect(screen.getByText("alert(1)")).toBeVisible();
  });
  it("does not execute HTML or unsafe links", () => {
    render(
      <Markdown
        source={"<img src=x onerror=alert(1)>\n[위험](javascript:alert)"}
      />,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("위험")).toBeVisible();
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.test",
    "/\\evil.test",
    "invalid",
  ])("rejects %s", (url) => expect(safeMarkdownUrl(url)).toBeNull());
  it("allows explicit HTTPS", () =>
    expect(safeMarkdownUrl("https://example.com/docs")).toBe(
      "https://example.com/docs",
    ));
});
