import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";
import {
  cartEntrySchema,
  cartKey,
  type CartEntry,
} from "@/features/shop/model/shop";
const savedSchema = z.object({
  items: z
    .array(cartEntrySchema)
    .max(50)
    .refine((items) => new Set(items.map(cartKey)).size === items.length),
  favorites: z.array(z.string()).max(100),
});
type ShopState = {
  items: CartEntry[];
  favorites: string[];
  add: (entry: CartEntry) => boolean;
  quantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toggleFavorite: (id: string) => void;
};
export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      items: [],
      favorites: [],
      add: (entry) => {
        if (!cartEntrySchema.safeParse(entry).success) return false;
        let added = false;
        set((state) => {
          const existing = state.items.find(
            (line) => cartKey(line) === cartKey(entry),
          );
          if (
            (!existing && state.items.length >= 50) ||
            (existing?.quantity ?? 0) + entry.quantity > 99
          )
            return state;
          added = true;
          return {
            items: existing
              ? state.items.map((line) =>
                  line === existing
                    ? { ...line, quantity: line.quantity + entry.quantity }
                    : line,
                )
              : [...state.items, entry],
          };
        });
        return added;
      },
      quantity: (key, quantity) => {
        if (Number.isInteger(quantity) && quantity >= 1 && quantity <= 99)
          set((state) => ({
            items: state.items.map((line) =>
              cartKey(line) === key ? { ...line, quantity } : line,
            ),
          }));
      },
      remove: (key) =>
        set((state) => ({
          items: state.items.filter((line) => cartKey(line) !== key),
        })),
      clear: () => set({ items: [] }),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((value) => value !== id)
            : state.favorites.length < 100
              ? [...state.favorites, id]
              : state.favorites,
        })),
    }),
    {
      name: "react-sample-shop",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        items: state.items,
        favorites: state.favorites,
      }),
      merge: (persisted, current) => {
        const parsed = savedSchema.safeParse(persisted);
        return parsed.success ? { ...current, ...parsed.data } : current;
      },
    },
  ),
);
