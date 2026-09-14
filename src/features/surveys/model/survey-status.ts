import type { Survey } from "./surveys";

export const surveyStatusLabels: Record<Survey["status"], string> = {
  draft: "초안",
  open: "응답 수집 중",
  closed: "마감",
};
