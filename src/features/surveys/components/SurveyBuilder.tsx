import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newQuestion,
  surveyInputSchema,
  type SurveyInput,
} from "@/features/surveys/model/surveys";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

export function SurveyBuilder({
  value,
  onSave,
  onCancel,
}: {
  value?: SurveyInput;
  onSave: (value: SurveyInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<SurveyInput>({
    resolver: zodResolver(surveyInputSchema),
    defaultValues: value ?? {
      title: "",
      description: "",
      questions: [newQuestion()],
    },
  });

  const rows = useFieldArray({
    control: form.control,
    name: "questions",
    keyName: "fieldKey",
  });

  const questions = useWatch({ control: form.control, name: "questions" });
  return (
    <form
      className="grid gap-6"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit(onSave)(event);
      }}
    >
      <h2 className="text-xl font-semibold">질문 구성</h2>
      <label className="grid gap-2">
        설문 제목
        <Input {...form.register("title")} />
      </label>
      <label className="grid gap-2">
        설문 설명
        <Textarea {...form.register("description")} />
      </label>
      {rows.fields.map((field, index) => (
        <fieldset
          key={field.fieldKey}
          className="border-line grid gap-4 rounded-xl border p-5"
        >
          <legend className="px-2 font-semibold">질문 {index + 1}</legend>
          <label className="grid gap-2">
            질문 {index + 1} 제목
            <Input {...form.register(`questions.${index}.title`)} />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <label className="grid gap-2">
              질문 {index + 1} 유형
              <Select {...form.register(`questions.${index}.type`)}>
                <option value="choice">객관식</option>
                <option value="scale">척도 (1~5)</option>
                <option value="text">텍스트</option>
              </Select>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register(`questions.${index}.required`)}
              />
              필수 응답
            </label>
          </div>
          {questions[index]?.type === "choice" && (
            <label className="grid gap-2">
              선택지 (한 줄에 하나)
              <Textarea {...form.register(`questions.${index}.options`)} />
              <span className="text-ink-subtle text-sm">
                중복 없이 2~10개, 각 100자 이하
              </span>
            </label>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={index === 0}
              onClick={() => rows.move(index, index - 1)}
              aria-label={`질문 ${index + 1} 위로`}
            >
              위로
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={index === rows.fields.length - 1}
              onClick={() => rows.move(index, index + 1)}
              aria-label={`질문 ${index + 1} 아래로`}
            >
              아래로
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={rows.fields.length === 1}
              onClick={() => rows.remove(index)}
              aria-label={`질문 ${index + 1} 제거`}
            >
              제거
            </Button>
          </div>
        </fieldset>
      ))}
      <Button
        type="button"
        variant="secondary"
        disabled={rows.fields.length >= 30}
        onClick={() => rows.append(newQuestion())}
      >
        질문 추가
      </Button>
      {Object.keys(form.formState.errors).length > 0 && (
        <p role="alert" className="text-negative">
          제목과 모든 질문을 입력하고 객관식 선택지를 확인하세요. 제목은 100자,
          질문은 200자, 설명은 1,000자까지 입력할 수 있습니다.
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit">초안 저장</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
