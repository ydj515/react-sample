import { MediaPage } from "./MediaPage";
import { mediaSearchSchema } from "@/features/media/model/media-schema";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderBusiness as renderRoutes } from "@/test/render-business";

function renderBusiness(initial: string) {
  return renderRoutes(initial, [
    {
      path: "/files",
      component: MediaPage,
      validateSearch: (search) => mediaSearchSchema.parse(search),
    },
  ]);
}
describe("media workspace", () => {
  it("previews text, closes the dialog and searches files", async () => {
    const user = userEvent.setup();
    renderBusiness("/files");
    await user.click(
      await screen.findByRole("button", { name: "시작하기.txt 미리보기" }),
    );
    expect(
      await screen.findByText(/미디어 라이브러리 사용 안내/),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "다운로드" })).toHaveAttribute(
      "download",
      "시작하기.txt",
    );
    await user.click(screen.getByRole("button", { name: "닫기" }));
    await user.type(screen.getByLabelText("파일 검색"), "없는 파일");
    expect(await screen.findByText("파일이 없습니다.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    expect(
      await screen.findByRole("button", { name: "시작하기.txt 미리보기" }),
    ).toBeVisible();
  });
  it("creates a folder and navigates its tree", async () => {
    const user = userEvent.setup();
    renderBusiness("/files");
    await user.click(
      await screen.findByRole("button", { name: "폴더 만들기" }),
    );
    expect(await screen.findByText("폴더 이름을 입력하세요.")).toBeVisible();
    await user.type(screen.getByLabelText("새 폴더 이름"), "스케치");
    await user.click(screen.getByRole("button", { name: "폴더 만들기" }));
    await user.click(await screen.findByRole("button", { name: "스케치" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "시작하기.txt 미리보기" }),
      ).not.toBeInTheDocument(),
    );
  });
  it("recovers from an invalid folder URL", async () => {
    const user = userEvent.setup();
    renderBusiness("/files?folder=missing");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "폴더를 찾을 수 없습니다.",
    );
    expect(screen.getByLabelText("업로드할 파일")).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "전체 파일로 이동" }));
    expect(
      await screen.findByRole("button", { name: "시작하기.txt 미리보기" }),
    ).toBeVisible();
  });
});
