import { describe, expect, it } from "vitest";
import { answerSchema, questionSchema, summarizeQuestion } from "./surveys";

describe("survey contracts", () => {
  it("requires distinct choices and rejects missing questions", () => {
    expect(
      questionSchema.safeParse({
        id: "q",
        title: "선택",
        type: "choice",
        required: true,
        options: "중복\n중복",
      }).success,
    ).toBe(false);
  });
  it("validates required answers, choices and scale bounds", () => {
    const questions = [
      {
        id: "a",
        title: "선택",
        type: "choice" as const,
        required: true,
        options: "A\nB",
      },
      {
        id: "b",
        title: "점수",
        type: "scale" as const,
        required: true,
        options: "",
      },
    ];
    expect(answerSchema(questions).safeParse({ a: "A", b: "5" }).success).toBe(
      true,
    );
    expect(answerSchema(questions).safeParse({ a: "C", b: "6" }).success).toBe(
      false,
    );
    expect(answerSchema(questions).safeParse({}).success).toBe(false);
  });
  it("counts submitted answers and excludes skipped answers from the scale average", () => {
    const question = {
      id: "q",
      title: "점수",
      type: "scale" as const,
      required: false,
      options: "",
    };
    expect(
      summarizeQuestion(question, [{ q: "3" }, { q: "5" }, { q: "" }]),
    ).toMatchObject({ count: 2, average: 4 });
    expect(summarizeQuestion(question, []).average).toBeNull();
  });
});
