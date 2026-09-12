import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import { useShopStore } from "@/features/shop/store/shop-store";
import { ProductPurchase } from "./ProductPurchase";

const product = {
  ...managementFixture.products[0]!,
  stock: 10,
  variants: [{ color: "화이트", size: "250", stock: 10 }],
};
beforeEach(() => useShopStore.setState({ items: [], favorites: [] }));

it.each(["color", "size", "none"] as const)(
  "%s 옵션 갱신 시 유효하지 않은 선택을 초기화한다",
  async (change) => {
    const user = userEvent.setup();
    const { rerender } = render(<ProductPurchase product={product} />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "사이즈" }),
      "250",
    );
    await user.clear(screen.getByRole("spinbutton", { name: "수량" }));
    await user.type(screen.getByRole("spinbutton", { name: "수량" }), "3");
    const variants =
      change === "none"
        ? []
        : [
            {
              color: change === "color" ? "블랙" : "화이트",
              size: "280",
              stock: 10,
            },
          ];
    rerender(<ProductPurchase product={{ ...product, variants }} />);
    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveValue(1);
    if (change !== "none") {
      const sizes = screen.getByRole("combobox", { name: "사이즈" });
      expect(sizes).toHaveValue("");
      expect(within(sizes).getByRole("option", { name: "280" })).toBeEnabled();
      await user.selectOptions(sizes, "280");
    } else
      expect(
        screen.queryByRole("combobox", { name: "색상" }),
      ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "장바구니 담기" })).toBeEnabled();
  },
);

it("가격과 재고만 갱신되면 유효한 선택과 수량을 유지한다", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<ProductPurchase product={product} />);
  await user.selectOptions(
    screen.getByRole("combobox", { name: "사이즈" }),
    "250",
  );
  await user.clear(screen.getByRole("spinbutton", { name: "수량" }));
  await user.type(screen.getByRole("spinbutton", { name: "수량" }), "3");
  rerender(
    <ProductPurchase
      product={{
        ...product,
        price: 10000,
        stock: 9,
        variants: [{ ...product.variants[0]!, stock: 9 }],
      }}
    />,
  );
  expect(screen.getByRole("combobox", { name: "사이즈" })).toHaveValue("250");
  expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveValue(3);
  expect(screen.getByRole("button", { name: "장바구니 담기" })).toBeEnabled();
});
