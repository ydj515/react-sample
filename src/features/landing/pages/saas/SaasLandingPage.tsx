import { Link } from "@tanstack/react-router";
import {
  Layers3,
  MessagesSquare,
  Workflow,
  ChartNoAxesCombined,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { LandingSection } from "@/features/landing/components/LandingSection";
import { LandingContainer } from "@/features/landing/components/LandingContainer";
import { LandingFaq } from "@/features/landing/components/LandingFaq";
import { SaasHeader } from "./SaasHeader";
import { SaasHero } from "./SaasHero";
import { SaasPricing } from "./SaasPricing";

export function SaasLandingPage() {
  return (
    <LandingPage title="Nexus · SaaS 랜딩">
      <SaasHeader />
      <main id="landing-main" tabIndex={-1}>
        <SaasHero />
        <LandingSection id="features">
          <div className="mb-10 max-w-xl">
            <p className="text-brand text-xs font-semibold tracking-widest">
              LESS FRICTION, MORE FOCUS
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl">
              도구 사이의 틈을 줄이고,
              <br />
              중요한 일에 집중하세요.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: MessagesSquare,
                title: "대화와 작업을 한곳에",
                text: "결정의 맥락이 작업 옆에 남습니다. 새로 합류한 동료도 같은 출발선에서 시작하세요.",
              },
              {
                icon: Workflow,
                title: "우리 팀에 맞는 흐름",
                text: "아이디어부터 완료까지. 단계와 우선순위를 팀의 방식에 맞게 정리하세요.",
              },
              {
                icon: ChartNoAxesCombined,
                title: "다음 행동이 보이는 현황",
                text: "진행 중인 일과 막힌 일을 함께 살펴보며, 다음 스프린트를 준비하세요.",
              },
            ].map((item) => (
              <article key={item.title}>
                <div className="bg-brand-soft text-brand rounded-panel mb-5 inline-flex p-3">
                  <item.icon aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-ink-muted mt-3 text-sm leading-7">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </LandingSection>
        <LandingSection id="workflow" className="bg-surface-muted">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-brand text-xs font-semibold tracking-widest">
                BUILT FOR YOUR EVERYDAY
              </p>
              <h2 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl">
                아이디어에서 완료까지,
                <br />
                한눈에 이어지는 흐름.
              </h2>
              <p className="text-ink-muted mt-5 leading-7">
                계획에 많은 시간을 쓰기보다, 함께 만드는 시간에 집중할 수
                있도록. 단순한 세 단계로 시작하세요.
              </p>
              <Button asChild variant="secondary" className="mt-6">
                <Link to="/docs/$slug" params={{ slug: "getting-started" }}>
                  시작 가이드
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <ol className="space-y-4">
              {[
                {
                  title: "프로젝트를 만들어요",
                  text: "목표와 마감일을 정하고 필요한 작업을 나눕니다.",
                },
                {
                  title: "동료와 맥락을 나눠요",
                  text: "담당자를 정하고 문서와 피드백을 연결합니다.",
                },
                {
                  title: "작은 성과를 쌓아요",
                  text: "완료한 작업을 돌아보고 다음 개선점을 찾습니다.",
                },
              ].map((step, i) => (
                <li
                  key={step.title}
                  className="border-line bg-surface rounded-panel flex gap-5 border p-6"
                >
                  <span className="text-brand text-2xl font-light">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-ink-muted mt-2 text-sm leading-6">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </LandingSection>
        <LandingSection id="pricing">
          <div className="text-center">
            <p className="text-brand text-xs font-semibold tracking-widest">
              SIMPLE PRICING
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              팀의 크기에 맞게 시작하세요
            </h2>
            <p className="text-ink-muted mt-4">
              월간·연간 요금 비교와 신청 흐름을 체험하세요.
            </p>
          </div>
          <SaasPricing />
        </LandingSection>
        <LandingSection id="faq" className="bg-surface-muted">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">시작 전, 궁금한 점</h2>
            <LandingFaq
              items={[
                {
                  question: "무료 체험은 어떻게 시작하나요?",
                  answer:
                    "원하는 플랜의 체험하기 버튼을 누르면 데모 신청 폼을 열 수 있습니다. 실제 계정이나 구독은 만들지 않습니다.",
                },
                {
                  question: "연간 요금은 어떻게 계산하나요?",
                  answer:
                    "연간 플랜은 월간 가격의 20%를 할인한 월 환산 가격을 표시합니다. 카드 아래에서 12개월 합계도 확인할 수 있습니다.",
                },
                {
                  question: "실제 프로젝트 화면도 볼 수 있나요?",
                  answer:
                    "푸터의 관리자 샘플에서 로그인 후 프로젝트, 대시보드와 리포트 화면을 둘러볼 수 있습니다.",
                },
              ]}
            />
          </div>
        </LandingSection>
        <LandingSection className="bg-brand-soft text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            다음 프로젝트의 시작,
            <br className="sm:hidden" /> 조금 더 가볍게.
          </h2>
          <p className="text-ink-muted mt-5 mb-7">
            우리 팀에 맞는 일하는 방식을 찾아보세요.
          </p>
          <Button asChild size="lg">
            <a href="#pricing">
              플랜 살펴보기
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </Button>
        </LandingSection>
      </main>
      <footer className="border-line border-t py-10">
        <LandingContainer className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 font-bold">
              <Layers3 className="text-brand size-5" aria-hidden />
              Nexus
            </p>
            <p className="text-ink-subtle mt-3 text-xs">
              React Sample · 가상 서비스와 요금으로 구성한 랜딩 예제
            </p>
          </div>
          <nav
            aria-label="SaaS 하단 메뉴"
            className="text-ink-muted flex gap-5 text-sm"
          >
            <Link to="/landing">모든 샘플</Link>
            <Link to="/docs">Docs</Link>
            <Link to="/">관리자 샘플</Link>
          </nav>
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
