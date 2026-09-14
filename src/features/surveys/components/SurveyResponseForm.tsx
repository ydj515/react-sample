import { useForm } from "react-hook-form";
import {
  answerSchema,
  choices,
  type Survey,
} from "@/features/surveys/model/surveys";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

export function SurveyResponseForm({
  survey,
  onSubmit,
}: {
  survey: Survey;
  onSubmit: (answers: Record<string, string>) => void;
}) {
  const form = useForm<Record<string, string>>({
    defaultValues: Object.fromEntries(
      survey.questions.map((question) => [question.id, ""]),
    ),
  });
  return (
    <form
      className="grid gap-6"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit((values) => {
          const parsed = answerSchema(survey.questions).safeParse(values);
          if (!parsed.success) {
            for (const issue of parsed.error.issues) {
              form.setError(String(issue.path[0]), { message: issue.message });
            }
            return;
          }
          onSubmit(parsed.data);
        })(event);
      }}
    >
      {survey.questions.map((question, index) => (
        <fieldset
          key={question.id}
          className="border-line grid gap-3 rounded-xl border p-5"
        >
          <legend className="px-2 font-medium">
            {index + 1}. {question.title}{" "}
            {question.required ? "(필수)" : "(선택)"}
          </legend>
          {question.type === "text" ? (
            <Textarea
              aria-label={question.title}
              maxLength={2000}
              {...form.register(question.id)}
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              {(question.type === "scale"
                ? ["1", "2", "3", "4", "5"]
                : choices(question.options)
              ).map((option) => (
                <label
                  key={option}
                  className="border-line flex items-center gap-3 rounded-lg border px-4 py-3"
                >
                  <input
                    type="radio"
                    value={option}
                    {...form.register(question.id)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {question.type === "scale" && (
            <p className="text-ink-subtle text-sm">
              1점: 매우 낮음 · 5점: 매우 높음
            </p>
          )}
          {form.formState.errors[question.id] && (
            <p role="alert" className="text-negative text-sm">
              유효한 응답을 입력하세요.
            </p>
          )}
        </fieldset>
      ))}
      <Button type="submit" className="justify-self-start">
        응답 제출
      </Button>
    </form>
  );
}
