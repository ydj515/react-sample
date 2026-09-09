import { z } from "zod";

export const rooms = {
  forest: {
    name: "Forest Suite",
    price: 280000,
    capacity: 2,
    description: "숲을 향한 창, 둘만의 고요한 시간",
    size: "42 m²",
    detail: "킹 베드 · 프라이빗 테라스 · 티 바",
  },
  garden: {
    name: "Garden House",
    price: 420000,
    capacity: 4,
    description: "함께 머무는 여유로운 정원의 집",
    size: "68 m²",
    detail: "퀸 베드 2개 · 정원 · 다이닝 공간",
  },
} as const;
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜를 선택하세요.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "올바른 날짜를 선택하세요.");
export function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function createStaySchema(today = localDateString()) {
  return z
    .object({
      arrival: dateSchema,
      departure: dateSchema,
      room: z.enum(["forest", "garden"]),
      guests: z.enum(["1", "2", "3", "4"]),
    })
    .superRefine((value, ctx) => {
      if (value.arrival < today)
        ctx.addIssue({
          code: "custom",
          path: ["arrival"],
          message: "오늘 이후 날짜를 선택하세요.",
        });
      const nights =
        (Date.parse(`${value.departure}T00:00:00Z`) -
          Date.parse(`${value.arrival}T00:00:00Z`)) /
        86400000;
      if (nights < 1 || nights > 14)
        ctx.addIssue({
          code: "custom",
          path: ["departure"],
          message: "체크아웃은 체크인 이후, 최대 14박까지 선택하세요.",
        });
      if (Number(value.guests) > rooms[value.room].capacity)
        ctx.addIssue({
          code: "custom",
          path: ["guests"],
          message: `이 객실은 최대 ${rooms[value.room].capacity}명까지 이용할 수 있습니다.`,
        });
    });
}
export type StayValues = z.infer<ReturnType<typeof createStaySchema>>;
export function getStayQuote(value: StayValues) {
  const nights =
    (Date.parse(`${value.departure}T00:00:00Z`) -
      Date.parse(`${value.arrival}T00:00:00Z`)) /
    86400000;
  return { nights, total: nights * rooms[value.room].price };
}
export const productBundles = {
  solo: {
    name: "Solo",
    price: 239000,
    includes: "헤드폰 + 휴대용 파우치 + USB-C 케이블",
  },
  studio: {
    name: "Studio set",
    price: 289000,
    includes: "Solo 구성 + 데스크 스탠드 + 오디오 케이블",
  },
} as const;
export function getProductTotal(
  bundle: keyof typeof productBundles,
  quantity: number,
) {
  return productBundles[bundle].price * quantity;
}
