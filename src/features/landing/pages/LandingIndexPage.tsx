import { landingImages } from "@/features/landing/model/images";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import { shopSearchSchema } from "@/features/shop/model/shop";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { LandingContainer } from "@/features/landing/components/LandingContainer";
import { landingSamples } from "@/features/landing/model/landing";

export function LandingIndexPage() {
  return (
    <LandingPage title="랜딩 페이지 컬렉션">
      <header className="border-line border-b">
        <LandingContainer className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <LayoutTemplate className="text-brand size-5" aria-hidden />
            React Sample
          </Link>
          <ThemeToggle />
        </LandingContainer>
      </header>
      <main id="landing-main" tabIndex={-1}>
        <LandingContainer className="py-16 sm:py-24">
          <p className="text-brand text-xs font-semibold tracking-[0.2em]">
            THE LANDING COLLECTION
          </p>
          <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
            같은 디자인 언어,
            <br />
            서로 다른 첫인상.
          </h1>
          <p className="text-ink-muted mt-6 max-w-2xl leading-8">
            서비스부터 컨퍼런스, 숲속 숙소와 오디오 브랜드까지. 목적에 따라
            달라지는 여섯 가지 디자인과 인터랙션을 둘러보세요.
          </p>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {landingSamples.map((sample, i) => (
              <Link
                to={sample.to}
                key={sample.to}
                className="border-line group rounded-panel focus-visible:outline-brand overflow-hidden border"
              >
                <div
                  className={`relative isolate flex min-h-64 flex-col justify-between overflow-hidden p-7 ${i === 0 ? "bg-brand-soft text-brand" : i === 1 ? "bg-ink text-surface dark:bg-canvas dark:text-ink" : i === 3 ? "bg-[#161b16] text-[#d5fa57]" : i === 4 ? "bg-[#29362d] text-white" : i === 5 ? "bg-[#e7e6e3] text-[#ac4224]" : "bg-surface-muted text-ink"}`}
                >
                  {sample.to === "/landing/stay" && (
                    <>
                      <img
                        {...landingImages.retreat}
                        sizes="(min-width: 1152px) 346px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 -z-20 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 -z-10 bg-black/55" />
                    </>
                  )}
                  {sample.to === "/landing/product" && (
                    <img
                      {...landingImages.product}
                      sizes="(min-width: 1152px) 346px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                      alt=""
                      loading="lazy"
                      className="absolute top-0 -right-12 -z-10 h-full w-full object-cover opacity-25 mix-blend-multiply"
                    />
                  )}
                  {sample.to === "/landing/event" && (
                    <div
                      aria-hidden
                      className="absolute top-10 -right-14 -z-10 size-52 rounded-full border-[28px] border-[#d5fa57]/20"
                    />
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      {sample.number} / {sample.category}
                    </span>
                    <ArrowUpRight
                      className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                      aria-hidden
                    />
                  </div>
                  <div>
                    <p className="mb-3 text-xs opacity-80">{sample.name}</p>
                    <h2
                      className={`text-3xl leading-tight font-semibold tracking-tight ${sample.to === "/landing/stay" ? "font-serif" : ""}`}
                    >
                      {sample.title}
                    </h2>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-ink-muted text-sm leading-7">
                    {sample.description}
                  </p>
                  <p className="text-ink-subtle mt-5 text-xs">
                    {sample.details}
                  </p>
                  <p className="text-brand mt-6 text-sm font-semibold">
                    샘플 둘러보기 →
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="border-line text-ink-muted mt-14 flex flex-wrap gap-6 border-t pt-8 text-sm">
            <Link to="/docs">Blog / Docs</Link>
            <Link to="/shop" search={shopSearchSchema.parse({})}>
              E-commerce
            </Link>
            <Link to="/">관리자 샘플</Link>
          </div>
        </LandingContainer>
      </main>
      <footer className="border-line border-t py-7">
        <LandingContainer className="text-ink-subtle text-xs">
          React Sample · 모든 브랜드, 상품과 작업은 UI 체험을 위한 가상
          콘텐츠입니다.
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
