import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { LandingContainer } from "../../components/LandingContainer";
import { LandingSection } from "../../components/LandingSection";
import { LandingPage } from "../../components/LandingPage";
import { LandingMenu } from "../../components/LandingMenu";
import { InquiryForm } from "../../components/InquiryForm";
import { AgencyWork } from "./AgencyWork";
const items = [
  { href: "#work", label: "작업" },
  { href: "#approach", label: "방식" },
  { href: "#studio", label: "스튜디오" },
  { href: "#contact", label: "문의" },
];
export function AgencyLandingPage() {
  return (
    <LandingPage title="FORM & FIELD · 에이전시 랜딩">
      <header className="bg-surface/95 border-line sticky top-0 z-30 border-b backdrop-blur">
        <LandingContainer className="flex h-20 items-center justify-between gap-3">
          <Link
            to="/landing"
            className="text-sm font-extrabold tracking-tight sm:text-base"
          >
            FORM <span className="text-brand">&</span> FIELD
            <span className="text-brand">.</span>
          </Link>
          <nav
            aria-label="스튜디오 메뉴"
            className="hidden items-center gap-8 text-sm md:flex"
          >
            {items.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-brand">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LandingMenu items={items} />
          </div>
        </LandingContainer>
      </header>
      <main id="landing-main" tabIndex={-1}>
        <section className="pt-16 pb-12 sm:pt-24 sm:pb-20">
          <LandingContainer>
            <div className="text-ink-subtle flex flex-wrap justify-between gap-3 text-[11px] tracking-[0.15em]">
              <p>INDEPENDENT DESIGN STUDIO</p>
              <p>STRATEGY · IDENTITY · DIGITAL</p>
            </div>
            <div className="mt-10 flex items-end justify-between gap-5">
              <h1 className="text-5xl leading-[1.15] font-semibold tracking-tighter sm:text-7xl lg:text-8xl">
                좋은 생각을,
                <br />
                <span className="text-brand">좋은 경험으로.</span>
              </h1>
              <MoveUpRight
                className="text-brand hidden size-24 shrink-0 stroke-1 md:block"
                aria-hidden
              />
            </div>
            <div className="border-line mt-12 grid gap-6 border-t pt-7 md:grid-cols-2">
              <p className="text-ink-muted max-w-md leading-8">
                브랜드의 본질을 찾고, 사람들이 만나는 형태로 만듭니다. 전략부터
                디지털 경험까지 함께 생각하는 디자인 스튜디오.
              </p>
              <a
                href="#work"
                className="text-brand flex items-center gap-4 self-end font-medium md:justify-self-end"
              >
                선택한 작업들
                <ArrowDown className="size-4" aria-hidden />
              </a>
            </div>
          </LandingContainer>
        </section>
        <LandingSection id="work" className="pt-4 sm:pt-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-ink-subtle text-xs tracking-widest">
                01 / SELECTED WORK
              </p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                서로 다른 문제, 새로운 관점.
              </h2>
            </div>
            <span className="text-ink-subtle hidden text-xs sm:block">
              2025 — 2026 / CONCEPTS
            </span>
          </div>
          <AgencyWork />
        </LandingSection>
        <LandingSection id="approach" className="bg-surface-muted">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-ink-subtle text-xs tracking-widest">
                02 / OUR APPROACH
              </p>
              <h2 className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl">
                좋은 질문에서
                <br />
                시작하는 디자인.
              </h2>
              <p className="text-ink-muted mt-6 max-w-sm text-sm leading-7">
                예쁜 화면 이전에, 필요한 경험을 찾습니다. 각 단계의 생각을
                나누며 같은 방향으로 나아갑니다.
              </p>
            </div>
            <ol className="divide-line divide-y">
              {[
                {
                  title: "Discover",
                  label: "함께 이해하기",
                  text: "사용자와 비즈니스의 맥락을 살펴보고, 해결할 문제를 정의합니다.",
                },
                {
                  title: "Define",
                  label: "방향 정하기",
                  text: "핵심 메시지와 경험 원칙을 정리해 선택의 기준을 만듭니다.",
                },
                {
                  title: "Design",
                  label: "형태 만들기",
                  text: "작은 프로토타입으로 검증하며 브랜드와 화면을 구체화합니다.",
                },
                {
                  title: "Deliver",
                  label: "다음으로 연결하기",
                  text: "실제로 구현할 수 있는 시스템과 가이드를 함께 전달합니다.",
                },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-5 py-6 first:pt-0">
                  <span className="text-brand text-xs">0{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {step.title}
                      <span className="text-ink-subtle ml-3 text-xs font-normal">
                        {step.label}
                      </span>
                    </h3>
                    <p className="text-ink-muted mt-3 text-sm leading-7">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </LandingSection>
        <LandingSection id="studio">
          <p className="text-ink-subtle text-xs tracking-widest">
            03 / WHAT WE DO
          </p>
          <div className="mt-5 grid gap-10 md:grid-cols-2">
            <h2 className="text-3xl leading-tight font-semibold sm:text-4xl">
              작은 팀의 밀도.
              <br />
              경계를 넘는 시선.
            </h2>
            <div>
              <p className="text-ink-muted leading-8">
                브랜드 전략, 시각 디자인, 제품 경험을 연결합니다. 서로 다른
                역할이 일찍부터 함께 생각할 때 더 일관된 경험을 만들 수 있다고
                믿습니다.
              </p>
              <div className="border-line mt-8 grid grid-cols-2 gap-7 border-t pt-7">
                {[
                  { title: "Brand", text: "전략 · 네이밍 · 아이덴티티" },
                  {
                    title: "Digital",
                    text: "웹사이트 · UX/UI · 디자인 시스템",
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-ink-subtle mt-2 text-xs leading-6">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LandingSection>
        <LandingSection id="contact" className="bg-brand-soft">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-brand text-xs tracking-widest">
                04 / START A CONVERSATION
              </p>
              <h2 className="mt-5 text-4xl leading-tight font-semibold sm:text-5xl">
                아직 작은 생각이어도
                <br />
                좋습니다.
              </h2>
              <p className="text-ink-muted mt-6 max-w-sm leading-8">
                만들고 싶은 경험을 들려주세요. 프로젝트 문의 폼의 입력과 완료
                흐름을 체험할 수 있습니다.
              </p>
              <ArrowUpRight
                className="text-brand mt-10 size-12 stroke-1"
                aria-hidden
              />
            </div>
            <div className="border-line bg-surface rounded-panel border p-6 sm:p-8">
              <h3 className="mb-6 text-xl font-semibold">
                프로젝트 이야기하기
              </h3>
              <InquiryForm context="프로젝트 문의" />
            </div>
          </div>
        </LandingSection>
      </main>
      <footer className="py-10">
        <LandingContainer>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-xl font-extrabold tracking-tight">
              FORM & FIELD.
            </p>
            <nav aria-label="스튜디오 하단 메뉴" className="flex gap-5 text-sm">
              <Link to="/landing">모든 샘플</Link>
              <a href="#contact">프로젝트 문의</a>
            </nav>
          </div>
          <p className="text-ink-subtle border-line mt-8 border-t pt-6 text-xs">
            React Sample · 스튜디오와 모든 작업은 가상 콘셉트입니다.
          </p>
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
