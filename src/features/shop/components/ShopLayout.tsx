import { useEffect } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { ShoppingBag, Heart, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { useShopStore } from "@/stores/shop-store";
import { shopSearchSchema } from "../model/shop";
export function ShopLayout() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Sample Store | React Sample";
    return () => {
      document.title = previous;
    };
  }, []);
  const items = useShopStore((state) => state.items);
  const count = items.reduce((n, item) => n + item.quantity, 0);
  return (
    <div className="bg-surface text-ink min-h-screen">
      <a
        href="#shop-main"
        className="bg-brand text-on-brand sr-only top-2 left-2 z-50 rounded focus:not-sr-only focus:fixed focus:p-3"
      >
        본문으로 건너뛰기
      </a>
      <div className="bg-brand-soft text-brand py-2 text-center text-xs font-medium">
        새로운 일상을 위한 컬렉션 · 10만 원 이상 무료 배송
      </div>
      <header className="bg-surface/95 border-line sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
          <Link
            to="/shop"
            search={shopSearchSchema.parse({})}
            className="focus-visible:outline-brand flex items-center gap-2.5"
          >
            <span className="bg-brand text-on-brand rounded-control grid size-9 place-items-center">
              <ShoppingBag aria-hidden className="size-5" />
            </span>
            <span className="text-sm font-bold tracking-widest sm:text-base">
              SAMPLE
              <span className="text-ink-subtle ml-1.5 font-normal">STORE</span>
            </span>
          </Link>
          <nav
            aria-label="쇼핑 메뉴"
            className="flex items-center gap-2 sm:gap-5"
          >
            <Link
              to="/shop"
              search={shopSearchSchema.parse({})}
              className="text-ink-muted hover:text-brand hidden text-sm md:block"
            >
              컬렉션
            </Link>
            <Link
              to="/docs"
              className="text-ink-muted hover:text-brand hidden text-sm lg:block"
            >
              Docs
            </Link>
            <Link
              to="/shop"
              search={shopSearchSchema.parse({ favorites: true })}
              aria-label="찜한 상품"
              className="hover:bg-surface-muted focus-visible:outline-brand rounded-control grid size-10 place-items-center"
            >
              <Heart aria-hidden className="size-5" />
            </Link>
            <Link
              to="/shop/cart"
              aria-label={`장바구니 ${count}개`}
              className="hover:bg-surface-muted focus-visible:outline-brand rounded-control relative grid size-10 place-items-center"
            >
              <ShoppingBag aria-hidden className="size-5" />
              {count > 0 && (
                <span className="bg-brand text-on-brand absolute -top-0.5 -right-0.5 min-w-4 rounded-full px-1 text-center text-[10px] leading-4">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main
        id="shop-main"
        tabIndex={-1}
        className="mx-auto min-h-[65vh] max-w-7xl px-5 py-8 outline-none sm:px-8"
      >
        <Outlet />
      </main>
      <footer className="bg-surface-muted border-line mt-10 border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-6 px-5 py-10 sm:px-8">
          <div>
            <p className="text-sm font-bold tracking-widest">SAMPLE STORE</p>
            <p className="text-ink-subtle mt-3 max-w-md text-xs leading-6">
              상품을 고르고 주문까지 경험하는 React 샘플입니다.
              <br />
              모의 주문으로 동작하며 실제 결제나 배송은 발생하지 않습니다.
            </p>
          </div>
          <div className="text-ink-muted flex gap-5 text-sm">
            <Link to="/docs">문서 예제</Link>
            <Link to="/" className="flex items-center gap-1">
              관리자 샘플
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
