import { z } from "zod";

export type BillingCycle = "monthly" | "yearly";
export function getPlanPrice(price: number, cycle: BillingCycle) {
  const monthly = cycle === "yearly" ? Math.round(price * 0.8) : price;
  return { monthly, total: cycle === "yearly" ? monthly * 12 : monthly };
}
export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력하세요.")
    .max(80, "80자 이내로 입력하세요."),
  email: z.string().trim().email("이메일 형식을 확인하세요.").max(254),
  message: z.string().trim().max(1000, "1000자 이내로 입력하세요."),
});
export type Inquiry = z.infer<typeof inquirySchema>;
export const landingSamples = [
  {
    to: "/landing/saas",
    number: "01",
    category: "SOFTWARE / SAAS",
    title: "함께 일하는 새로운 방식",
    description: "제품 소개부터 요금제, 데모 신청까지 이어지는 서비스 랜딩.",
    name: "Nexus",
    details: "제품 미리보기 · 요금 전환 · FAQ",
  },
  {
    to: "/landing/course",
    number: "02",
    category: "EDUCATION / COURSE",
    title: "배움이 실력이 되는 순간",
    description: "학습 목표, 강의 미리보기와 커리큘럼을 담은 교육 랜딩.",
    name: "마스터클래스",
    details: "커리큘럼 · 미리보기 · 수강권",
  },
  {
    to: "/landing/agency",
    number: "03",
    category: "CREATIVE / STUDIO",
    title: "좋은 생각을, 좋은 경험으로",
    description: "브랜드의 관점과 작업 사례를 보여주는 스튜디오 랜딩.",
    name: "FORM & FIELD",
    details: "작업 필터 · 프로젝트 상세 · 문의",
  },
  {
    to: "/landing/event",
    number: "04",
    category: "CULTURE / CONFERENCE",
    title: "정해진 답, 그 너머로",
    description: "강한 타이포와 그래픽, 날짜별 프로그램을 담은 컨퍼런스.",
    name: "OFFSCRIPT",
    details: "세션 필터 · 관심 목록 · 참가권",
  },
  {
    to: "/landing/stay",
    number: "05",
    category: "TRAVEL / RETREAT",
    title: "숲의 속도로 머무는 하루",
    description: "따뜻한 색감과 큰 사진으로 공간을 전하는 부티크 숙소.",
    name: "ONYU",
    details: "객실 비교 · 일정 검증 · 숙박비 계산",
  },
  {
    to: "/landing/product",
    number: "06",
    category: "OBJECT / AUDIO",
    title: "음악은 가까이, 일상은 가볍게",
    description: "제품 사진과 세밀한 사양으로 이야기를 풀어가는 오디오 브랜드.",
    name: "FORMA",
    details: "제품 디테일 · 구성 선택 · 금액 계산",
  },
] as const;
