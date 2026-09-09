import { Link } from "@tanstack/react-router";
import { ArrowDown, Leaf, Sunrise, Coffee } from "lucide-react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { Button } from "@/shared/ui/button";
import { LandingPage } from "../../components/LandingPage";
import { LandingContainer } from "../../components/LandingContainer";
import { LandingSection } from "../../components/LandingSection";
import { LandingMenu } from "../../components/LandingMenu";
import { LandingFaq } from "../../components/LandingFaq";
import { StayRooms } from "./StayRooms";
import { StayPlanner } from "./StayPlanner";
import "../experience.css";
const links = [
  { href: "#story", label: "우리의 공간" },
  { href: "#rooms", label: "객실" },
  { href: "#rituals", label: "머무는 하루" },
  { href: "#plan", label: "여정 계획" },
];
export function StayLandingPage() {
  return (
    <LandingPage title="온유 · 포레스트 리트리트" className="landing-stay">
      <header className="bg-surface/95 border-line sticky top-0 z-30 border-b backdrop-blur">
        <LandingContainer className="flex h-20 items-center justify-between gap-4">
          <Link to="/landing" className="font-serif text-2xl tracking-[0.18em]">
            ONYU
            <span className="ml-2 font-sans text-[10px] tracking-normal">
              온유
            </span>
          </Link>
          <nav
            aria-label="숙소 메뉴"
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
        <section className="relative isolate min-h-[650px] bg-[#253c31] text-white sm:min-h-[740px]">
          <img
            src="/landing-images/forest-retreat.png"
            width={1536}
            height={1024}
            alt="안개 낀 소나무 숲과 반영 연못에 둘러싸인 작은 리트리트"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <LandingContainer className="flex min-h-[650px] flex-col justify-between py-14 sm:min-h-[740px] sm:py-20">
            <p className="text-xs tracking-[0.28em]">A QUIETER WAY TO STAY</p>
            <div>
              <h1 className="font-serif text-[clamp(2rem,10vw,3rem)] leading-tight font-normal tracking-tight sm:text-7xl">
                조금 느리게,
                <br />더 깊이 머무르다.
              </h1>
              <p className="mt-6 max-w-sm text-sm leading-8 text-white/90">
                숲의 속도로 흐르는 하루.
                <br />
                아무것도 하지 않아도 충분한, 온유의 시간.
              </p>
              <Button
                asChild
                variant="secondary"
                className="mt-8 border-white/70 bg-transparent text-white hover:bg-white/10"
              >
                <a href="#rooms">
                  공간 둘러보기
                  <ArrowDown className="size-4" aria-hidden />
                </a>
              </Button>
            </div>
            <div className="flex justify-between gap-5 border-t border-white/40 pt-5 text-[10px] tracking-[0.14em]">
              <span>FOREST RETREAT / KOREA</span>
              <span>FICTIONAL STAY CONCEPT</span>
            </div>
          </LandingContainer>
        </section>
        <LandingSection id="story">
          <div className="mx-auto max-w-2xl text-center">
            <Leaf className="text-brand mx-auto size-7 stroke-1" aria-hidden />
            <p className="text-brand mt-6 text-[10px] tracking-[0.25em]">
              LESS NOISE, MORE NATURE
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-tight sm:text-5xl">
              비워낸 자리에,
              <br />
              당신의 하루가 채워집니다.
            </h2>
            <p className="text-ink-muted mt-8 text-sm leading-8">
              나무의 결, 창에 머무는 빛, 아침의 차 한 잔.
              <br />
              온유는 특별한 무언가를 더하기보다, 일상의 속도를 덜어내는 공간을
              생각합니다. 자연 가까이에서 자신만의 리듬을 찾아보세요.
            </p>
          </div>
        </LandingSection>
        <LandingSection id="rooms" className="bg-surface-muted">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-brand text-[10px] tracking-[0.25em]">
                SPACES TO CALL YOUR OWN
              </p>
              <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
                두 가지 쉼의 모양.
              </h2>
            </div>
            <p className="text-ink-subtle text-xs">
              함께하는 사람에 맞춰 선택하세요.
            </p>
          </div>
          <StayRooms />
        </LandingSection>
        <LandingSection id="rituals">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-brand text-[10px] tracking-[0.25em]">
                THE ART OF DOING LESS
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                작은 순간을
                <br />
                길게 느끼는 하루.
              </h2>
              <p className="text-ink-muted mt-6 text-sm leading-8">
                바쁘게 채운 일정 대신,
                <br />
                마음이 향하는 순간을 따라가 보세요.
              </p>
            </div>
            <div className="border-line divide-line divide-y border-y">
              {[
                {
                  time: "07:00",
                  name: "숲과 함께 깨어나기",
                  text: "천천히 산책하며 아침 공기와 계절의 소리를 느껴보세요.",
                  icon: Sunrise,
                },
                {
                  time: "14:00",
                  name: "한 잔에 담긴 여유",
                  text: "창가의 티 바에서 차를 우리고, 미뤄두었던 책을 펼쳐보세요.",
                  icon: Coffee,
                },
                {
                  time: "20:00",
                  name: "빛이 쉬어가는 저녁",
                  text: "작은 조명 아래에서 오늘의 기억을 한 줄 남겨보세요.",
                  icon: Leaf,
                },
              ].map((item) => (
                <article key={item.time} className="flex gap-5 py-7">
                  <item.icon
                    className="text-brand size-7 shrink-0 stroke-1"
                    aria-hidden
                  />
                  <div>
                    <p className="text-ink-subtle font-mono text-[10px]">
                      {item.time}
                    </p>
                    <h3 className="mt-2 text-lg font-medium">{item.name}</h3>
                    <p className="text-ink-muted mt-3 text-sm leading-7">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </LandingSection>
        <LandingSection id="plan" className="bg-surface-muted">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-brand text-[10px] tracking-[0.25em]">
                MAKE ROOM FOR YOURSELF
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                당신의 쉼을
                <br />
                그려보세요.
              </h2>
              <p className="text-ink-muted mt-6 max-w-sm text-sm leading-8">
                날짜와 객실을 선택하면 예상 숙박비를 확인할 수 있습니다. 일정
                계획 인터랙션을 위한 가상 숙소입니다.
              </p>
            </div>
            <div className="bg-surface border-line border p-6 sm:p-8">
              <StayPlanner />
            </div>
          </div>
        </LandingSection>
        <LandingSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 font-serif text-3xl">
              머무르기 전, 작은 안내.
            </h2>
            <LandingFaq
              items={[
                {
                  question: "실제로 예약할 수 있나요?",
                  answer:
                    "온유는 가상의 숙소입니다. 날짜, 정원, 숙박비 계산을 체험할 수 있지만 실제 재고 조회와 예약은 하지 않습니다.",
                },
                {
                  question: "객실별로 몇 명까지 머무를 수 있나요?",
                  answer:
                    "샘플 기준 Forest Suite는 최대 2명, Garden House는 최대 4명입니다. 최대 14박까지 계획할 수 있습니다.",
                },
                {
                  question: "사진은 실제 숙소인가요?",
                  answer:
                    "이 페이지의 건축과 침실 이미지는 샘플을 위해 AI로 제작한 콘셉트입니다. 실제 숙소의 시설을 나타내지 않습니다.",
                },
              ]}
            />
          </div>
        </LandingSection>
      </main>
      <footer className="bg-[#29362d] py-12 text-[#f4f2e8]">
        <LandingContainer className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-serif text-3xl tracking-[0.2em]">ONYU</p>
            <p className="mt-4 text-xs text-[#cbd4c5]">
              React Sample · 가상 숙소 · AI 생성 공간 이미지
            </p>
          </div>
          <Link to="/landing" className="text-sm">
            다른 랜딩 둘러보기 ↗
          </Link>
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
