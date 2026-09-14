import type { Survey } from "@/features/surveys/model/surveys";
import { surveyStatusLabels } from "@/features/surveys/model/survey-status";
import { Select } from "@/shared/ui/select";

export function SurveyList({
  surveys,
  selected,
  onSelect,
}: {
  surveys: Survey[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <label className="grid max-w-lg gap-2 text-sm">
      설문 목록
      <Select
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
      >
        {surveys.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title} · {surveyStatusLabels[item.status]}
          </option>
        ))}
      </Select>
    </label>
  );
}
