import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  CheckCircle2,
  ClipboardList,
  History,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { LandingContainer } from "@/features/landing/components/LandingContainer";
import { LandingSection } from "@/features/landing/components/LandingSection";
import { LandingMenu } from "@/features/landing/components/LandingMenu";
import { LandingFaq } from "@/features/landing/components/LandingFaq";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { WizardForm } from "@/features/landing/components/WizardForm";
import "@/features/landing/pages/experience.css";

const links = [
  { href: "#preview", label: "흐름 보기" },
  { href: "#wizard", label: "신청 마법사" },
  { href: "#faq", label: "자주 묻는 질문" },
];

const highlights = [
  {
    icon: ClipboardList,
    title: "단계별 검증",
    text: "다음 버튼을 누를 때 현재 단계의 필드만 Zod로 다시 검사합니다. 다른 단계로 넘어간 뒤 오류가 한꺼번에 나타나는 일을 줄입니다.",
  },
  {
    icon: History,
    title: "초안 자동 저장",
    text: "입력할 때마다 로컬 스토리지에 초안을 저장하고, 페이지를 다시 열면 직전 단계와 값으로 돌아옵니다.",
  },
  {
    icon: Sparkles,
    title: "조건부 필드",
    text: "선택한 프로젝트 종류와 일정에 따라 다음에 보이는 항목이 달라집니다. 디자인이면 선호 스타일, 개발이면 기술 스택, 유연한 일정이면 메모가 나타납니다.",
  },
];

