import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Circle, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { LandingContainer } from "../../components/LandingContainer";
export function SaasHero() {
  return (
    <section className="from-brand-soft via-surface to-surface bg-gradient-to-b pt-16 pb-12 sm:pt-24">
      <LandingContainer>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-brand mb-6 text-xs font-semibold tracking-[0.2em]">
            ONE WORKSPACE. EVERY POSSIBILITY.
          </p>
          <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
            좋은 아이디어가
            <br />
            <span className="text-brand">팀의 다음 성과로.</span>
          </h1>
          <p className="text-ink-muted mx-auto mt-6 max-w-xl text-base leading-8 sm:text-lg">
            흩어진 작업과 대화를 한곳에. Nexus에서 프로젝트를 계획하고, 함께
            만들고, 다음 단계로 나아가세요.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="#pricing">
                우리 팀에 맞는 플랜 찾기
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/docs">사용 가이드 보기</Link>
            </Button>
          </div>
          <p className="text-ink-subtle mt-4 text-xs">
            가입 없이 둘러보는 서비스 소개 샘플
          </p>
        </div>
        <div
          className="border-line bg-surface shadow-panel rounded-panel mt-14 overflow-hidden text-left"
          aria-label="프로젝트 보드 미리보기"
        >
          <div className="border-line flex items-center justify-between gap-3 border-b px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="bg-brand text-on-brand rounded-control grid size-7 place-items-center text-xs font-bold">
                N
              </span>
              <span className="text-sm font-semibold">
                Workspace / 웹사이트 리뉴얼
              </span>
            </div>
            <span className="text-ink-subtle hidden text-xs sm:block">
              제품 화면 예시
            </span>
          </div>
          <div className="grid md:grid-cols-[180px_1fr]">
            <aside className="bg-surface-muted border-line hidden space-y-2 border-r p-5 text-xs md:block">
              <p className="text-ink-subtle mb-5 font-medium">워크스페이스</p>
              <p className="bg-brand-soft text-brand rounded-control p-2.5">
                프로젝트 보드
              </p>
              <p className="text-ink-muted p-2.5">내 작업</p>
              <p className="text-ink-muted p-2.5">팀 문서</p>
              <p className="text-ink-muted p-2.5">인사이트</p>
            </aside>
            <div className="min-w-0 p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">더 나은 첫인상을 만들어요</h2>
                  <p className="text-ink-subtle mt-1 text-xs">
                    스프린트 04 · 디자인 시스템 팀
                  </p>
                </div>
                <MoreHorizontal className="text-ink-subtle" aria-hidden />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    name: "할 일",
                    items: ["고객 인터뷰 정리", "컴포넌트 목록 만들기"],
                    icon: Circle,
                  },
                  {
                    name: "진행 중",
                    items: ["새로운 홈 화면", "접근성 체크리스트"],
                    icon: Plus,
                  },
                  {
                    name: "완료",
                    items: ["디자인 토큰 정리", "브랜드 컬러 확정"],
                    icon: Check,
                  },
                ].map((column, index) => (
                  <div
                    key={column.name}
                    className="bg-surface-muted rounded-control p-3"
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold">
                      <column.icon aria-hidden className="text-brand size-3" />
                      {column.name}
                      <span className="text-ink-subtle ml-auto">2</span>
                    </div>
                    {column.items.map((item, i) => (
                      <div
                        key={item}
                        className="border-line bg-surface rounded-control mb-3 border p-3"
                      >
                        <span className="bg-brand-soft text-brand rounded px-1.5 py-1 text-[10px]">
                          {index === 1 ? "Design" : "Product"}
                        </span>
                        <p className="mt-3 text-xs font-medium">{item}</p>
                        <div className="text-ink-subtle mt-5 flex justify-between text-[10px]">
                          <span>Sep {12 + i}</span>
                          <span className="bg-surface-muted grid size-5 place-items-center rounded-full">
                            {i ? "SY" : "JD"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
