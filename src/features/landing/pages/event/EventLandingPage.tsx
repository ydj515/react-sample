import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Asterisk } from "lucide-react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { Button } from "@/shared/ui/button";
import { LandingPage } from "../../components/LandingPage";
import { LandingContainer } from "../../components/LandingContainer";
import { LandingSection } from "../../components/LandingSection";
import { LandingMenu } from "../../components/LandingMenu";
import { InquiryDialog } from "../../components/InquiryDialog";
import { EventSchedule } from "./EventSchedule";
import "../experience.css";
const links = [
  { href: "#about", label: "컨퍼런스" },
  { href: "#schedule", label: "프로그램" },
  { href: "#voices", label: "연사" },
  { href: "#passes", label: "참가권" },
];
export function EventLandingPage() {
  return (
    <LandingPage title="OFFSCRIPT · 컨퍼런스" className="landing-event">
      <header className="border-line bg-surface/95 sticky top-0 z-30 border-b backdrop-blur">
        <LandingContainer className="flex h-20 items-center justify-between gap-3">
          <Link
            to="/landing"
            className="flex items-center gap-2 text-xl font-black tracking-tighter"
          >
            <Asterisk aria-hidden className="text-brand size-7" />
            OFFSCRIPT
          </Link>
          <nav
            aria-label="컨퍼런스 메뉴"
            className="hidden gap-7 text-sm md:flex"
          >
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <ThemeToggle />
            <LandingMenu items={links} />
          </div>
        </LandingContainer>
      </header>
      <main id="landing-main" tabIndex={-1}>
        <section className="event-grid overflow-hidden bg-[#161b16] text-[#f2f4ec]">
          <LandingContainer className="relative py-14 sm:py-24">
            <div className="flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.15em] text-[#c2ccb9]">
              <p>DESIGN × TECHNOLOGY × CULTURE</p>
              <p>SEOUL / 12—13 NOV 2026</p>
            </div>
            <div className="relative mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="relative z-10">
                <h1 className="text-[clamp(3.8rem,10vw,8.5rem)] leading-[0.92] font-black tracking-tighter">
                  Beyond
                  <br />
                  <span className="text-[#d5fa57]">the script.</span>
                </h1>
                <p className="mt-7 max-w-md text-base leading-8 text-[#c2ccb9]">
                  정해진 답 너머의 가능성.
                  <br />
                  다르게 생각하고, 함께 만드는 사람들의 이틀.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-[#d5fa57] text-[#17200c] hover:bg-[#e5ff94]"
                >
                  <a href="#passes">
                    나의 자리 찾기
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </Button>
              </div>
              <div
                className="relative min-h-60 self-center lg:min-h-96"
                aria-hidden
              >
                <div className="event-orbit absolute top-0 left-[5%] h-64 w-[90%] sm:h-80 lg:h-96" />
                <div className="event-orbit absolute top-8 left-[5%] h-64 w-[90%] opacity-35 sm:h-80 lg:h-96" />
                <Asterisk className="absolute top-20 left-[42%] size-20 text-[#d5fa57]" />
              </div>
            </div>
            <div className="mt-12 flex items-end justify-between gap-6 border-t border-white/20 pt-6">
              <p className="font-mono text-xs leading-6 text-[#c2ccb9]">
                02 DAYS / 03 TRACKS
                <br />
                ONE SHARED CURIOSITY
              </p>
              <ArrowDownRight
                aria-hidden
                className="size-10 stroke-1 text-[#d5fa57]"
              />
            </div>
          </LandingContainer>
        </section>
        <LandingSection id="about">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            <p className="text-brand font-mono text-xs">01 / WHY WE GATHER</p>
            <div>
              <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
                다음 장면은,
                <br />
                서로 다른 생각이 만날 때.
              </h2>
              <p className="text-ink-muted mt-6 max-w-2xl leading-8">
                디자이너, 개발자, 그리고 새로운 시도를 만드는 사람들. 결과물보다
                그 안의 질문을 나누고, 정답보다 다음 대화를 발견합니다.
              </p>
              <div className="border-line mt-10 grid grid-cols-3 border-t pt-6">
                {[
                  ["02", "함께하는 날"],
                  ["03", "교차하는 분야"],
                  ["05", "시작되는 대화"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-4xl font-light sm:text-5xl">{value}</p>
                    <p className="text-ink-subtle mt-3 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LandingSection>
        <LandingSection id="schedule" className="bg-surface-muted">
          <p className="text-brand font-mono text-xs">02 / THE PROGRAM</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold sm:text-5xl">
              당신의 호기심을 따라.
            </h2>
            <p className="text-ink-subtle text-xs">
              가상 행사 일정 · 관심 목록은 이 화면에서만 유지됩니다.
            </p>
          </div>
          <EventSchedule />
        </LandingSection>
        <LandingSection id="voices">
          <p className="text-brand font-mono text-xs">03 / DIFFERENT VOICES</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
            관점을 넓혀줄 사람들.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "정하나",
                role: "Product Design",
                color: "bg-[#d5fa57] text-[#24300e]",
                initials: "JH",
              },
              {
                name: "윤지후",
                role: "Frontend Engineering",
                color: "bg-[#d9cdf7] text-[#342155]",
                initials: "YJ",
              },
              {
                name: "이로운",
                role: "Creative Culture",
                color: "bg-[#f4c1a6] text-[#572712]",
                initials: "LR",
              },
            ].map((person, i) => (
              <article key={person.name}>
                <div
                  className={`relative flex aspect-[4/3] items-end overflow-hidden p-6 ${person.color}`}
                >
                  <span className="absolute top-5 left-5 font-mono text-xs">
                    VOICE / 0{i + 1}
                  </span>
                  <Asterisk
                    className="absolute -top-8 -right-8 size-52 stroke-1 opacity-20"
                    aria-hidden
                  />
                  <span className="text-7xl font-black tracking-tighter">
                    {person.initials}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{person.name}</h3>
                <p className="text-ink-subtle mt-2 text-sm">
                  {person.role} · 가상 연사
                </p>
              </article>
            ))}
          </div>
        </LandingSection>
        <LandingSection id="passes" className="bg-[#d5fa57] text-[#17200c]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <p className="font-mono text-xs">04 / YOUR NEXT CONVERSATION</p>
              <h2 className="mt-5 text-4xl leading-tight font-bold sm:text-6xl">
                좋은 대화에는
                <br />
                당신의 자리가 필요해요.
              </h2>
              <p className="mt-5 text-sm leading-7">
                가상 참가권으로 신청 폼을 체험하세요.
                <br />
                실제 행사 등록이나 결제는 진행하지 않습니다.
              </p>
            </div>
            <div className="min-w-0 border border-[#17200c]/30 p-5 sm:p-10">
              <p className="font-mono text-sm">FULL EXPERIENCE / 2 DAYS</p>
              <p className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                ₩120,000
              </p>
              <ul className="my-7 space-y-3 text-sm">
                <li>모든 세션과 네트워킹 프로그램</li>
                <li>발표 자료와 참가 키트 구성 예시</li>
                <li>서울 · 샘플 컨벤션 홀</li>
              </ul>
              <InquiryDialog
                label="참가 신청 체험"
                context="OFFSCRIPT 참가 신청"
                description="2일 참가권 · ₩120,000. 이 행사는 가상 샘플입니다."
              />
            </div>
          </div>
        </LandingSection>
      </main>
      <footer className="bg-[#161b16] py-10 text-[#f2f4ec]">
        <LandingContainer className="flex flex-wrap justify-between gap-5">
          <div>
            <p className="text-xl font-black">OFFSCRIPT / 2026</p>
            <p className="mt-3 text-xs text-[#c2ccb9]">
              React Sample · 가상 행사와 연사로 구성한 예제
            </p>
          </div>
          <Link to="/landing" className="text-sm text-[#d5fa57]">
            모든 랜딩 샘플 ↗
          </Link>
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