export function WizardLandingPage() {
  return (
    <LandingPage
      title="RHF/Zod 심화 · 다단계 신청서 샘플"
      className="landing-wizard"
    >
      <header className="bg-surface/95 border-line sticky top-0 z-30 border-b backdrop-blur">
        <LandingContainer className="flex h-20 items-center justify-between gap-4">
          <Link to="/landing" className="font-mono text-sm font-bold">
            FORMS/WIZARD
            <span className="text-brand">.</span>
          </Link>
          <nav
            aria-label="신청서 메뉴"
            className="text-ink-muted hidden gap-7 text-xs md:flex"
          >
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LandingMenu items={links} />
          </div>
        </LandingContainer>
      </header>
      <main id="landing-main" tabIndex={-1}>
        <section className="relative isolate bg-[#0d1117] py-20 text-white sm:py-28">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 [background-image:linear-gradient(120deg,rgba(56,189,248,0.25),transparent_55%)] opacity-30"
          />
          <LandingContainer className="flex flex-col gap-10">
            <p className="text-[10px] tracking-[0.3em] text-sky-200">
              RHF × ZOD · ADVANCED FORM PATTERNS
            </p>
            <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
              <div>
                <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
                  한 단계씩 검증하고,
                  <br />
                  <span className="text-sky-300">중단해도 돌아오는</span>
                  <br />
                  다단계 신청서.
                </h1>
                <p className="mt-6 max-w-md text-sm leading-7 text-white/80">
                  React Hook Form과 Zod로 만든 4단계 의뢰 폼입니다. 다음 버튼을
                  누를 때 현재 단계만 검증하고, 입력할 때마다 초안을 저장합니다.
                  새로 고침해도 마지막 단계와 값으로 돌아옵니다.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="mt-8 border-white/60 bg-transparent text-white hover:bg-white/10"
                >
                  <a href="#wizard">
                    마법사 시작
                    <ArrowDown className="size-4" aria-hidden />
                  </a>
                </Button>
              </div>
              <ul className="space-y-4 text-sm leading-6">
                {[
                  {
                    label: "스택",
                    value: "React Hook Form · Zod · superRefine",
                  },
                  { label: "저장소", value: "localStorage (best-effort)" },
                  {
                    label: "조건부 필드",
                    value: "type → 스타일/스택/주제, timeline → 메모",
                  },
                  {
                    label: "검증 범위",
                    value: "현재 단계 필드만 trigger()로 재검증",
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex flex-col gap-1 border-t border-white/15 pt-4"
                  >
                    <span className="text-[10px] tracking-[0.25em] text-white/60">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-white/90">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </LandingContainer>
        </section>

        <LandingSection id="preview">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-brand text-xs font-semibold tracking-[0.25em]">
              HOW IT WORKS
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              세 가지 패턴을 한 화면에서.
            </h2>
            <p className="text-ink-muted mt-5 text-sm leading-7">
              폼이 커질수록 검증과 상태를 어떻게 나눌지가 중요해집니다. 아래
              예제는 단계별 검증과 초안 자동 저장, 조건부 필드를 함께 보여
              줍니다.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="border-line bg-surface rounded-panel border p-6"
              >
                <item.icon className="text-brand size-6 stroke-1" aria-hidden />
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="text-ink-muted mt-3 text-sm leading-7">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </LandingSection>

        <LandingSection id="wizard" className="bg-surface-muted">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-brand text-xs font-semibold tracking-[0.25em]">
                TRY THE WIZARD
              </p>
              <h2 className="mt-5 text-3xl leading-tight font-semibold sm:text-4xl">
                4단계 의뢰서,
                <br />
                직접 작성해 보세요.
              </h2>
              <p className="text-ink-muted mt-5 max-w-sm text-sm leading-7">
                페이지에서 잠시 떨어졌다 돌아와도 입력한 값과 단계가 그대로
                유지됩니다. 다음 버튼을 눌러 현재 단계가 올바른지 확인해 보세요.
              </p>
              <ul className="text-ink-muted mt-7 space-y-3 text-sm leading-6">
                {[
                  "디자인을 고르면 선호 스타일이, 개발을 고르면 기술 스택이, 컨설팅이면 주제가 나타납니다.",
                  "일정을 '유연하게'로 바꾸면 메모 칸이 추가됩니다.",
                  "초안은 같은 브라우저의 로컬 스토리지에 저장되며 전송되지 않습니다.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2
                      className="text-brand mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-line bg-surface rounded-panel border p-6 sm:p-8">
              <WizardForm />
            </div>
          </div>
        </LandingSection>

        <LandingSection id="faq">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-semibold tracking-tight">
              자주 묻는 질문
            </h2>
            <LandingFaq
              items={[
                {
                  question: "초안은 어디에 저장되나요?",
                  answer:
                    "브라우저의 localStorage에만 저장합니다. 같은 기기·같은 브라우저에서 페이지를 다시 열면 마지막 단계와 값으로 복원됩니다. 제출을 완료하거나 '처음부터 다시 작성'을 누르면 초안을 비웁니다.",
                },
                {
                  question: "서버로 전송되나요?",
                  answer:
                    "전송하지 않습니다. 입력값은 어떤 API나 외부 서비스로도 보내지 않으며, 모든 검증과 안내는 브라우저 안에서만 동작합니다.",
                },
                {
                  question: "왜 단계별로 검증하나요?",
                  answer:
                    "전체 스키마를 매번 실행하면 마지막 단계에서 발생한 오류가 첫 단계 입력 아래에 같이 표시되어 혼동을 줍니다. 다음 버튼을 누를 때 trigger()로 현재 단계 필드만 검사해 다음 단계로 넘어갑니다.",
                },
                {
                  question: "조건부 필드는 어떻게 구현했나요?",
                  answer:
                    "watch로 현재 값을 구독하고, 값에 따라 다른 필드를 렌더링합니다. 동시에 Zod의 superRefine으로 같은 규칙을 검사해 두 곳에서 같은 결과를 보장합니다.",
                },
              ]}
            />
          </div>
        </LandingSection>
      </main>
      <footer className="border-line border-t py-10">
        <LandingContainer className="text-ink-subtle flex flex-wrap items-center justify-between gap-4 text-xs">
          <p>Forms / Wizard · React Hook Form × Zod 심화 예제</p>
          <Link to="/landing">모든 랜딩 샘플 ↗</Link>
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
