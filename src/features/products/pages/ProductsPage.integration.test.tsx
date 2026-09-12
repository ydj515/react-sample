import { managementFixture } from "@/mocks/data/management";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { getProduct } from "@/features/products/api/product-api";
import { renderManagement } from "@/test/render-management";

describe("product management", () => {
  it("재고와 판매 상태를 필터링하고 검색 조건을 초기화한다", async () => {
    const user = userEvent.setup();
    renderManagement("/products");
    await screen.findByRole("navigation", { name: "목록 페이지" });
    await user.click(screen.getByRole("button", { name: "다음 페이지" }));
    await screen.findByText("2 / 3 페이지");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "상품 정렬" }),
      "name",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "재고 조건" }),
      "low",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "판매 상태" }),
      "active",
    );
    await user.type(
      screen.getByRole("textbox", { name: "상품 검색" }),
      "없는상품",
    );
    await screen.findByText("조건에 맞는 상품이 없습니다.");
    await user.click(screen.getByRole("button", { name: "필터 초기화" }));
    await screen.findByRole("navigation", { name: "목록 페이지" });
    expect(screen.getByRole("textbox", { name: "상품 검색" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "재고 조건" })).toHaveValue(
      "all",
    );
    expect(screen.getByRole("combobox", { name: "판매 상태" })).toHaveValue(
      "all",
    );
    expect(screen.getByText("1 / 3 페이지")).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "상품 등록" }));
    await screen.findByRole("heading", { name: "상품 등록" });
    await user.click(screen.getByRole("button", { name: "취소" }));
    await screen.findByRole("heading", { name: "상품 관리" });
  });
  it("입력 검증과 SKU 중복 오류를 수정하여 상품을 등록하고 재고를 수정한다", async () => {
    const user = userEvent.setup();
    renderManagement("/products/new");
    await screen.findByRole("heading", { name: "상품 등록" });
    await user.click(screen.getByRole("button", { name: "상품 저장" }));
    await screen.findByText("상품명은 2자 이상 입력하세요.");
    expect(
      screen.getByRole("textbox", { name: "상품명" }),
    ).toHaveAccessibleDescription("상품명은 2자 이상 입력하세요.");
    await user.type(
      screen.getByRole("textbox", { name: /^상품명/ }),
      "관리 샘플 가방",
    );
    await user.type(screen.getByRole("textbox", { name: /^SKU/ }), "SKU-001");
    await user.type(screen.getByRole("textbox", { name: /^브랜드/ }), "Sample");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "카테고리" }),
      "액세서리",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "판매 상태" }),
      "active",
    );
    await user.clear(
      screen.getByRole("spinbutton", { name: "판매 가격 (원)" }),
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "판매 가격 (원)" }),
      "29000",
    );
    await user.type(
      screen.getByRole("textbox", { name: "태그" }),
      "New{Enter}",
    );
    await user.type(
      screen.getByRole("textbox", { name: "태그" }),
      "new{Enter}",
    );
    await screen.findByText("중복 태그를 제거하세요.");
    await user.clear(screen.getByRole("textbox", { name: "태그" }));
    await user.click(screen.getByRole("button", { name: "New 태그 삭제" }));
    await user.type(screen.getByRole("textbox", { name: "태그" }), "추천");
    await user.click(screen.getByRole("button", { name: "태그 추가" }));
    await user.selectOptions(
      screen.getByRole("combobox", { name: "기본 이미지" }),
      "/product-images/accessory.svg",
    );
    await user.click(screen.getByRole("button", { name: "상품 저장" }));
    await screen.findByText("이미 사용 중인 SKU입니다.");
    await user.clear(screen.getByRole("textbox", { name: "SKU" }));
    await user.type(screen.getByRole("textbox", { name: "SKU" }), "SAMPLE-BAG");
    await user.click(screen.getByRole("button", { name: "상품 저장" }));
    await screen.findByRole("heading", { name: "관리 샘플 가방" });
    expect(screen.getByRole("textbox", { name: "상품 설명" })).toHaveValue("");
    await user.click(screen.getByRole("link", { name: "상품 수정" }));
    await screen.findByRole("heading", { name: "상품 수정" });
    await user.clear(screen.getByRole("spinbutton", { name: "재고 수량" }));
    await user.type(screen.getByRole("spinbutton", { name: "재고 수량" }), "9");
    await user.click(screen.getByRole("button", { name: "상품 저장" }));
    expect(await screen.findByText("9개")).toBeInTheDocument();
  });
  it("이미지를 미리보고 잘못된 업로드를 기본 이미지 선택으로 복구한다", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderManagement("/products/product-1/edit");
    const upload = await screen.findByLabelText("이미지 업로드");
    const file = new File(["image"], "sample.png", { type: "image/png" });
    await user.upload(upload, file);
    await waitFor(() =>
      expect(
        screen.getByRole("img", { name: "상품 이미지 미리보기" }),
      ).toHaveAttribute("src", "data:image/png;base64,aW1hZ2U="),
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "기본 이미지" }),
      "/product-images/shoes.svg",
    );
    await user.upload(upload, file);
    await waitFor(() =>
      expect(
        screen.getByRole("img", { name: "상품 이미지 미리보기" }),
      ).toHaveAttribute("src", "data:image/png;base64,aW1hZ2U="),
    );
    await user.upload(
      upload,
      new File(["<svg/>"], "sample.svg", { type: "image/svg+xml" }),
    );
    await screen.findByRole("alert");
    expect(upload).toHaveAttribute("aria-invalid", "true");
    expect(upload).toHaveAccessibleDescription(
      "PNG, JPEG, WebP 파일을 선택하세요.",
    );
    expect(
      screen.getByRole("combobox", { name: "기본 이미지" }),
    ).toHaveAccessibleDescription("PNG, JPEG, WebP 파일을 선택하세요.");
    expect(screen.getByRole("button", { name: "상품 저장" })).toBeDisabled();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "기본 이미지" }),
      "/product-images/shoes.svg",
    );
    expect(screen.getByRole("button", { name: "상품 저장" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "취소" }));
    await screen.findByRole("heading", { name: "Air Max 90 Essential" });
  });
  it("옵션 재고 합계를 저장하고 판매 통계와 리뷰, 미리보기를 표시한다", async () => {
    const user = userEvent.setup();
    renderManagement("/products/product-1");
    await screen.findByRole("heading", { name: "Air Max 90 Essential" });
    await user.click(screen.getByRole("tab", { name: "재고 · 옵션" }));
    await user.click(screen.getByRole("button", { name: "옵션 추가" }));
    await screen.findByText("색상과 사이즈를 입력하세요.");
    await user.type(screen.getByRole("textbox", { name: "사이즈" }), "250");
    await user.click(screen.getByRole("button", { name: "옵션 추가" }));
    await screen.findByText("중복 없이 최대 30개 옵션을 등록할 수 있습니다.");
    await user.clear(screen.getByRole("textbox", { name: "사이즈" }));
    await user.type(screen.getByRole("textbox", { name: "사이즈" }), "280");
    await user.click(screen.getByRole("button", { name: "옵션 추가" }));
    await user.clear(
      screen.getByRole("spinbutton", { name: "화이트 280 재고" }),
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "화이트 280 재고" }),
      "7",
    );
    await user.click(screen.getByRole("button", { name: "상품 저장" }));
    await waitFor(async () =>
      expect((await getProduct("product-1")).stock).toBe(49),
    );
    await user.click(screen.getByRole("tab", { name: "판매 통계" }));
    const month = screen.getByRole("button", { name: "1월 180개" });
    await user.hover(month);
    expect(screen.getByRole("tooltip")).toHaveTextContent("180개");
    await user.unhover(month);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.click(month);
    expect(screen.getByRole("tooltip")).toHaveTextContent("180개");
    await user.click(screen.getByRole("tab", { name: "리뷰 (3)" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "미리보기" }));
    expect(
      await screen.findByRole("dialog", { name: "상품 미리보기" }),
    ).toHaveTextContent("Air Max 90 Essential");
  });
  it.each(["/products/missing", "/products/missing/edit"])(
    "없는 상품 경로 %s를 안내한다",
    async (path) => {
      renderManagement(path);
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "상품을 찾을 수 없습니다.",
      );
    },
  );
});

it("저장 중 후속 초안 입력을 막고 완료 후 편집을 허용한다", async () => {
  const product = managementFixture.products.find(
    (item) => item.id === "product-2",
  )!;
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  server.use(
    http.put("/api/products/:id", async () => {
      await gate;
      return HttpResponse.json({ ...product, name: "서버 상품명" });
    }),
  );
  const user = userEvent.setup();
  renderManagement("/products/product-2");
  const input = await screen.findByRole("textbox", { name: "상품명" });
  await user.clear(input);
  await user.type(input, "제출할 상품명");
  await user.click(screen.getByRole("button", { name: "상품 저장" }));
  try {
    await screen.findByRole("button", { name: "저장 중…" });
    expect(input).toBeDisabled();
    await user.type(input, "후속 초안");
    expect(input).toHaveValue("제출할 상품명");
  } finally {
    release();
  }
  await waitFor(() => expect(input).toHaveValue("서버 상품명"));
  expect(input).toBeEnabled();
});
