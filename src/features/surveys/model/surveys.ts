import { z } from "zod";

export function choices(options: string) {
  return options
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean);
}

export const questionSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().trim().min(1, "질문을 입력하세요.").max(200),
    type: z.enum(["choice", "scale", "text"]),
    required: z.boolean(),
    options: z.string().max(2000),
  })
  .refine(
    (question) => {
      if (question.type !== "choice") return true;
      const values = choices(question.options);
      return (
        values.length >= 2 &&
        values.length <= 10 &&
        new Set(values).size === values.length &&
        values.every((value) => value.length <= 100)
      );
    },
    {
      path: ["options"],
      message:
        "서로 다른 선택지 2~10개를 한 줄씩 입력하세요. 각 선택지는 100자 이하여야 합니다.",
    },
  );

export const surveyInputSchema = z
  .object({
    title: z.string().trim().min(1, "설문 제목을 입력하세요.").max(100),
    description: z.string().max(1000),
    questions: z.array(questionSchema).min(1).max(30),
  })
  .refine(
    (survey) =>
      new Set(survey.questions.map((question) => question.id)).size ===
      survey.questions.length,
    { path: ["questions"], message: "질문 ID는 중복될 수 없습니다." },
  );

export type Question = z.infer<typeof questionSchema>;

export type SurveyInput = z.infer<typeof surveyInputSchema>;

export function answerSchema(questions: Question[]) {
  return z.object(
    Object.fromEntries(
      questions.map((question) => [
        question.id,
        z
          .string()
          .trim()
          .max(2000)
          .default("")
          .refine((value) => {
            if (!value) return !question.required;
            if (question.type === "choice") {
              return choices(question.options).includes(value);
            }
            if (question.type === "scale") return /^[1-5]$/.test(value);
            return true;
          }, "유효한 응답을 입력하세요."),
      ]),
    ),
  );
}

export const surveySchema = surveyInputSchema
  .extend({
    id: z.string().min(1),
    status: z.enum(["draft", "open", "closed"]),
    responses: z
      .array(
        z.object({
          id: z.string(),
          submittedAt: z.iso.datetime(),
          answers: z.record(z.string(), z.string()),
        }),
      )
      .max(1000),
  })
  .refine(
    (survey) =>
      survey.responses.every(
        (response) =>
          answerSchema(survey.questions).safeParse(response.answers).success,
      ),
    { message: "저장된 응답이 설문 형식과 일치하지 않습니다." },
  );

export type Survey = z.infer<typeof surveySchema>;

export const surveysSchema = z.array(surveySchema).max(100);

export function summarizeQuestion(
  question: Question,
  answers: Record<string, string>[],
) {
  const values = answers
    .map((answer) => answer[question.id] ?? "")
    .filter(Boolean);

  const options =
    question.type === "scale"
      ? ["1", "2", "3", "4", "5"]
      : choices(question.options);
  return {
    count: values.length,
    average:
      question.type === "scale" && values.length
        ? values.reduce((sum, value) => sum + Number(value), 0) / values.length
        : null,
    distribution: options.map((label) => ({
      label,
      count: values.filter((value) => value === label).length,
    })),
    texts: question.type === "text" ? values : [],
  };
}

export function newQuestion(): Question {
  return {
    id: crypto.randomUUID(),
    title: "",
    type: "choice",
    required: true,
    options: "선택지 1\n선택지 2",
  };
}

export function initialSurveys(): Survey[] {
  return [
    {
      id: "survey-welcome",
      title: "워크스페이스 만족도",
      description: "사용 경험을 알려주세요. 응답은 이 브라우저에 저장됩니다.",
      status: "open",
      questions: [
        {
          id: "q-feature",
          title: "가장 자주 사용하는 기능은 무엇인가요?",
          type: "choice",
          required: true,
          options: "프로젝트\n노트\n빌링",
        },
        {
          id: "q-rating",
          title: "전체 사용 경험은 몇 점인가요?",
          type: "scale",
          required: true,
          options: "",
        },
        {
          id: "q-feedback",
          title: "개선할 점을 알려주세요.",
          type: "text",
          required: false,
          options: "",
        },
      ],
      responses: [],
    },
  ];
}
