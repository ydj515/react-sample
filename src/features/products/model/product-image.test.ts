import { afterEach, describe, it, expect, vi } from "vitest";
import { readProductImage } from "./product-image";
afterEach(() => vi.unstubAllGlobals());
describe("product image upload", () => {
  it("허용 이미지 파일을 data URL로 읽는다", async () => {
    await expect(
      readProductImage(new File(["test"], "a.png", { type: "image/png" })),
    ).resolves.toBe("data:image/png;base64,dGVzdA==");
  });
  it("SVG와 2MB 초과 파일을 거부한다", async () => {
    await expect(
      readProductImage(new File(["svg"], "a.svg", { type: "image/svg+xml" })),
    ).rejects.toThrow("PNG, JPEG, WebP");
    await expect(
      readProductImage(
        new File([new Uint8Array(2 * 1024 * 1024 + 1)], "a.png", {
          type: "image/png",
        }),
      ),
    ).rejects.toThrow("2MB");
  });
  it("파일 읽기 오류를 사용자 메시지로 변환한다", async () => {
    vi.stubGlobal(
      "FileReader",
      class {
        onerror?: () => void;
        readAsDataURL() {
          this.onerror?.();
        }
      },
    );
    await expect(
      readProductImage(new File(["x"], "a.png", { type: "image/png" })),
    ).rejects.toThrow("이미지를 읽지 못했습니다");
  });
});
