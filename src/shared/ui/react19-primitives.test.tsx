/* eslint-disable testing-library/no-node-access -- Document metadata has no accessible body roles. */
import { createRef, StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";
import { Select } from "./select";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { PageMetadata } from "./page-metadata";

describe("React 19 primitives", () => {
  it("exposes native refs and runs callback cleanup on unmount", () => {
    const input = createRef<HTMLInputElement>();
    const select = createRef<HTMLSelectElement>();
    const textarea = createRef<HTMLTextAreaElement>();
    const cleanup = vi.fn();
    const { unmount } = render(
      <StrictMode>
        <Input aria-label="name" ref={input} />
        <Select ref={select} />
        <Textarea ref={textarea} />
        <Button ref={() => cleanup}>Save</Button>
      </StrictMode>,
    );
    input.current?.focus();
    expect(screen.getByRole("textbox", { name: "name" })).toHaveFocus();
    expect(select.current?.tagName).toBe("SELECT");
    expect(textarea.current?.tagName).toBe("TEXTAREA");
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
  it("hoists metadata and updates the active page without duplicate titles", () => {
    const { rerender, unmount } = render(
      <PageMetadata title="Projects" description="All projects" />,
    );
    expect(document.title).toBe("Projects | React Sample");
    rerender(
      <PageMetadata title="Project Alpha" description="Project detail" />,
    );
    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(
      document.head.querySelector('meta[name="description"]'),
    ).toHaveAttribute("content", "Project detail");
    unmount();
    expect(document.head.querySelector('meta[name="description"]')).toBeNull();
  });
});
