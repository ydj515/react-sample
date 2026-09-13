import { z } from "zod";

export const wizardProjectTypes = [
  "design",
  "development",
  "consulting",
] as const;

export const wizardBudgets = [
  "under-300",
  "300-800",
  "800-2000",
  "over-2000",
] as const;

export const wizardTimelines = [
  "within-month",
  "1-3-months",
  "3-6-months",
  "flexible",
] as const;

export const wizardDesignStyles = [
  "minimal",
  "editorial",
  "playful",
  "corporate",
] as const;

const emailSchema = z
  .string()
  .trim()
  .min(1, "이메일을 입력하세요.")
  .email("이메일 형식을 확인하세요.")
  .max(254);

const nameSchema = z
  .string()
  .trim()
  .min(1, "이름을 입력하세요.")
  .max(80, "80자 이내로 입력하세요.");

const organizationSchema = z.string().trim().max(80, "80자 이내로 입력하세요.");

const messageSchema = z
  .string()
  .trim()
  .min(10, "10자 이상 입력하세요.")
  .max(1000, "1000자 이내로 입력하세요.");

const techStackSchema = z.string().trim().max(200, "200자 이내로 입력하세요.");

const consultingTopicSchema = z
  .string()
  .trim()
  .max(200, "200자 이내로 입력하세요.");

const timelineNoteSchema = z
  .string()
  .trim()
  .max(200, "200자 이내로 입력하세요.");

export const wizardBasicsShape = {
  name: nameSchema,
  email: emailSchema,
  organization: organizationSchema,
} as const;

export const wizardProjectShape = {
  type: z.enum(wizardProjectTypes, {
    message: "프로젝트 종류를 선택하세요.",
  }),
  designStyles: z.array(z.enum(wizardDesignStyles)).max(4),
  techStack: techStackSchema,
  consultingTopic: consultingTopicSchema,
} as const;

export const wizardDetailsShape = {
  budget: z.enum(wizardBudgets, {
    message: "예산 범위를 선택하세요.",
  }),
  timeline: z.enum(wizardTimelines, {
    message: "희망 일정을 선택하세요.",
  }),
  timelineNote: timelineNoteSchema,
  message: messageSchema,
  newsletter: z.boolean(),
} as const;

export const wizardBasicsSchema = z
  .object(wizardBasicsShape)
  .superRefine(() => undefined);

export type WizardBasics = z.infer<typeof wizardBasicsSchema>;

export const wizardProjectSchema = z
  .object(wizardProjectShape)
  .superRefine((value, ctx) => {
    if (value.type === "design" && value.designStyles.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["designStyles"],
        message: "선호 스타일을 최소 1개 선택하세요.",
      });
    }
    if (value.type === "development" && value.techStack.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["techStack"],
        message: "기술 스택을 입력하세요. (예: React, Node.js)",
      });
    }
    if (value.type === "consulting" && value.consultingTopic.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["consultingTopic"],
        message: "상담 주제를 입력하세요.",
      });
    }
  });

export type WizardProject = z.infer<typeof wizardProjectSchema>;

export const wizardDetailsSchema = z
  .object(wizardDetailsShape)
  .superRefine((value, ctx) => {
    if (value.timeline === "flexible" && value.timelineNote.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["timelineNote"],
        message: "유연한 일정의 의미를 한 줄로 적어 주세요.",
      });
    }
  });

export type WizardDetails = z.infer<typeof wizardDetailsSchema>;

export const wizardSchema = z
  .object({
    ...wizardBasicsShape,
    ...wizardProjectShape,
    ...wizardDetailsShape,
  })
  .superRefine((value, ctx) => {
    if (value.type === "design" && value.designStyles.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["designStyles"],
        message: "선호 스타일을 최소 1개 선택하세요.",
      });
    }
    if (value.type === "development" && value.techStack.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["techStack"],
        message: "기술 스택을 입력하세요. (예: React, Node.js)",
      });
    }
    if (value.type === "consulting" && value.consultingTopic.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["consultingTopic"],
        message: "상담 주제를 입력하세요.",
      });
    }
    if (value.timeline === "flexible" && value.timelineNote.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["timelineNote"],
        message: "유연한 일정의 의미를 한 줄로 적어 주세요.",
      });
    }
  });

export type WizardValues = z.infer<typeof wizardSchema>;

export type WizardProjectType = (typeof wizardProjectTypes)[number];

export type WizardBudget = (typeof wizardBudgets)[number];

export type WizardTimeline = (typeof wizardTimelines)[number];

