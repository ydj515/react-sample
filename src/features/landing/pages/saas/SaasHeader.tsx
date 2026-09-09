import { Link } from "@tanstack/react-router";
import { Layers3 } from "lucide-react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { Button } from "@/shared/ui/button";
import { LandingContainer } from "../../components/LandingContainer";
import { LandingMenu } from "../../components/LandingMenu";

const items = [
  { href: "#features", label: "제품" },
  { href: "#workflow", label: "워크플로우" },
  { href: "#pricing", label: "요금제" },
  { href: "#faq", label: "FAQ" },
];
export function SaasHeader() {
  return (
    <header className="bg-surface/95 border-line sticky top-0 z-30 border-b backdrop-blur">
      <LandingContainer className="flex h-20 items-center justify-between gap-4">
        <Link
          to="/landing"
          aria-label="Nexus · 랜딩 샘플"
          className="text-brand flex items-center gap-2 text-xl font-bold"
        >
          <Layers3 aria-hidden />
          Nexus
        </Link>
        <nav
          aria-label="SaaS 메뉴"
          className="hidden items-center gap-7 text-sm md:flex"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-ink-muted hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <a href="#pricing">시작하기</a>
          </Button>
          <LandingMenu items={items} />
        </div>
      </LandingContainer>
    </header>
  );
}
