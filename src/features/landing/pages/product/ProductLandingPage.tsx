import { landingImages } from "../../model/images";
import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, AudioLines } from "lucide-react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { Button } from "@/shared/ui/button";
import { LandingPage } from "../../components/LandingPage";
import { LandingContainer } from "../../components/LandingContainer";
import { LandingSection } from "../../components/LandingSection";
import { LandingMenu } from "../../components/LandingMenu";
import { LandingFaq } from "../../components/LandingFaq";
import { ProductDetails } from "./ProductDetails";
import { ProductConfigurator } from "./ProductConfigurator";
import "../experience.css";

const links = [
  { href: "#details", label: "디테일" },
  { href: "#specs", label: "사양" },
  { href: "#configure", label: "구성 선택" },
];
export function ProductLandingPage() {
  return (
    <LandingPage title="FORMA One · 오디오 제품" className="landing-product">
      <header className="bg-surface/95 border-line sticky top-0 z-30 border-b backdrop-blur">
        <LandingContainer className="flex h-20 items-center justify-between gap-3">
          <Link
            to="/landing"
            className="font-mono text-2xl font-bold tracking-[0.12em]"
          >
            FORMA<span className="text-brand">.</span>
          </Link>
          <nav
            aria-label="제품 메뉴"
            className="text-ink-muted hidden gap-8 font-mono text-xs md:flex"
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
        <section className="bg-[#e7e6e3] text-[#262624]">
          <LandingContainer className="relative pt-10 pb-8 sm:pt-14">
            <div className="flex justify-between gap-4 font-mono text-[10px] tracking-widest">
              <p>OBJECTS FOR EVERYDAY LISTENING</p>
              <p>EST. 2026 / CONCEPT 01</p>
            </div>
            <h1 className="relative z-10 mt-10 text-[clamp(3.5rem,13vw,4rem)] leading-none font-semibold tracking-tighter sm:text-[clamp(3.5rem,8vw,7.25rem)]">
              Less noise.
              <br className="sm:hidden" />
              <span className="text-[#ac4224]"> More you.</span>
            </h1>
            <div className="grid items-center gap-5 lg:grid-cols-[1fr_2fr]">
              <div className="relative z-10 order-2 pb-6 lg:order-1">
                <p className="font-mono text-xs">
                  FORMA ONE / WIRELESS HEADPHONES
                </p>
                <h2 className="mt-5 text-3xl leading-tight font-medium">
                  음악은 가까이.
                  <br />
                  일상은 가볍게.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-8 text-[#595952]">
                  좋아하는 소리에 집중하는 가장 자연스러운 방식. 쓰는 순간보다
                  함께하는 시간을 생각한 헤드폰.
                </p>
                <Button
                  asChild
                  className="mt-7 bg-[#b94322] text-white hover:bg-[#99351b]"
                >
                  <a href="#configure">
                    나의 구성 선택
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </Button>
              </div>
              <img
                {...landingImages.product}
                sizes="(min-width: 1152px) 712px, (min-width: 1024px) calc((100vw - 84px) * 2 / 3), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                alt="아이보리 쿠션과 오렌지색 다이얼을 갖춘 FORMA One 헤드폰 콘셉트"
                fetchPriority="high"
                className="order-1 w-full mix-blend-multiply lg:order-2"
              />
            </div>
            <div className="mt-5 flex justify-between border-t border-black/20 pt-5 font-mono text-[10px]">
              <span>IVORY / ALUMINIUM / FABRIC</span>
              <span>SCROLL TO EXPLORE ↓</span>
            </div>
          </LandingContainer>
        </section>
        <LandingSection>
          <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
            <h2 className="text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
              기능을 더하는 대신,
              <br />
              감각에 집중했습니다.
            </h2>
            <p className="text-ink-muted text-sm leading-8">
              일상의 물건에는 조용한 질서가 필요합니다. 손끝으로 느끼는 재료,
              익숙한 조작, 그리고 오래 들어도 편안한 형태. FORMA가 생각하는
              오디오의 기본입니다.
            </p>
          </div>
        </LandingSection>
        <LandingSection id="details" className="bg-surface-muted">
          <p className="text-brand font-mono text-xs tracking-widest">
            01 / A CLOSER LOOK
          </p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
            작은 차이가 만드는 감각.
          </h2>
          <ProductDetails />
        </LandingSection>
        <section className="bg-[#242624] py-16 text-[#f0f0e9] sm:py-24">
          <LandingContainer>
            <div className="flex items-start justify-between gap-5">
              <p className="font-mono text-xs text-[#c5c9be]">
                A LITTLE ROOM FOR SOUND
              </p>
              <AudioLines className="size-10 text-[#ffb291]" aria-hidden />
            </div>
            <p className="mt-10 max-w-4xl text-4xl leading-tight font-light tracking-tight sm:text-6xl">
              어떤 음악을 듣는지보다,
              <br />
              <span className="text-[#ffb291]">어떤 순간에 함께하는지.</span>
            </p>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {[
                "아침의 첫 플레이리스트",
                "몰입이 필요한 오후",
                "나에게 돌아오는 퇴근길",
              ].map((text, i) => (
                <p key={text} className="border-t border-white/25 pt-5 text-sm">
                  <span className="mr-4 font-mono text-[#ffb291]">
                    0{i + 1}
                  </span>
                  {text}
                </p>
              ))}
            </div>
          </LandingContainer>
        </section>
        <LandingSection id="specs">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-brand font-mono text-xs">02 / THE NUMBERS</p>
              <h2 className="mt-5 text-4xl font-semibold">
                필요한 것,
                <br />
                명확하게.
              </h2>
              <p className="text-ink-subtle mt-5 text-xs leading-7">
                제품 설명 구성을 위한 가상 사양입니다.
                <br />
                실제 성능 또는 인증을 나타내지 않습니다.
              </p>
              <ArrowDownRight
                className="text-brand mt-7 size-12 stroke-1"
                aria-hidden
              />
            </div>
            <dl className="border-line divide-line divide-y border-y">
              {[
                ["드라이버", "40 mm dynamic"],
                ["재생 시간", "최대 40시간 (예시)"],
                ["연결", "Bluetooth / USB-C / 3.5 mm"],
                ["무게", "260 g"],
                ["마감", "Ivory · brushed aluminium"],
                ["조작", "물리 다이얼 + 다기능 버튼"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_1.5fr] gap-4 py-5 text-sm"
                >
                  <dt className="text-ink-subtle">{label}</dt>
                  <dd className="font-mono">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </LandingSection>
        <LandingSection id="configure" className="bg-surface-muted">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-brand font-mono text-xs">03 / MAKE IT YOURS</p>
              <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
                당신의 리듬으로.
              </h2>
              <img
                {...landingImages.product}
                sizes="(min-width: 1152px) 524px, (min-width: 1024px) calc((100vw - 104px) / 2), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                alt="FORMA One 제품 전체 모습"
                loading="lazy"
                className="mt-8 w-full"
              />
              <p className="text-ink-subtle mt-3 text-xs">
                AI 생성 제품 콘셉트 · 스탠드와 부속품은 구성 예시
              </p>
            </div>
            <ProductConfigurator />
          </div>
        </LandingSection>
        <LandingSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-semibold">알아두면 좋은 것들.</h2>
            <LandingFaq
              items={[
                {
                  question: "직접 구매할 수 있나요?",
                  answer:
                    "FORMA One은 가상 제품입니다. 구성과 수량에 따른 금액, 신청 입력 흐름을 체험하며 실제 주문·결제·배송은 발생하지 않습니다.",
                },
                {
                  question: "Studio set은 어떤 구성인가요?",
                  answer:
                    "헤드폰, 파우치, USB-C 케이블의 Solo 구성에 데스크 스탠드와 오디오 케이블을 더한 가상 패키지입니다.",
                },
                {
                  question: "색상을 변경할 수 있나요?",
                  answer:
                    "이번 콘셉트는 Ivory 한 가지 마감입니다. 사진과 사양은 샘플을 위한 창작물입니다.",
                },
              ]}
            />
          </div>
        </LandingSection>
      </main>
      <footer className="border-line border-t py-10">
        <LandingContainer className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-2xl font-bold">FORMA.</p>
            <p className="text-ink-subtle mt-3 text-xs">
              React Sample · 가상 제품 · AI 생성 이미지
            </p>
          </div>
          <Link to="/landing" className="text-brand text-sm">
            모든 랜딩 샘플 ↗
          </Link>
        </LandingContainer>
      </footer>
    </LandingPage>
  );
}
