import { z } from "zod";

export const eventSearchSchema = z.object({
  day: z.coerce
    .number()
    .pipe(z.union([z.literal(1), z.literal(2)]))
    .catch(1),
  track: z.enum(["전체", "Design", "Engineering", "Culture"]).catch("전체"),
});
export const agencySearchSchema = z.object({
  category: z.enum(["전체", "프로덕트", "브랜딩", "웹사이트"]).catch("전체"),
});
