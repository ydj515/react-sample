import type { Survey } from "@/features/surveys/model/surveys";
import { surveyStatusLabels } from "@/features/surveys/model/survey-status";
import { Button } from "@/shared/ui/button";

type SurveyHeaderProps = {
  survey: Survey;
  disabled: boolean;
  onEdit: () => void;
  onPublish: () => void;
  onRespond: () => void;
  onClose: () => void;
  onResults: () => void;
};

export function SurveyHeader({
  survey,
  disabled,
  onEdit,
  onPublish,
  onRespond,
  onClose,
  onResults,
}: SurveyHeaderProps) {
  return (
    <header className="grid gap-3">
      <p className="text-brand text-sm font-medium">
        {surveyStatusLabels[survey.status]} · 질문 {survey.questions.length}개
      </p>
      <h2 className="text-2xl font-semibold break-words">{survey.title}</h2>
      <p className="text-ink-subtle break-words whitespace-pre-wrap">
        {survey.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {survey.status === "draft" && (
          <>
            <Button variant="secondary" disabled={disabled} onClick={onEdit}>
              질문 편집
            </Button>
            <Button disabled={disabled} onClick={onPublish}>
              설문 발행
            </Button>
          </>
        )}
        {survey.status === "open" && (
          <>
            <Button
              disabled={disabled || survey.responses.length >= 1000}
              onClick={onRespond}
            >
              응답 작성
            </Button>
            <Button variant="secondary" disabled={disabled} onClick={onClose}>
              수집 마감
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onResults}>
          결과 보기
        </Button>
      </div>
    </header>
  );
}
