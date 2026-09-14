import {
  summarizeQuestion,
  type Survey,
} from "@/features/surveys/model/surveys";

export function SurveyResults({ survey }: { survey: Survey }) {
  return (
    <section className="grid gap-6" aria-label="설문 결과">
      <h2 className="text-xl font-semibold">
        수집된 응답 {survey.responses.length}개
      </h2>
      {survey.responses.length === 0 && (
        <p className="text-ink-subtle">
          아직 응답이 없습니다. 응답을 제출하면 결과가 표시됩니다.
        </p>
      )}
      {survey.questions.map((question) => {
        const result = summarizeQuestion(
          question,
          survey.responses.map((response) => response.answers),
        );
        return (
          <article
            key={question.id}
            className="border-line grid gap-4 rounded-xl border p-5"
          >
            <h3 className="font-semibold">{question.title}</h3>
            <p className="text-ink-subtle text-sm">
              응답 {result.count}개
              {result.average !== null &&
                ` · 평균 ${result.average.toFixed(1)} / 5점`}
            </p>
            {question.type === "text" ? (
              <ul className="grid gap-3">
                {result.texts.map((value, index) => (
                  <li
                    key={index}
                    className="bg-surface-muted rounded-lg p-4 break-words whitespace-pre-wrap"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            ) : (
              result.distribution.map((item) => (
                <div key={item.label} className="grid gap-2">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="break-words">{item.label}</span>
                    <span className="shrink-0">
                      {item.count}명 (
                      {result.count
                        ? Math.round((item.count / result.count) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                  <progress
                    className="bg-surface-muted [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:bg-surface-muted [&::-webkit-progress-value]:bg-brand h-3 w-full appearance-none overflow-hidden rounded-full"
                    aria-label={item.label}
                    max={Math.max(result.count, 1)}
                    value={item.count}
                  />
                </div>
              ))
            )}
          </article>
        );
      })}
    </section>
  );
}
