import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/cn";
import {
  parseWizardDraft,
  serializeWizardDraft,
  wizardBudgetLabels,
  wizardBudgets,
  wizardDefaultValues,
  wizardDesignStyleLabels,
  wizardDesignStyles,
  wizardProjectTypeLabels,
  wizardProjectTypes,
  wizardSchema,
  wizardSteps,
  wizardTimelineLabels,
  wizardTimelines,
  type WizardStepId,
  type WizardValues,
} from "@/features/landing/model/wizard";

export const WIZARD_DRAFT_STORAGE_KEY = "react-sample:wizard-draft";

export function WizardForm() {
  const id = useId();

  const formId = `wizard-${id}`;

  const [stepIndex, setStepIndex] = useState(0);

  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [restoredAt, setRestoredAt] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState<WizardValues | null>(null);

  const restoredRef = useRef(false);

  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: wizardDefaultValues,
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const currentStep = wizardSteps[stepIndex] ?? wizardSteps[0];

  const projectType = watch("type");

  const timeline = watch("timeline");

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      const draft = parseWizardDraft(JSON.parse(raw));
      if (!draft) return;
      reset(draft.values, { keepDefaultValues: false });
      const idx = wizardSteps.findIndex((s) => s.id === draft.step);
      setStepIndex(idx >= 0 ? idx : 0);
      setSavedAt(draft.savedAt);
      setRestoredAt(draft.savedAt);
    } catch {
      window.localStorage.removeItem(WIZARD_DRAFT_STORAGE_KEY);
    }
  }, [reset]);

  useEffect(() => {
    if (!restoredRef.current) return;
    if (typeof window === "undefined") return;
    const subscription = form.watch((values) => {
      try {
        const draft = serializeWizardDraft(
          { ...wizardDefaultValues, ...(values as WizardValues) },
          currentStep.id,
        );
        window.localStorage.setItem(
          WIZARD_DRAFT_STORAGE_KEY,
          JSON.stringify(draft),
        );
        setSavedAt(draft.savedAt);
      } catch {
        // localStorage is best-effort; never break the form on quota errors.
      }
    });
    return () => subscription.unsubscribe();
  }, [form, currentStep.id]);

  useEffect(() => {
    if (!restoredRef.current) return;
    if (typeof window === "undefined") return;
    try {
      const draft = serializeWizardDraft(getValues(), currentStep.id);
      window.localStorage.setItem(
        WIZARD_DRAFT_STORAGE_KEY,
        JSON.stringify(draft),
      );
      setSavedAt(draft.savedAt);
    } catch {
      // ignore storage errors
    }
    // getValues is stable in RHF; intentionally not listed as a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep.id]);

  const allowedStepIds = useMemo(
    () => new Set(wizardSteps.map((step) => step.id)),
    [],
  );

  function saveDraftNow(step: WizardStepId = currentStep.id) {
    if (typeof window === "undefined") return;
    try {
      const draft = serializeWizardDraft(getValues(), step);
      window.localStorage.setItem(
        WIZARD_DRAFT_STORAGE_KEY,
        JSON.stringify(draft),
      );
      setSavedAt(draft.savedAt);
    } catch {
      // ignore storage errors
    }
  }

  async function goToStep(target: number) {
    if (target === stepIndex) return;
    if (target > stepIndex) {
      const step = wizardSteps[stepIndex];
      if (!step) return;
      const ok = await trigger(
        step.fields as unknown as Parameters<typeof trigger>[0],
      );
      if (!ok) return;
    }
    setStepIndex(target);
  }

  function resetDraft() {
    reset(wizardDefaultValues, { keepDefaultValues: false });
    setStepIndex(0);
    setRestoredAt(null);
    setSavedAt(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(WIZARD_DRAFT_STORAGE_KEY);
    }
  }

  const onSubmit: SubmitHandler<WizardValues> = (values) => {
    setSubmitted(values);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(WIZARD_DRAFT_STORAGE_KEY);
    }
  };

  if (submitted) {
    return (
      <WizardSummary
        values={submitted}
        onRestart={() => {
          setSubmitted(null);
          reset(wizardDefaultValues, { keepDefaultValues: false });
          setStepIndex(0);
          setSavedAt(null);
          setRestoredAt(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-7">
      <WizardStepper
        stepIndex={stepIndex}
        onStepClick={(id) => {
          const idx = wizardSteps.findIndex((s) => s.id === id);
          if (idx >= 0) void goToStep(idx);
        }}
        visited={allowedStepIds}
      />

      <DraftBadge savedAt={savedAt} restoredAt={restoredAt} />

      <form
        id={formId}
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
        className="space-y-6"
      >
        {currentStep.id === "basics" && (
          <WizardStepBasics id={id} register={register} errors={errors} />
        )}

        {currentStep.id === "project" && (
          <WizardStepProject
            id={id}
            register={register}
            errors={errors}
            projectType={projectType}
            setValue={setValue}
            watch={watch}
          />
        )}

        {currentStep.id === "details" && (
          <WizardStepDetails
            id={id}
            register={register}
            errors={errors}
            timeline={timeline}
          />
        )}

        {currentStep.id === "review" && (
          <WizardStepReview
            id={id}
            values={getValues()}
            onJump={(target) => {
              const idx = wizardSteps.findIndex((s) => s.id === target);
              if (idx >= 0) void goToStep(idx);
            }}
          />
        )}

        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={stepIndex === 0}
              onClick={() => void goToStep(stepIndex - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden />
              이전 단계
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => saveDraftNow()}
            >
              <Save className="size-4" aria-hidden />
              초안 저장
            </Button>
          </div>
          {stepIndex < wizardSteps.length - 1 ? (
            <Button type="button" onClick={() => void goToStep(stepIndex + 1)}>
              다음 단계
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              신청 내용 제출
              <Check className="size-4" aria-hidden />
            </Button>
          )}
        </div>

        <button
          type="button"
          onClick={resetDraft}
          className="text-ink-subtle hover:text-ink-muted inline-flex items-center gap-1 text-xs"
        >
          <RotateCcw className="size-3" aria-hidden />
          처음부터 다시 작성
        </button>
      </form>
    </div>
  );
}

function WizardStepper({
  stepIndex,
  onStepClick,
  visited,
}: {
  stepIndex: number;
  onStepClick: (id: WizardStepId) => void;
  visited: Set<WizardStepId>;
}) {
  return (
    <ol
      aria-label="신청 단계"
      className="border-line rounded-control flex w-full overflow-hidden border text-xs"
    >
      {wizardSteps.map((step, idx) => {
        const active = idx === stepIndex;

        const completed = idx < stepIndex;
        return (
          <li
            key={step.id}
            className={cn(
              "flex-1 border-r last:border-r-0",
              active ? "bg-brand-soft text-brand" : "bg-surface",
            )}
          >
            <button
              type="button"
              aria-current={active ? "step" : undefined}
              onClick={() => onStepClick(step.id)}
              disabled={!visited.has(step.id) || active}
              className={cn(
                "focus-visible:outline-brand flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition",
                active
                  ? "cursor-default"
                  : "hover:bg-surface-muted cursor-pointer",
              )}
            >
              <span className="font-mono text-[10px] tracking-widest uppercase">
                0{idx + 1}
              </span>
              <span className="font-semibold">{step.title}</span>
              <span
                className={cn(
                  "text-[11px] leading-5",
                  active ? "text-brand/80" : "text-ink-subtle",
                )}
              >
                {completed ? "완료" : step.description}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function DraftBadge({
  savedAt,
  restoredAt,
}: {
  savedAt: string | null;
  restoredAt: string | null;
}) {
  if (!savedAt && !restoredAt) return null;
  const format = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };
  if (restoredAt && restoredAt === savedAt) {
    return (
      <p className="bg-positive-soft text-positive rounded-control inline-flex items-center gap-2 px-3 py-1 text-xs">
        <RotateCcw className="size-3" aria-hidden /> 이전에 저장한 초안을{" "}
        {format(restoredAt)}에 복원했어요.
      </p>
    );
  }
  return (
    <p className="bg-brand-soft text-brand rounded-control inline-flex items-center gap-2 px-3 py-1 text-xs">
      <Save className="size-3" aria-hidden /> 초안 자동 저장 · 마지막 저장{" "}
      {format(savedAt ?? "")}
    </p>
  );
}

type StepBasicsProps = {
  id: string;
  register: ReturnType<typeof useForm<WizardValues>>["register"];
  errors: ReturnType<typeof useForm<WizardValues>>["formState"]["errors"];
};

function WizardStepBasics({ id, register, errors }: StepBasicsProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-semibold">기본 정보를 알려 주세요</legend>
      <FieldRow
        id={`${id}-name`}
        label="이름"
        required
        error={errors.name?.message}
      >
        <Input
          id={`${id}-name`}
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </FieldRow>
      <FieldRow
        id={`${id}-email`}
        label="이메일"
        required
        error={errors.email?.message}
      >
        <Input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </FieldRow>
      <FieldRow
        id={`${id}-organization`}
        label="소속 (선택)"
        error={errors.organization?.message}
      >
        <Input
          id={`${id}-organization`}
          autoComplete="organization"
          {...register("organization")}
        />
      </FieldRow>
    </fieldset>
  );
}

type StepProjectProps = StepBasicsProps & {
  projectType: WizardValues["type"];
  setValue: ReturnType<typeof useForm<WizardValues>>["setValue"];
  watch: ReturnType<typeof useForm<WizardValues>>["watch"];
};

function WizardStepProject({
  id,
  register,
  errors,
  projectType,
  setValue,
  watch,
}: StepProjectProps) {
  const selectedStyles = watch("designStyles") ?? [];

  function toggleStyle(style: WizardValues["designStyles"][number]) {
    const next = selectedStyles.includes(style)
      ? selectedStyles.filter((s) => s !== style)
      : [...selectedStyles, style];
    setValue("designStyles", next, { shouldValidate: true });
  }
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-semibold">어떤 프로젝트인가요?</legend>
      <FieldRow
        id={`${id}-type`}
        label="프로젝트 종류"
        required
        error={errors.type?.message}
      >
        <Select
          id={`${id}-type`}
          aria-invalid={!!errors.type}
          {...register("type")}
        >
          {wizardProjectTypes.map((type) => (
            <option key={type} value={type}>
              {wizardProjectTypeLabels[type]}
            </option>
          ))}
        </Select>
      </FieldRow>
      {projectType === "design" && (
        <div>
          <Label className="mb-2 block">선호하는 디자인 스타일</Label>
          <p className="text-ink-subtle mb-3 text-xs leading-6">
            마음에 드는 분위기를 모두 골라 주세요.
          </p>
          <div className="flex flex-wrap gap-2">
            {wizardDesignStyles.map((style) => {
              const active = selectedStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleStyle(style)}
                  className={cn(
                    "rounded-control border px-3 py-1.5 text-xs transition",
                    active
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-line-strong hover:bg-surface-muted",
                  )}
                >
                  {wizardDesignStyleLabels[style]}
                </button>
              );
            })}
          </div>
          {errors.designStyles?.message && (
            <p role="alert" className="text-negative mt-2 text-xs">
              {errors.designStyles.message}
            </p>
          )}
        </div>
      )}
      {projectType === "development" && (
        <FieldRow
          id={`${id}-techStack`}
          label="사용할 기술 스택"
          required
          hint="쉼표로 구분해 적어 주세요. 예: React, Node.js, PostgreSQL"
          error={errors.techStack?.message}
        >
          <Input
            id={`${id}-techStack`}
            aria-invalid={!!errors.techStack}
            {...register("techStack")}
          />
        </FieldRow>
      )}
      {projectType === "consulting" && (
        <FieldRow
          id={`${id}-consultingTopic`}
          label="상담 주제"
          required
          hint="핵심 질문이나 함께 고민하고 싶은 내용을 적어 주세요."
          error={errors.consultingTopic?.message}
        >
          <Textarea
            id={`${id}-consultingTopic`}
            rows={3}
            aria-invalid={!!errors.consultingTopic}
            {...register("consultingTopic")}
          />
        </FieldRow>
      )}
    </fieldset>
  );
}

type StepDetailsProps = StepBasicsProps & {
  timeline: WizardValues["timeline"];
};

function WizardStepDetails({
  id,
  register,
  errors,
  timeline,
}: StepDetailsProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-semibold">
        예산과 일정을 알려 주세요
      </legend>
      <FieldRow
        id={`${id}-budget`}
        label="예산 범위"
        required
        error={errors.budget?.message}
      >
        <Select
          id={`${id}-budget`}
          aria-invalid={!!errors.budget}
          {...register("budget")}
        >
          {wizardBudgets.map((budget) => (
            <option key={budget} value={budget}>
              {wizardBudgetLabels[budget]}
            </option>
          ))}
        </Select>
      </FieldRow>
      <FieldRow
        id={`${id}-timeline`}
        label="희망 일정"
        required
        error={errors.timeline?.message}
      >
        <Select
          id={`${id}-timeline`}
          aria-invalid={!!errors.timeline}
          {...register("timeline")}
        >
          {wizardTimelines.map((value) => (
            <option key={value} value={value}>
              {wizardTimelineLabels[value]}
            </option>
          ))}
        </Select>
      </FieldRow>
      {timeline === "flexible" && (
        <FieldRow
          id={`${id}-timelineNote`}
          label="유연한 일정의 의미"
          required
          hint="언제쯤 시작하면 좋을지, 어떤 일정 변화가 가능한지 알려 주세요."
          error={errors.timelineNote?.message}
        >
          <Textarea
            id={`${id}-timelineNote`}
            rows={3}
            aria-invalid={!!errors.timelineNote}
            {...register("timelineNote")}
          />
        </FieldRow>
      )}
      <FieldRow
        id={`${id}-message`}
        label="프로젝트 설명"
        required
        hint="배경과 목표, 진행하면 좋은 방향을 자유롭게 적어 주세요. (10자 이상)"
        error={errors.message?.message}
      >
        <Textarea
          id={`${id}-message`}
          rows={5}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </FieldRow>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-[var(--color-brand,#0a6cff)]"
          {...register("newsletter")}
        />
        <span>
          <span className="font-medium">소식지 구독</span>
          <span className="text-ink-subtle block text-xs">
            작업 노트와 케이스 스터디를 가끔 받아 봅니다.
          </span>
        </span>
      </label>
    </fieldset>
  );
}

function WizardStepReview({
  id,
  values,
  onJump,
}: {
  id: string;
  values: WizardValues;
  onJump: (step: WizardStepId) => void;
}) {
  return (
    <section
      aria-labelledby={`${id}-review-title`}
      className="border-line rounded-panel space-y-5 border p-5"
    >
      <h3 id={`${id}-review-title`} className="text-lg font-semibold">
        입력 내용 검토
      </h3>
      <ReviewRow
        title="기본 정보"
        onEdit={() => onJump("basics")}
        items={[
          { label: "이름", value: values.name },
          { label: "이메일", value: values.email },
          { label: "소속", value: values.organization || "미입력" },
        ]}
      />
      <ReviewRow
        title="프로젝트 종류"
        onEdit={() => onJump("project")}
        items={
          [
            { label: "종류", value: wizardProjectTypeLabels[values.type] },
            values.type === "design"
              ? {
                  label: "선호 스타일",
                  value:
                    values.designStyles
                      .map((style) => wizardDesignStyleLabels[style])
                      .join(", ") || "미선택",
                }
              : null,
            values.type === "development"
              ? {
                  label: "기술 스택",
                  value: values.techStack || "미입력",
                }
              : null,
            values.type === "consulting"
              ? {
                  label: "상담 주제",
                  value: values.consultingTopic || "미입력",
                }
              : null,
          ].filter(Boolean) as { label: string; value: string }[]
        }
      />
      <ReviewRow
        title="예산과 일정"
        onEdit={() => onJump("details")}
        items={
          [
            { label: "예산", value: wizardBudgetLabels[values.budget] },
            { label: "일정", value: wizardTimelineLabels[values.timeline] },
            values.timeline === "flexible"
              ? {
                  label: "일정 메모",
                  value: values.timelineNote || "미입력",
                }
              : null,
            { label: "메시지", value: values.message },
            {
              label: "소식지",
              value: values.newsletter ? "구독함" : "구독하지 않음",
            },
          ].filter(Boolean) as { label: string; value: string }[]
        }
      />
    </section>
  );
}

function ReviewRow({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: { label: string; value: string }[];
  onEdit: () => void;
}) {
  return (
    <div className="border-line rounded-control border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-brand text-xs font-medium hover:underline"
        >
          수정
        </button>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-ink-subtle text-xs">{item.label}</dt>
            <dd className="mt-1 leading-6">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function WizardSummary({
  values,
  onRestart,
}: {
  values: WizardValues;
  onRestart: () => void;
}) {
  return (
    <div
      role="status"
      className="bg-positive-soft text-positive rounded-panel space-y-4 p-6"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Check className="size-4" aria-hidden />
        신청 내용을 받았습니다.
      </div>
      <p className="text-ink-muted text-sm leading-6">
        {values.name}님, 입력해 주신 내용은 외부로 전송하지 않았습니다. 실제
        의뢰 접수가 아니며, 저장된 초안도 함께 비웠습니다.
      </p>
      <Button variant="secondary" onClick={onRestart}>
        새 신청 작성
      </Button>
    </div>
  );
}

function FieldRow({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1">
        <Label htmlFor={id}>{label}</Label>
        {required ? (
          <span aria-hidden className="text-negative text-sm">
            *
          </span>
        ) : null}
      </div>
      {children}
      {hint && !error ? (
        <p className="text-ink-subtle mt-2 text-xs leading-6">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-negative mt-2 text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
