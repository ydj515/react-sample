import { beforeEach, expect, it } from "vitest";
import { useShopStore } from "./shop-store";
import { cartKey } from "@/features/shop/model/shop";
const item = { productId: "p1", color: "white", size: "250", quantity: 1 };
beforeEach(() => useShopStore.setState({ items: [], favorites: [] }));
it("같은 옵션을 합치고 다른 옵션은 분리하며 수량과 삭제를 관리한다", () => {
  const s = useShopStore.getState();
  expect(s.add(item)).toBe(true);
  s.add(item);
  s.add({ ...item, size: "260" });
  expect(useShopStore.getState().items.map((line) => line.quantity)).toEqual([
    2, 1,
  ]);
  s.quantity(cartKey(item), 3);
  expect(useShopStore.getState().items[0]?.quantity).toBe(3);
  s.quantity(cartKey(item), 0);
  expect(useShopStore.getState().items[0]?.quantity).toBe(3);
  s.remove(cartKey(item));
  expect(useShopStore.getState().items).toHaveLength(1);
  s.clear();
  expect(useShopStore.getState().items).toEqual([]);
});
it("옵션 수량과 장바구니 항목 수의 한도를 강제한다", () => {
  const s = useShopStore.getState();
  expect(s.add({ ...item, quantity: 0 })).toBe(false);
  s.add({ ...item, quantity: 99 });
  expect(s.add(item)).toBe(false);
  useShopStore.setState({
    items: Array.from({ length: 50 }, (_, i) => ({
      ...item,
      productId: `p-${i}`,
    })),
  });
  expect(s.add(item)).toBe(false);
});
it("찜을 토글하고 저장한 장바구니를 검증하여 복원한다", async () => {
  const s = useShopStore.getState();
  s.toggleFavorite("p1");
  expect(useShopStore.getState().favorites).toEqual(["p1"]);
  s.toggleFavorite("p1");
  expect(useShopStore.getState().favorites).toEqual([]);
  localStorage.setItem(
    "react-sample-shop",
    JSON.stringify({ version: 1, state: { items: [item], favorites: ["p1"] } }),
  );
  await useShopStore.persist.rehydrate();
  expect(useShopStore.getState().items).toEqual([item]);
  localStorage.setItem(
    "react-sample-shop",
    JSON.stringify({
      version: 1,
      state: { items: [{ ...item, quantity: -1 }], favorites: [] },
    }),
  );
  await useShopStore.persist.rehydrate();
  expect(useShopStore.getState().items).toEqual([item]);
});
