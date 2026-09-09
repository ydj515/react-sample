import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  Clock,
  Code2,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { Button } from "@/shared/ui/button";
import { LandingPage } from "../../components/LandingPage";
import { LandingSection } from "../../components/LandingSection";
import { LandingContainer } from "../../components/LandingContainer";
import { LandingMenu } from "../../components/LandingMenu";
import { LandingFaq } from "../../components/LandingFaq";
import { InquiryDialog } from "../../components/InquiryDialog";
import { CoursePreview } from "./CoursePreview";

const items = [
  { href: "#learn", label: "학습 내용" },
  { href: "#curriculum", label: "커리큘럼" },
  { href: "#instructor", label: "강사" },
  { href: "#tickets", label: "수강권" },
];
const chapters = [
  {
    title: "컴포넌트 시스템의 기초",
    duration: "3개 수업 · 60분",
    lessons: [
      "컴포넌트, 조립 가능한 생각",
      "Props 인터페이스 설계",
      "실습: Button과 Card",
    ],
  },
  {
    title: "합성 패턴과 디자인 토큰",
    duration: "3개 수업 · 75분",
    lessons: [
      "Compound Components",
      "색상과 간격의 공통 언어",
      "실습: 다크 모드 만들기",
    ],
  },
  {
    title: "상태 관리 아키텍처",
    duration: "3개 수업 · 90분",
    lessons: [
      "로컬 상태와 서버 상태",
      "URL에 담는 검색 조건",
      "실습: 장바구니 설계",
    ],
  },
  {
    title: "접근성과 테스트",
    duration: "3개 수업 · 75분",
    lessons: [
      "키보드로 탐색하는 화면",
      "사용자 행동을 검증하는 테스트",
      "최종 실습: 나만의 샘플 페이지",
    ],
  },
];
export function CourseLandingPage() {
  return (
    <LandingPage title="마스터클래스 · 강의 랜딩">
      <header className="bg-surface/95 border-line sticky top-0 z-30 border-b backdrop-blur">
        <LandingContainer className="flex h-20 items-center justify-between gap-3">
          <Link to="/landing" className="flex items-center gap-2 font-bold">
            <BookOpen className="text-brand size-5" aria-hidden />
            마스터클래스
          </Link>
          <nav
            aria-label="강의 메뉴"
            className="text-ink-muted hidden items-center gap-6 text-sm md:flex"
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
        <section className="bg-brand-soft py-14 sm:py-20">
          <LandingContainer>
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
              <div>
                <p className="text-brand text-xs font-semibold tracking-[0.18em]">
                  BUILD WITH UNDERSTANDING
                </p>
                <p className="text-ink-muted mt-6 text-sm">
                  프론트엔드 개발자를 위한 실전 클래스
                </p>
                <h1 className="mt-3 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
                  따라 만드는 코드를 넘어,
                  <br />
                  <span className="text-brand">설계하는 개발자로.</span>
                </h1>
                <p className="text-ink-muted mt-6 max-w-xl leading-8">
                  컴포넌트 시스템부터 상태 관리, 접근성과 테스트까지. 작은
                  예제를 연결하며 나만의 설계 기준을 만들어 보세요.
                </p>
                <div className="mt-7 flex flex-wrap gap-3 text-xs">
                  <span className="bg-surface rounded-control px-3 py-2">
                    중급 · React 기초 필요
                  </span>
                  <span className="bg-surface rounded-control flex items-center gap-2 px-3 py-2">
                    <Clock className="size-3" aria-hidden />총 5시간 · 12개 수업
                  </span>
                </div>
                <Button asChild size="lg" className="mt-8">
                  <a href="#tickets">
                    수강권 살펴보기
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </Button>
              </div>
              <div>
                <CoursePreview />
                <div className="text-ink-muted mt-4 flex justify-between gap-3 text-xs">
                  <span>첫 수업을 읽어보세요</span>
                  <span>가상의 교육 상품 예제</span>
                </div>
              </div>
            </div>
          </LandingContainer>
        </section>
        <LandingContainer className="grid gap-12 py-16 lg:grid-cols-[1fr_280px] lg:py-20">
          <div className="min-w-0 space-y-20">
            <section id="learn" className="scroll-mt-28">
              <p className="text-brand text-xs font-semibold tracking-widest">
                WHAT YOU WILL LEARN
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                코드에 이유를 더하는 시간
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  "재사용 가능한 컴포넌트의 책임 나누기",
                  "합성 패턴으로 유연한 화면 구성하기",
                  "디자인 토큰과 테마 시스템 만들기",
                  "서버 상태와 클라이언트 상태 구분하기",
                  "키보드와 스크린리더를 고려하기",
                  "사용자 행동 중심의 테스트 작성하기",
                ].map((text) => (
                  <p
                    key={text}
                    className="text-ink-muted flex gap-3 text-sm leading-7"
                  >
                    <Check
                      className="text-brand mt-1 size-4 shrink-0"
                      aria-hidden
                    />
                    {text}
                  </p>
                ))}
              </div>
            </section>
            <section id="curriculum" className="scroll-mt-28">
              <p className="text-brand text-xs font-semibold tracking-widest">
                THE LEARNING PATH
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                작게 시작해서, 하나의 제품으로
              </h2>
              <p className="text-ink-muted mt-4 text-sm">
                4개 챕터 · 12개 수업 · 총 5시간
              </p>
              <div className="border-line rounded-panel mt-8 overflow-hidden border">
                {chapters.map((chapter, i) => (
                  <details
                    key={chapter.title}
                    className="group border-line border-b last:border-b-0"
                  >
                    <summary className="bg-surface-muted focus-visible:outline-brand flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                      <span className="text-brand text-lg font-semibold">
                        0{i + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">
                          {chapter.title}
                        </span>
                        <span className="text-ink-subtle mt-1 block text-xs">
                          {chapter.duration}
                        </span>
                      </span>
                      <ChevronDown
                        className="text-ink-subtle size-4 shrink-0 group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <ul className="space-y-4 p-5">
                      {chapter.lessons.map((lesson, j) => (
                        <li
                          key={lesson}
                          className="text-ink-muted flex items-center gap-3 text-sm"
                        >
                          <Code2
                            className="text-brand size-4 shrink-0"
                            aria-hidden
                          />
                          <span>{lesson}</span>
                          <span className="text-ink-subtle ml-auto shrink-0 text-xs">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>
            <section id="instructor" className="scroll-mt-28">
              <p className="text-brand text-xs font-semibold tracking-widest">
                MEET YOUR INSTRUCTOR
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                복잡한 개념을, 익숙한 예제로
              </h2>
              <div className="mt-8 flex flex-col gap-6 sm:flex-row">
                <div className="bg-brand-soft text-brand rounded-panel grid size-24 shrink-0 place-items-center text-3xl font-light">
                  JS
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    정샘플
                    <span className="text-ink-subtle ml-3 text-xs font-normal">
                      가상 강사 프로필
                    </span>
                  </h3>
                  <p className="text-brand mt-2 text-sm">
                    프론트엔드 엔지니어 · 컴포넌트 시스템
                  </p>
                  <p className="text-ink-muted mt-4 text-sm leading-7">
                    하나의 정답을 외우기보다 선택의 이유를 설명하는 수업을
                    지향합니다. 이 강의 예제는 React Sample의 실제 컴포넌트와
                    화면 구성을 학습 주제로 사용합니다.
                  </p>
                  <Link
                    to="/docs"
                    className="text-brand mt-4 inline-flex items-center gap-1 text-sm font-medium"
                  >
                    관련 문서 읽기
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </section>
          </div>
          <aside className="hidden lg:block">
            <div className="border-line bg-surface shadow-panel rounded-panel sticky top-28 border p-6">
              <p className="text-brand text-xs font-semibold tracking-widest">
                YOUR NEXT CHAPTER
              </p>
              <h2 className="mt-4 text-lg font-bold">
                실무 프론트엔드 아키텍처
              </h2>
              <p className="mt-5 text-3xl font-semibold">
                ₩99,000
                <span className="text-ink-subtle text-sm font-normal">
                  부터
                </span>
              </p>
              <dl className="text-ink-muted my-6 space-y-4 text-sm">
                {[
                  ["수업", "12개"],
                  ["학습 시간", "5시간"],
                  ["수강 방식", "자율 학습"],
                  ["선수 지식", "React 기초"],
                ].map(([name, value]) => (
                  <div key={name} className="flex justify-between">
                    <dt>{name}</dt>
                    <dd className="text-ink font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button asChild className="w-full">
                <a href="#tickets">수강권 비교</a>
              </Button>
              <p className="text-ink-subtle mt-4 text-xs leading-6">
                실제 강의 판매 없이 선택·신청 흐름을 체험합니다.
              </p>
            </div>
          </aside>
        </LandingContainer>
        <LandingSection id="tickets" className="bg-surface-muted">
          <div className="text-center">
            <p className="text-brand text-xs font-semibold tracking-widest">
              CHOOSE YOUR PACE
            </p>
            <h2 className="mt-4 text-3xl font-bold">내 속도에 맞는 배움</h2>
            <p className="text-ink-muted mt-4">
              원하는 수강권으로 신청 흐름을 체험하세요.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Basic",
                price: "99,000",
                text: "스스로 차근차근",
                benefits: [
                  "12개 수업",
                  "예제 코드와 실습 안내",
                  "자율 학습 체크리스트",
                ],
              },
              {
                name: "Pro",
                price: "159,000",
                text: "함께 완성하는 프로젝트",
                benefits: [
                  "Basic 전체 구성",
                  "프로젝트 리뷰 예시",
                  "학습 로드맵",
                ],
              },
              {
                name: "Mentoring",
                price: "349,000",
                text: "나만의 방향 찾기",
                benefits: [
                  "Pro 전체 구성",
                  "멘토링 세션 구성 예시",
                  "포트폴리오 점검 가이드",
                ],
              },
            ].map((plan) => (
              <article
                key={plan.name}
                className={`bg-surface rounded-panel border p-7 ${plan.name === "Pro" ? "border-brand ring-brand ring-1" : "border-line"}`}
              >
                <p className="text-brand text-xs">{plan.text}</p>
                <h3 className="mt-3 text-2xl font-bold">{plan.name}</h3>
                <p className="mt-6 text-3xl font-semibold">₩{plan.price}</p>
                <ul className="my-7 space-y-4 text-sm">
                  {plan.benefits.map((text) => (
                    <li key={text} className="flex gap-2">
                      <Check
                        className="text-brand size-4 shrink-0"
                        aria-hidden
                      />
                      {text}
                    </li>
                  ))}
                </ul>
                <InquiryDialog
                  label={`${plan.name} 수강 신청`}
                  context={`${plan.name} 수강 체험`}
                  description={`선택한 수강권: ${plan.name} · ₩${plan.price}. 실제 결제나 수강 등록은 발생하지 않습니다.`}
                  variant={plan.name === "Pro" ? "primary" : "secondary"}
                />
              </article>
            ))}
          </div>
        </LandingSection>
        <LandingSection id="faq">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">학습을 시작하기 전에</h2>
            <LandingFaq
              items={[
                {
                  question: "어떤 사전 지식이 필요한가요?",
                  answer:
                    "JavaScript 기초와 React의 props, state를 사용해 본 경험을 전제로 합니다. 관련 개념은 Docs 샘플에서 먼저 읽어볼 수 있습니다.",
                },
                {
                  question: "실제로 수강 등록이 되나요?",
                  answer:
                    "아니요. 수강권 선택과 입력 검증을 보여주는 샘플입니다. 결제, 강의 제공 또는 멘토링 예약은 진행하지 않습니다.",
                },
                {
                  question: "미리보기는 어디에서 볼 수 있나요?",
                  answer:
                    "페이지 상단의 강의 미리보기를 누르면 첫 번째 수업의 글과 코드 예제를 확인할 수 있습니다.",
                },
              ]}
            />
          </div>
        </LandingSection>
      </main>
      <footer className="bg-surface-muted border-line border-t py-10">
        <LandingContainer className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-bold">마스터클래스</p>
            <p className="text-ink-subtle mt-2 text-xs">
              React Sample · 가상 강의와 수강권으로 구성한 예제
            </p>
          </div>
          <nav
            aria-label="강의 하단 메뉴"
            className="text-ink-muted flex gap-6 text-sm"
          >
            <Link to="/landing">모든 샘플</Link>
            <Link to="/docs">학습 문서</Link>
          </nav>
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
