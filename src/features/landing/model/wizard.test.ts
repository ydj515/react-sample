import { describe, expect, it } from "vitest";
import {
  parseWizardDraft,
  serializeWizardDraft,
  wizardBasicsSchema,
  wizardDetailsSchema,
  wizardProjectSchema,
  wizardSchema,
  wizardSteps,
  type WizardValues,
} from "./wizard";

const baseValues: WizardValues = {
  name: "샘플",
  email: "sample@example.com",
  organization: "React Sample",
  type: "design",
  designStyles: ["minimal"],
  techStack: "",
  consultingTopic: "",
  budget: "300-800",
  timeline: "1-3-months",
  timelineNote: "",
  message: "열 줄 이상으로 프로젝트 의뢰 메시지를 작성합니다.",
  newsletter: false,
};

describe("wizardBasicsSchema", () => {
  it("이름과 이메일이 비어 있으면 실패한다", () => {
    const result = wizardBasicsSchema.safeParse({
      name: "",
      email: "",
      organization: "",
    });
    expect(result.success).toBe(false);
  });

  it("이메일 형식이 잘못되면 실패한다", () => {
    const result = wizardBasicsSchema.safeParse({
      name: "샘플",
      email: "not-an-email",
      organization: "",
    });
    expect(result.success).toBe(false);
  });

  it("정상 입력은 통과한다", () => {
    const result = wizardBasicsSchema.safeParse({
      name: "샘플",
      email: "sample@example.com",
      organization: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("wizardProjectSchema", () => {
  it("디자인을 선택했지만 스타일이 없으면 실패한다", () => {
    const result = wizardProjectSchema.safeParse({
      type: "design",
      designStyles: [],
      techStack: "",
      consultingTopic: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "designStyles"),
      ).toBe(true);
    }
  });

  it("개발을 선택했지만 기술 스택이 비어 있으면 실패한다", () => {
    const result = wizardProjectSchema.safeParse({
      type: "development",
      designStyles: [],
      techStack: "   ",
      consultingTopic: "",
    });
    expect(result.success).toBe(false);
  });

  it("컨설팅은 주제가 있어야 한다", () => {
    const result = wizardProjectSchema.safeParse({
      type: "consulting",
      designStyles: [],
      techStack: "",
      consultingTopic: "",
    });
    expect(result.success).toBe(false);
  });

  it("디자인과 스타일만 입력하면 통과한다", () => {
    const result = wizardProjectSchema.safeParse({
      type: "design",
      designStyles: ["editorial", "minimal"],
      techStack: "",
      consultingTopic: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("wizardDetailsSchema", () => {
  it("메시지가 10자 미만이면 실패한다", () => {
    const result = wizardDetailsSchema.safeParse({
      budget: "300-800",
      timeline: "1-3-months",
      timelineNote: "",
      message: "짧음",
      newsletter: false,
    });
    expect(result.success).toBe(false);
  });

  it("유연한 일정일 때 메모가 없으면 실패한다", () => {
    const result = wizardDetailsSchema.safeParse({
      budget: "300-800",
      timeline: "flexible",
      timelineNote: "   ",
      message: "열 줄 이상의 메시지를 작성해서 전달할 의뢰 내용입니다.",
      newsletter: false,
    });
    expect(result.success).toBe(false);
  });

  it("유연한 일정과 메모가 모두 있으면 통과한다", () => {
    const result = wizardDetailsSchema.safeParse({
      budget: "300-800",
      timeline: "flexible",
      timelineNote: "다음 분기쯤 시작하고 싶습니다",
      message: "열 줄 이상의 메시지를 작성해서 전달할 의뢰 내용입니다.",
      newsletter: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("wizardSchema", () => {
  it("전체 값이 유효하면 통과한다", () => {
    expect(wizardSchema.safeParse(baseValues).success).toBe(true);
  });
});

describe("wizardSteps", () => {
  it("4단계로 구성되어 있다", () => {
    expect(wizardSteps.map((s) => s.id)).toEqual([
      "basics",
      "project",
      "details",
      "review",
    ]);
  });
});

describe("초안 직렬화/복원", () => {
  it("저장된 초안은 다시 파싱하면 같은 값을 가진다", () => {
    const draft = serializeWizardDraft(baseValues, "project");
    expect(draft.version).toBe(1);
    expect(draft.step).toBe("project");
    const parsed = parseWizardDraft(draft);
    expect(parsed).not.toBeNull();
    expect(parsed?.values.name).toBe(baseValues.name);
    expect(parsed?.values.type).toBe(baseValues.type);
  });

  it("잘못된 초안은 거부한다", () => {
    expect(parseWizardDraft(null)).toBeNull();
    expect(parseWizardDraft({})).toBeNull();
    expect(parseWizardDraft({ version: 1 })).toBeNull();
    expect(
      parseWizardDraft({
        version: 1,
        savedAt: "x",
        step: "basics",
        values: {},
      }),
    ).not.toBeNull();
  });

  it("잘못된 step 값은 거부한다", () => {
    expect(
      parseWizardDraft({
        version: 1,
        savedAt: "x",
        step: "unknown",
        values: baseValues,
      }),
    ).toBeNull();
  });
});