export type WizardDesignStyle = (typeof wizardDesignStyles)[number];

export const wizardDefaultValues: WizardValues = {
  name: "",
  email: "",
  organization: "",
  type: "design",
  designStyles: [],
  techStack: "",
  consultingTopic: "",
  budget: "300-800",
  timeline: "1-3-months",
  timelineNote: "",
  message: "",
  newsletter: false,
};

export const wizardSteps = [
  {
    id: "basics",
    title: "기본 정보",
    description: "이름과 연락처를 알려 주세요.",
    fields: ["name", "email", "organization"] as const,
  },
  {
    id: "project",
    title: "프로젝트 종류",
    description: "원하는 작업을 선택하면 다음 항목이 달라집니다.",
    fields: ["type", "designStyles", "techStack", "consultingTopic"] as const,
  },
  {
    id: "details",
    title: "예산과 일정",
    description: "범위와 일정을 함께 정하면 더 빠르게 답할 수 있어요.",
    fields: [
      "budget",
      "timeline",
      "timelineNote",
      "message",
      "newsletter",
    ] as const,
  },
  {
    id: "review",
    title: "검토",
    description: "입력 내용을 마지막으로 확인하고 제출합니다.",
    fields: [] as const,
  },
] as const;

export type WizardStepId = (typeof wizardSteps)[number]["id"];

export function getWizardStepIndex(id: WizardStepId) {
  return wizardSteps.findIndex((step) => step.id === id);
}

export function isWizardStepId(value: string): value is WizardStepId {
  return wizardSteps.some((step) => step.id === value);
}

export const wizardBudgetLabels: Record<WizardBudget, string> = {
  "under-300": "300만원 미만",
  "300-800": "300만원 - 800만원",
  "800-2000": "800만원 - 2,000만원",
  "over-2000": "2,000만원 이상",
};

export const wizardTimelineLabels: Record<WizardTimeline, string> = {
  "within-month": "한 달 이내",
  "1-3-months": "1 - 3개월",
  "3-6-months": "3 - 6개월",
  flexible: "유연하게",
};

export const wizardProjectTypeLabels: Record<WizardProjectType, string> = {
  design: "디자인",
  development: "개발",
  consulting: "컨설팅",
};

export const wizardDesignStyleLabels: Record<WizardDesignStyle, string> = {
  minimal: "미니멀",
  editorial: "에디토리얼",
  playful: "플레이풀",
  corporate: "코퍼레이트",
};

export type WizardDraft = {
  version: 1;
  savedAt: string;
  values: WizardValues;
  step: WizardStepId;
};

export function serializeWizardDraft(
  values: WizardValues,
  step: WizardStepId,
): WizardDraft {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    values,
    step,
  };
}

export function parseWizardDraft(input: unknown): WizardDraft | null {
  if (!input || typeof input !== "object") return null;
  const draft = input as Partial<WizardDraft>;
  if (draft.version !== 1) return null;
  if (typeof draft.savedAt !== "string") return null;
  if (typeof draft.step !== "string" || !isWizardStepId(draft.step)) {
    return null;
  }
  const rawValues = (draft.values ?? {}) as Record<string, unknown>;

  const safeValues: Partial<WizardValues> = {};
  for (const [key, value] of Object.entries(rawValues)) {
    if (value === undefined || value === null) continue;
    if (key === "designStyles" && Array.isArray(value)) {
      const filtered = value.filter((item): item is WizardDesignStyle =>
        wizardDesignStyles.includes(item as WizardDesignStyle),
      );
      safeValues.designStyles = filtered;
      continue;
    }
    if (
      key === "type" &&
      (wizardProjectTypes as readonly string[]).includes(value as string)
    ) {
      safeValues.type = value as WizardProjectType;
      continue;
    }
    if (
      key === "budget" &&
      (wizardBudgets as readonly string[]).includes(value as string)
    ) {
      safeValues.budget = value as WizardBudget;
      continue;
    }
    if (
      key === "timeline" &&
      (wizardTimelines as readonly string[]).includes(value as string)
    ) {
      safeValues.timeline = value as WizardTimeline;
      continue;
    }
    if (key === "newsletter" && typeof value === "boolean") {
      safeValues.newsletter = value;
      continue;
    }
    if (typeof value === "string") {
      safeValues[key as keyof WizardValues] = value as never;
    }
  }
  return {
    version: 1,
    savedAt: draft.savedAt,
    values: { ...wizardDefaultValues, ...safeValues },
    step: draft.step,
  };
}
