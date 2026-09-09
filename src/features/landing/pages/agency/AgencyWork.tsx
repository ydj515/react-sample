import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/shared/ui/dialog";

const projects = [
  {
    name: "Mono Finance",
    category: "프로덕트",
    year: "2026",
    label: "M / F",
    subtitle: "Clarity in every number.",
    background: "bg-indigo-100 text-indigo-950",
    description:
      "복잡한 금융 정보를 읽기 쉬운 흐름으로 정리하는 대시보드 디자인 콘셉트입니다.",
    challenge: "중요한 수치와 다음 행동이 여러 화면으로 분산되어 있었습니다.",
    approach:
      "정보의 우선순위를 정리하고, 요약에서 상세로 이어지는 탐색 구조를 구성했습니다.",
  },
  {
    name: "Still & Slow",
    category: "브랜딩",
    year: "2026",
    label: "still.",
    subtitle: "Make room for less.",
    background: "bg-stone-200 text-stone-900",
    description:
      "느린 일상을 제안하는 라이프스타일 브랜드의 가상 아이덴티티입니다.",
    challenge: "다양한 상품을 하나의 차분한 브랜드 경험으로 연결해야 했습니다.",
    approach:
      "여백, 자연스러운 색상, 짧은 문장을 기준으로 패키지와 디지털 접점을 정리했습니다.",
  },
  {
    name: "Orbit Studio",
    category: "웹사이트",
    year: "2025",
    label: "ORBIT",
    subtitle: "Ideas in motion.",
    background: "bg-violet-200 text-violet-950",
    description:
      "크리에이티브 팀의 작업과 사고 과정을 소개하는 포트폴리오 콘셉트입니다.",
    challenge:
      "작업 결과뿐 아니라 프로젝트를 풀어낸 과정도 전달하고 싶었습니다.",
    approach:
      "큰 작업 이미지와 짧은 이야기의 리듬으로, 프로젝트마다 다른 관점을 담았습니다.",
  },
  {
    name: "Daylight",
    category: "프로덕트",
    year: "2025",
    label: "day / light",
    subtitle: "A little space to grow.",
    background: "bg-amber-100 text-amber-950",
    description:
      "하루의 할 일을 작은 단계로 나누는 루틴 앱의 가상 프로덕트 디자인입니다.",
    challenge: "할 일이 많을수록 첫 행동을 결정하기 어려웠습니다.",
    approach:
      "오늘의 한 가지에 집중하는 화면과 가벼운 완료 피드백을 설계했습니다.",
  },
];
export function AgencyWork() {
  const [category, setCategory] = useState("전체");
  const visible = projects.filter(
    (project) => category === "전체" || project.category === category,
  );
  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="작업 분야"
      >
        {["전체", "프로덕트", "브랜딩", "웹사이트"].map((item) => (
          <Button
            key={item}
            variant={category === item ? "primary" : "secondary"}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <p role="status" className="text-ink-subtle mt-4 text-xs">
        {visible.length}개의 콘셉트 프로젝트
      </p>
      <div className="mt-7 grid gap-x-8 gap-y-12 md:grid-cols-2">
        {visible.map((project, index) => (
          <article key={project.name} className={index % 2 ? "md:pt-14" : ""}>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={`${project.name} 작업 보기`}
                  className="group focus-visible:outline-brand w-full text-left focus-visible:outline-2"
                >
                  <div
                    className={`rounded-panel relative flex aspect-[4/3] flex-col justify-between overflow-hidden p-7 sm:p-10 ${project.background}`}
                  >
                    <div className="flex justify-between text-[10px] font-medium tracking-[0.15em]">
                      <span>FORM & FIELD — CONCEPT</span>
                      <ArrowUpRight
                        className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none"
                        aria-hidden
                      />
                    </div>
                    <div className="relative my-5">
                      <div
                        className="absolute -top-8 right-0 size-36 rounded-full border border-current opacity-15 sm:size-48"
                        aria-hidden
                      />
                      <p className="relative text-4xl leading-tight font-semibold tracking-tighter sm:text-5xl">
                        {project.label}
                      </p>
                    </div>
                    <p className="text-xs">{project.subtitle}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <span className="text-ink-subtle text-xs">
                      {project.category} / {project.year}
                    </span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle className="text-2xl font-bold">
                    {project.name}
                  </DialogTitle>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="작업 상세 닫기"
                    >
                      <X aria-hidden />
                    </Button>
                  </DialogClose>
                </div>
                <DialogDescription className="text-ink-muted mt-3 text-sm leading-7">
                  {project.description}
                </DialogDescription>
                <div
                  className={`rounded-panel my-6 p-10 text-3xl font-semibold ${project.background}`}
                >
                  {project.label}
                </div>
                <div className="space-y-5 text-sm leading-7">
                  <div>
                    <h4 className="font-bold">문제 정의</h4>
                    <p className="text-ink-muted mt-2">{project.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-bold">접근 방식</h4>
                    <p className="text-ink-muted mt-2">{project.approach}</p>
                  </div>
                  <p className="text-ink-subtle text-xs">
                    실제 고객 작업이나 성과를 나타내지 않는 포트폴리오
                    예제입니다.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </article>
        ))}
      </div>
    </>
  );
}
