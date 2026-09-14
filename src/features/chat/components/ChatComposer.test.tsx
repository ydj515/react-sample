import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { ChatComposer } from "./ChatComposer";

it("sends on Enter, keeps Shift+Enter and IME composition as input", async () => {
  const user = userEvent.setup();

  const send = vi.fn();
  render(<ChatComposer disabled={false} onSend={send} onTyping={() => {}} />);
  const input = screen.getByRole("textbox", { name: "메시지" });
  await user.type(input, "첫 줄{Shift>}{Enter}{/Shift}둘째 줄");
  expect(input).toHaveValue("첫 줄\n둘째 줄");
  fireEvent.keyDown(input, { key: "Enter", isComposing: true, keyCode: 229 });
  expect(send).not.toHaveBeenCalled();
  await user.keyboard("{Enter}");
  expect(send).toHaveBeenCalledWith("첫 줄\n둘째 줄");
  expect(input).toHaveValue("");
});
