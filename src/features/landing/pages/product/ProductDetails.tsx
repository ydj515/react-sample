import { useState } from "react";
import { SlidersHorizontal, AudioLines, Feather } from "lucide-react";
import { Button } from "@/shared/ui/button";
const details = [
  {
    name: "디자인",
    number: "01",
    icon: Feather,
    title: "손에 닿는 모든 순간까지.",
    text: "매트한 아이보리 셸과 부드러운 패브릭, 단정한 알루미늄 프레임. 오래 곁에 두고 싶은 물건의 감각을 담았습니다.",
    metric: "260 g",
    label: "가볍게 머무는 무게 · 가상 사양",
  },
  {
    name: "사운드",
    number: "02",
    icon: AudioLines,
    title: "작은 소리에도, 깊은 공간.",
    text: "악기 사이의 숨과 목소리의 질감까지. 매일 듣던 플레이리스트에서 새로운 디테일을 발견하는 경험을 상상합니다.",
    metric: "40 mm",
    label: "커스텀 드라이버 · 가상 사양",
  },
  {
    name: "컨트롤",
    number: "03",
    icon: SlidersHorizontal,
    title: "화면을 보지 않아도, 자연스럽게.",
    text: "손끝으로 구분하는 물리 다이얼. 볼륨을 조절하고 곡을 넘기는 순간에도 음악에 집중할 수 있도록 구성했습니다.",
    metric: "01 dial",
    label: "익숙한 조작, 하나의 다이얼",
  },
];
export function ProductDetails() {
  const [selected, setSelected] = useState(0);
  const detail = details[selected]!;
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      <div className="relative overflow-hidden bg-[#e7e6e3]">
        <img
          src="/landing-images/forma-headphones.png"
          alt="아이보리 이어컵과 알루미늄 프레임, 오렌지색 다이얼을 갖춘 FORMA 헤드폰"
          width={1536}
          height={1024}
          loading="lazy"
          className="h-full min-h-72 w-full object-cover"
        />
        <span className="absolute top-5 left-5 bg-white/90 px-3 py-2 font-mono text-xs text-[#262624]">
          DETAIL / {detail.number}
        </span>
      </div>
      <div className="flex flex-col justify-center">
        <div
          className="mb-10 flex flex-wrap gap-2"
          role="group"
          aria-label="제품 특징"
        >
          {details.map((item, i) => (
            <Button
              key={item.name}
              variant={selected === i ? "primary" : "secondary"}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <item.icon className="size-4" aria-hidden />
              {item.name}
            </Button>
          ))}
        </div>
        <div aria-live="polite">
          <p className="text-brand font-mono text-xs">
            DESIGNED AROUND YOU / {detail.number}
          </p>
          <h3 className="mt-5 text-3xl leading-tight font-semibold sm:text-4xl">
            {detail.title}
          </h3>
          <p className="text-ink-muted mt-6 max-w-md text-sm leading-8">
            {detail.text}
          </p>
          <p className="mt-10 font-mono text-4xl">{detail.metric}</p>
          <p className="text-ink-subtle mt-3 text-xs">{detail.label}</p>
        </div>
      </div>
    </div>
  );
}
