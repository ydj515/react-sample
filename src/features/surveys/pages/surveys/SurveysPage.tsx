import { useState } from "react";
import { SurveyBuilder } from "@/features/surveys/components/SurveyBuilder";
import { SurveyResponseForm } from "@/features/surveys/components/SurveyResponseForm";
import { SurveyResults } from "@/features/surveys/components/SurveyResults";
import {
  initialSurveys,
  surveysSchema,
  type SurveyInput,
} from "@/features/surveys/model/surveys";
import { useLocalRecords } from "@/shared/lib/use-local-records";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { SurveyList } from "@/features/surveys/components/SurveyList";
import { SurveyHeader } from "@/features/surveys/components/SurveyHeader";

export function SurveysPage() {
  const store = useLocalRecords(
    "react-sample-surveys-v1",
    surveysSchema,
    initialSurveys,
  );

  const [selected, setSelected] = useState(store.data[0]?.id ?? "");

  const [mode, setMode] = useState<
    "view" | "new" | "edit" | "respond" | "results"
  >("view");

  const [message, setMessage] = useState("");

  const survey = store.data.find((item) => item.id === selected);

  function saveDraft(input: SurveyInput) {
    const next = {
      ...input,
      id: mode === "edit" && survey ? survey.id : crypto.randomUUID(),
      status: "draft" as const,
      responses: [],
    };
    if (
      store.save(
        mode === "edit"
          ? store.data.map((item) => (item.id === next.id ? next : item))
          : [...store.data, next],
      )
    ) {
      setSelected(next.id);
      setMode("view");
      setMessage("초안을 저장했습니다.");
    }
  }

  function publishSurvey() {
    if (
      store.save(
        store.data.map((item) =>
          item.id === selected ? { ...item, status: "open" } : item,
        ),
      )
    ) {
      setMessage(
        "응답 수집을 시작했습니다. 질문은 발행 후 변경할 수 없습니다.",
      );
    }
  }

  function closeSurvey() {
    if (
      store.save(
        store.data.map((item) =>
          item.id === selected ? { ...item, status: "closed" } : item,
        ),
      )
    ) {
      setMode("results");
      setMessage("응답 수집을 마감했습니다.");
    }
  }

  function submitResponse(answers: Record<string, string>) {
    if (
      store.save(
        store.data.map((item) =>
          item.id === selected
            ? {
                ...item,
                responses: [
                  ...item.responses,
                  {
                    id: crypto.randomUUID(),
                    submittedAt: new Date().toISOString(),
                    answers,
                  },
                ],
              }
            : item,
        ),
      )
    ) {
      setMode("results");
      setMessage("응답을 저장했습니다.");
    }
  }
  return (
    <div className="grid gap-6">
      <PageHeader
        title="설문 / 폼 빌더"
        description="질문을 구성하고 응답 결과를 확인하세요. 이 브라우저에만 저장되는 로컬 데모입니다."
        actions={
          <Button
            disabled={store.blocked || store.data.length >= 100}
            onClick={() => {
              setMode("new");
              setMessage("");
            }}
          >
            새 설문
          </Button>
        }
      />
      {store.error && (
        <p role="alert" className="text-negative">
          {store.error}
        </p>
      )}
      {message && (
        <p role="status" className="text-positive">
          {message}
        </p>
      )}
      <SurveyList
        surveys={store.data}
        selected={selected}
        onSelect={(id) => {
          setSelected(id);
          setMode("view");
          setMessage("");
        }}
      />
      <div className="border-line bg-surface min-w-0 rounded-2xl border p-5 sm:p-8">
        {mode === "new" || mode === "edit" ? (
          <SurveyBuilder
            key={mode + selected}
            value={mode === "edit" ? survey : undefined}
            onSave={saveDraft}
            onCancel={() => setMode("view")}
          />
        ) : survey ? (
          <div className="grid gap-8">
            <SurveyHeader
              survey={survey}
              disabled={store.blocked}
              onEdit={() => setMode("edit")}
              onPublish={publishSurvey}
              onRespond={() => {
                setMode("respond");
                setMessage("");
              }}
              onClose={closeSurvey}
              onResults={() => setMode("results")}
            />
            {mode === "respond" && survey.status === "open" ? (
              <SurveyResponseForm
                key={survey.id}
                survey={survey}
                onSubmit={submitResponse}
              />
            ) : (
              <SurveyResults survey={survey} />
            )}
          </div>
        ) : (
          <p>새 설문을 만들어 시작하세요.</p>
        )}
      </div>
    </div>
  );
}
