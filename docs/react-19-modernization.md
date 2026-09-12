# React 19 적용 전후 가이드

React **19.2.8**을 사용하는 이 저장소에서 실제로 바꾼 코드와 적용 이유를 설명합니다.
As-Is 기준은 변경 전 `5a7bf95`이며, To-Be는 링크된 현재 소스입니다.
문맥이 필요한 코드는 핵심 부분만 발췌하고 `// 생략`으로 표시합니다.
신규 학습 예제의 비교 코드는 **비교용**으로 표시하며 기존 저장소 코드라고 주장하지 않습니다.

TanStack Query는 서버 데이터 캐시·갱신, Router는 URL·진입 데이터,
RHF는 복잡한 폼과 필드 검증, Zustand는 클라이언트 상태를 계속 담당합니다.
React 19 API는 임시 표시 상태, Action 제출 수명, DOM·메타데이터를 맡습니다.

## 비교 문서의 읽기 기준

As-Is는 변경 전 코드의 역할을 설명하며, To-Be가 모든 사용처에서 우월하다는 뜻은 아닙니다.
각 항목의 **기존 방식의 역할과 우리 프로젝트의 유지 사례**에서 다음을 함께 확인합니다.

1. 기존 방식이 어떤 상태·수명을 관리하는지.
2. 현재 프로젝트에서 그 방식이 더 적절한 실제 파일과 이유.
3. React 19 방식으로 전환할 조건.

동일한 기존 방식을 유지한 실제 사용처가 없는 항목은 없다고 명시합니다.
비슷해 보이지만 다른 책임을 담당하는 코드와 신규 비교용 예제를 구분합니다.

## 적용 지도

| 대상                              | 변경                                    | 확인 위치                             |
| --------------------------------- | --------------------------------------- | ------------------------------------- |
| 공통 Input·Select·Textarea·Button | ref prop 타입 명시                      | 포커스·StrictMode ref 정리 테스트     |
| 관리자·Docs·Landing·Shop·로그인   | 네이티브 title/meta                     | 브라우저 탭과 document.head           |
| 프로젝트 상세                     | useOptimistic + 비동기 Transition       | 상태 선택·실패 복구                   |
| 로그인                            | RHF + useActionState + form action      | 검증·중복 제출 방지·실패 후 입력 보존 |
| 공통 SubmitButton                 | useFormStatus                           | Shared/UI/SubmitButton 스토리         |
| 전역 검색                         | useEffectEvent                          | Ctrl/Cmd+K 반복 토글                  |
| 사용자 상세                       | Activity                                | 기본 정보·권한 탭의 미저장 입력       |
| React 19 학습 화면                | use(Promise), use(Context), ref cleanup | 로그인 후 `/react-19`, 샘플 메뉴      |
| 앱 부트스트랩                     | 루트 오류 보고 콜백                     | caught/uncaught/recoverable 분류      |
| 쇼핑 상세 대표 이미지             | eager/high 우선순위                     | 목록 이미지는 lazy 유지               |

## 1. ref를 일반 prop으로 지원

`forwardRef`를 제거하는 작업은 없습니다. 기존 소스에는 forwardRef가 없었고,
`InputHTMLAttributes`가 ref를 props 계약에 명시하지 않았습니다.
`ComponentPropsWithRef`로 DOM ref 지원을 타입에도 반영합니다.
[Input](../src/shared/ui/input.tsx), [Button](../src/shared/ui/button.tsx),
[Select](../src/shared/ui/select.tsx), [Textarea](../src/shared/ui/textarea.tsx)에 적용합니다.
Radix Slot을 사용하는 Button의 `asChild` 동작은 유지합니다.

### As-Is

```tsx
import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "compact:h-9 compact:px-2.5 compact:text-sm rounded-control border-line-strong bg-surface text-ink placeholder:text-ink-subtle focus:border-brand focus:ring-brand-soft disabled:bg-surface-muted h-10 w-full border px-3 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
```

### To-Be

```tsx
import type { ComponentPropsWithRef } from "react";

import { cn } from "@/shared/lib/cn";

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <input
      className={cn(
        "compact:h-9 compact:px-2.5 compact:text-sm rounded-control border-line-strong bg-surface text-ink placeholder:text-ink-subtle focus:border-brand focus:ring-brand-soft disabled:bg-surface-muted h-10 w-full border px-3 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 방식은 `InputHTMLAttributes` 같은 DOM 속성 타입을 받아 하위 요소에 전달하는 함수 컴포넌트입니다.
React 18의 forwardRef를 사용하던 구현과는 구분합니다. 이번 변경은 ref가 필요한 컴포넌트의 공개 타입 계약을 보완한 것입니다.

- **기존 방식이 더 적절한 곳:** [Label](../src/shared/ui/label.tsx)은 `LabelHTMLAttributes`로 htmlFor·접근성 속성·스타일을 전달합니다. 현재 사용처에서 Label DOM을 직접 제어할 필요가 없으므로 ref 지원을 넓히지 않았습니다.
- **React 19 방식이 적절한 곳:** Input·Select·Textarea·Button처럼 부모의 포커스 제어 또는 폼 라이브러리의 ref 연결이 필요한 공통 컴포넌트입니다.
- **전환 기준:** 실제 소비자가 해당 DOM ref를 필요로 하면 props 계약에 ref를 포함합니다. 모든 표시 컴포넌트에 일괄 적용하는 기준은 아닙니다.

## 2. JSX에서 문서 제목과 설명 선언

기존에는 LandingPage·DocsPage·ShopLayout이 effect로 document.title을 설정하고 복구했습니다.
현재는 [PageMetadata](../src/shared/ui/page-metadata.tsx)를 활성 페이지가 렌더링합니다.
[PageHeader](../src/shared/ui/page-header.tsx)가 관리자 목록·상세 제목을 함께 제공하며,
ShopLayout의 제목 effect와 index.html의 고정 title/description은 제거했습니다.
여러 소유자가 제목을 덮어쓰거나 중복 생성하지 않도록 하기 위한 변경입니다.

### As-Is

```tsx
useEffect(() => {
    const previous = document.title;
    document.title = `${title} | React Sample`;
```

### To-Be

```tsx
export function PageMetadata({
  title,
  description,
  site = "React Sample",
}: {
  title: string;
  description?: string;
  site?: string;
}) {
  return (
    <>
      <title>{`${title} | ${site}`}</title>
      <meta
        name="description"
        content={description ?? `${title} — React Sample 예제`}
      />
    </>
  );
}
```

사용 예: 프로젝트 상세 PageHeader는 프로젝트 이름·설명을 사용하고, 쇼핑 상세는 상품명을 사용합니다.
DocsPage는 문서 제목·설명을 전달합니다. 제목은 활성 페이지당 하나이며,
SVG 차트의 `<title>`은 접근성 설명이므로 변경하지 않습니다.
이 변경 자체로 SSR·검색엔진용 사전 렌더링을 제공하지는 않습니다.

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 방식은 effect가 document.title이라는 React 외부 DOM 상태를 설정하고, 정리 함수에서 이전 값을 복구하는 명령형 동기화입니다.

- **이번 프로젝트의 판단:** 문서 제목을 effect로 관리하는 방식을 유지한 화면은 없습니다. 확인한 LandingPage·DocsPage·ShopLayout의 제목 처리는 페이지 소유 메타데이터로 정리했습니다. 기존 제목 처리 방식이 더 적절한 실제 화면이 있다고 설명하지 않습니다.
- **구분해야 할 유지 사례:** [CommerceCharts](../src/features/dashboard/components/CommerceCharts.tsx)·[DashboardCharts](../src/features/dashboard/components/DashboardCharts.tsx)의 SVG 내부 `<title>`은 차트의 접근성 설명입니다. 문서 제목의 대체 구현이 아니므로 hoisting 대상으로 바꾸지 않습니다.
- **전환 기준:** 데이터에 따라 달라지는 문서 제목·설명은 PageMetadata가 담당합니다. 다른 종류의 DOM 동기화까지 metadata API로 바꾸는 것은 아닙니다.

## 3. 프로젝트 상태의 낙관적 표시

기존 상세 화면은 상태 배지만 표시하는 조회 화면이었습니다.
복잡한 캐시 롤백 코드가 있던 화면을 단순화했다고 설명하지 않습니다.
이번에 [ProjectStatusControl](../src/features/projects/components/ProjectStatusControl.tsx)을 추가해
상태를 선택하면 응답 전 배지와 select 값을 변경하도록 했습니다.

### As-Is

```tsx
const query = useSuspenseQuery(projectQueryOptions(projectId));
const project = query.data;
// 생략: 기존 상세 화면의 다른 항목
<PageHeader
  title={project.name}
  description={project.description}
  actions={<ProjectStatusBadge status={project.status} />}
/>;
```

### To-Be

```tsx
import { useOptimistic, useRef, useState, useTransition } from "react";
import type {
  Project,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { useUpdateProjectStatusMutation } from "@/features/projects/queries/project-queries";
import { Select } from "@/shared/ui/select";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectStatusControl({ project }: { project: Project }) {
  const [status, setOptimisticStatus] = useOptimistic(project.status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const mutation = useUpdateProjectStatusMutation(project.id);
  const change = (next: ProjectStatus) => {
    if (inFlight.current || next === project.status) return;
    inFlight.current = true;
    startTransition(async () => {
      setOptimisticStatus(next);
      setError(null);
      try {
        await mutation.mutateAsync(next);
      } catch {
        setError("상태를 변경하지 못했습니다. 다시 선택해 주세요.");
      } finally {
        inFlight.current = false;
      }
    });
  };
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        <ProjectStatusBadge status={status} />
        <Select
          aria-label="프로젝트 상태 변경"
          value={status}
          disabled={pending}
          onChange={(event) => change(event.target.value as ProjectStatus)}
        >
          <option value="active">진행 중</option>
          <option value="paused">일시 중지</option>
          <option value="completed">완료</option>
        </Select>
      </div>
      {pending && (
        <p role="status" className="text-ink-subtle text-xs">
          상태 저장 중…
        </p>
      )}
      {error && (
        <p role="alert" className="text-negative text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
```

성공하면 서버 응답으로 detail 캐시를 갱신하고 관련 query 갱신을 기다립니다.
이 작업이 끝날 때까지 Action을 유지해야 임시 상태에서 오래된 데이터로 되돌아가는 깜빡임을 피할 수 있습니다.
실패하면 useOptimistic의 기준 값이 유지되어 기존 배지로 돌아갑니다.
에러 메시지·재시도와 동시에 한 번만 저장하도록 하는 제어는 애플리케이션이 담당합니다.
React는 서버 트랜잭션이나 요청 간 충돌을 해결하지 않습니다.

```tsx
export function useUpdateProjectStatusMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ProjectStatus) =>
      updateProjectStatus(projectId, status),
    onSuccess: async (saved) => {
      await queryClient.cancelQueries({
        queryKey: projectKeys.detail(projectId),
      });
      queryClient.setQueryData(projectKeys.detail(projectId), saved);
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

이 항목의 As-Is는 서버 조회 결과를 배지에 표시하는 읽기 전용 화면입니다.
수정 동작의 일반적인 기존 방식은 서버 성공 후 Query 캐시를 갱신하고 그 결과를 표시하는 것입니다.
별도로, 서버 요청이 없는 UI 값은 useState·Zustand에서 곧바로 변경할 수 있습니다.

- **동기 상태 변경이 더 적절한 곳:** [CartPage](../src/features/shop/pages/CartPage.tsx)의 수량 변경은 [shop-store](../src/features/shop/store/shop-store.ts)의 `quantity`를 바로 호출합니다. 기다릴 서버 응답이 없고 수량·합계가 이미 즉시 바뀌므로 임시 optimistic 상태와 롤백 수명을 추가하지 않습니다.
- **서버 성공 후 반영이 더 적절한 곳:** [UserAccessForm](../src/features/users/components/UserAccessForm.tsx)은 역할·이용 상태·권한을 검증하고 저장 성공 후 캐시와 완료 알림을 갱신합니다. 미확정 권한을 저장된 권한처럼 표시하는 것보다 결과 확인 후 반영하는 현재 흐름을 유지합니다.
- **React 19 방식이 적절한 곳:** ProjectStatusControl처럼 하나의 상태 선택을 먼저 보여주고, 저장 중 표시와 실패 복구를 함께 제공하는 조작입니다. 실제 권한 판정이나 서버 상태 자체를 대신하지 않습니다.

## 4. 로그인: RHF 검증과 Form Action의 책임 분리

[SignInPage](../src/pages/auth/SignInPage.tsx)는 RHF/Zod 검증을 유지합니다.
기존 submitError useState와 RHF isSubmitting 대신 Action 결과와 pending을 사용합니다.
이전 구현에도 useMutation은 없었으므로 Query 의존성을 제거한 변경은 아닙니다.
아래 코드는 컴포넌트 내부 발췌이며 전체 필드 마크업은 원본 파일에서 확인합니다.

### As-Is

```tsx
async function onSubmit(values: SignInValues) {
  setSubmitError(null);

  try {
    const { token, user } = await signInRequest(values);
    signIn({ token, user });
    await navigate({ to: search.redirect ?? "/" });
  } catch {
    setSubmitError("로그인에 실패했습니다. 다시 시도해주세요.");
  }
}
// 생략: 필드 마크업
<form onSubmit={form.handleSubmit(onSubmit)}>
  <Button type="submit" disabled={form.formState.isSubmitting}>
    로그인
  </Button>
</form>;
```

### To-Be

```tsx
const email = useController({ name: "email", control: form.control });
const password = useController({ name: "password", control: form.control });
const [result, submitAction, pending] = useActionState<
  { error: string | null },
  FormData
>(
  async () => {
    if (!(await form.trigger(undefined, { shouldFocus: true })))
      return { error: null };
    try {
      const { token, user } = await signInRequest(form.getValues());
      signIn({ token, user });
      await navigate({ to: search.redirect ?? "/" });
      return { error: null };
    } catch {
      return { error: "로그인에 실패했습니다. 다시 시도해주세요." };
    }
  },
  { error: null },
);
// 생략: 필드 마크업
<form action={submitAction} noValidate>
  <SubmitButton pendingLabel="로그인 중…">로그인</SubmitButton>
</form>;
```

RHF의 useController로 email/password를 제어 입력으로 연결합니다.
함수형 form action이 정상 반환하면 비제어 입력이 초기화될 수 있으므로,
검증 실패나 API 오류를 결과 상태로 반환해도 입력을 유지하도록 한 선택입니다.
필드 검증·첫 오류 포커스는 RHF, 서버 제출 결과·진행 상태는 Action이 담당합니다.
비밀번호를 URL·저장소·오류 보고에 기록하지 않습니다.

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 로그인은 `form.handleSubmit`이 검증 후 비동기 onSubmit을 호출하고, RHF isSubmitting과 별도의 submitError가 진행·오류 상태를 표현했습니다.
일반 관리 폼은 여기에 Query mutation의 캐시 갱신과 서버 오류 처리를 결합합니다.

- **기존 방식이 더 적절한 곳:** [ProductForm](../src/features/products/components/ProductForm.tsx)은 상품 필드, 옵션, 태그, 이미지 읽기, 필드 오류와 저장 후 처리를 함께 관리합니다. RHF·Zod·useSaveProductMutation의 책임이 이미 명확하므로 Action 상태를 추가해 중복 관리하지 않습니다.
- **함께 유지한 예:** [UserAccessForm](../src/features/users/components/UserAccessForm.tsx)은 권한 입력과 저장 결과를 기존 RHF·mutation 흐름으로 관리합니다. 단순히 필드 수만으로 Action 전환 여부를 정하지 않습니다.
- **React 19 방식이 적절한 곳:** 로그인처럼 한 제출의 검증·성공 이동·실패 메시지를 묶어 보여줄 수 있는 화면입니다. 로그인에서도 필드 검증과 포커스 처리는 RHF가 계속 담당합니다.

## 5. SubmitButton이 부모 폼 제출 상태 구독

[SubmitButton](../src/shared/ui/submit-button.tsx)은 `<form action={...}>` 안에 배치합니다.
폼 컴포넌트에서 disabled를 전달하지 않아도 부모 Action의 pending을 읽습니다.
기존 RHF onSubmit 폼의 isSubmitting을 자동 감지하는 API는 아닙니다.
복잡한 관리 폼은 기존 RHF·mutation 버튼을 유지합니다.

### As-Is

```tsx
<Button type="submit" disabled={form.formState.isSubmitting}>
  로그인
</Button>
```

### To-Be

```tsx
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./button";

export function SubmitButton({
  children,
  pendingLabel = "저장 중…",
  disabled,
  ...props
}: Omit<ButtonProps, "type" | "asChild"> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 방식은 폼이나 mutation을 소유한 컴포넌트가 제출 가능 여부를 계산하고 Button의 disabled·문구로 전달하는 명시적인 상태 전달입니다.

- **기존 방식이 더 적절한 곳:** [ProductForm](../src/features/products/components/ProductForm.tsx)의 저장 버튼은 `mutation.isPending || imageField.imageLoading || !!imageField.imageError`로 제출을 막습니다. 폼 제출 외에 이미지 읽기와 오류 조건도 판단해야 하고 `<form onSubmit>`을 사용하므로 기존 상태 전달이 맞습니다.
- **React 19 방식이 적절한 곳:** [SignInPage](../src/pages/auth/SignInPage.tsx)의 SubmitButton은 부모 `<form action>`의 pending을 구독합니다. 버튼을 하위 컴포넌트로 분리해도 제출 상태 prop을 연결할 필요가 없습니다.
- **전환 기준:** 버튼이 실제 Action 폼의 자식일 때 사용합니다. useFormStatus는 임의의 API 요청이나 RHF isSubmitting을 구독하지 않습니다. Action 폼에도 별도의 제출 금지 사유가 있다면 disabled 조건은 여전히 전달해야 합니다.

## 6. 전역 검색 이벤트 구독과 최신 상태 읽기 분리

[GlobalSearch](../src/layouts/GlobalSearch.tsx)는 열림 상태 변경마다 keydown 리스너를 다시 등록했습니다.
useEffectEvent가 최신 open을 읽도록 하면서 구독 effect는 유지합니다.
버튼 클릭이나 onOpenChange를 모두 Effect Event로 바꾸지 않습니다.
구독 대상 자체가 바뀌는 effect의 의존성을 숨기는 용도로도 사용하지 않습니다.

### As-Is

```tsx
useEffect(() => {
  const shortcut = (event: KeyboardEvent) => {
    if (
      event.repeat ||
      event.altKey ||
      !(event.metaKey || event.ctrlKey) ||
      event.key.toLowerCase() !== "k"
    )
      return;
    event.preventDefault();
    changeOpen(!open);
  };
  document.addEventListener("keydown", shortcut);
  return () => document.removeEventListener("keydown", shortcut);
}, [changeOpen, open]);
```

### To-Be

```tsx
const toggleFromShortcut = useEffectEvent(() => changeOpen(!open));
useEffect(() => {
  const shortcut = (event: KeyboardEvent) => {
    if (
      event.repeat ||
      event.altKey ||
      !(event.metaKey || event.ctrlKey) ||
      event.key.toLowerCase() !== "k"
    )
      return;
    event.preventDefault();
    toggleFromShortcut();
  };
  document.addEventListener("keydown", shortcut);
  return () => document.removeEventListener("keydown", shortcut);
}, []);
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 방식은 effect가 읽는 값이 달라지면 정리 후 외부 구독을 다시 생성하는 것입니다.
구독 대상이나 동기화 조건이 바뀌는 경우에는 이 재실행이 올바른 동작입니다.

- **기존 방식이 더 적절한 곳:** [DocsToc](../src/features/docs/components/DocsToc.tsx)은 `sections`가 바뀌면 관찰할 heading DOM도 달라지므로 observer를 해제하고 다시 연결해야 합니다. sections를 Effect Event 뒤에 숨겨 구독을 유지하면 안 됩니다.
- **함께 유지한 예:** [ToastItem](../src/shared/ui/toast.tsx)의 타이머 effect는 `toast.id`에 대응하는 알림을 제거합니다. 식별자가 바뀌면 이전 타이머를 정리하는 현재 의존성 관리가 적절합니다.
- **React 19 방식이 적절한 곳:** GlobalSearch의 keydown 구독 대상은 계속 document이고, 이벤트가 발생할 때 최신 open만 읽으면 됩니다. 구독 수명과 이벤트 시점에 읽는 값을 분리한 사례입니다.

## 7. Activity로 사용자 상세 탭의 입력 초안 보존

[UserDetailPage](../src/features/users/pages/UserDetailPage.tsx)의 기본 정보·권한 폼은
탭 전환 시 언마운트되어 로컬 입력 상태가 사라질 수 있었습니다.
Activity를 사용해 숨겨진 폼의 상태를 보존하고 effect를 정리합니다.
탭 선택은 기존 URL search의 `tab`이 계속 관리합니다.

### As-Is

```tsx
{
  search.tab === "profile" ? (
    <UserProfileForm key={user.id} user={user} />
  ) : null;
}
```

### To-Be

```tsx
<Activity mode={search.tab === "profile" ? "visible" : "hidden"}>
  <UserProfileForm key={user.id} user={user} />
</Activity>
```

화면을 떠나거나 새로고침하면 초안은 유지하지 않습니다. 다른 사용자로 이동하면
상위 QueryBoundary의 사용자 key가 바뀌므로 이전 사용자 초안을 재사용하지 않습니다.
권한 저장 후 key가 바뀌는 기존 폼 초기화 동작도 유지합니다.
숨겨진 패널은 DOM·상태를 보존하므로 그 크기에 비례하는 공간 비용이 있습니다.
전체 라우트를 무제한 보존하는 캐시로 사용하지 않습니다.

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 조건부 렌더링은 조건이 false가 되면 하위 컴포넌트를 언마운트해 로컬 상태·DOM·effect를 정리합니다.
화면을 다시 열 때 새로 시작하거나 보존할 입력이 없는 경우에는 이 동작이 유용합니다.

- **기존 방식이 더 적절한 곳:** [UserDetailPage](../src/features/users/pages/UserDetailPage.tsx)의 주문 내역·활동 로그 영역은 현재 조건부 렌더링을 유지합니다. 편집 초안이 없는 조회 콘텐츠이므로 숨긴 DOM을 계속 보존할 필요가 없습니다.
- **의도적으로 정리해야 하는 예:** [ReactExamplesPage](../src/features/react-examples/pages/ReactExamplesPage.tsx)의 측정 패널은 제거 버튼을 누르면 실제로 언마운트되어 ref cleanup을 확인해야 합니다. 여기를 Activity로 보존하면 예제의 목적이 달라집니다.
- **React 19 방식이 적절한 곳:** 같은 사용자 상세 화면의 기본 정보·권한 설정처럼 탭을 잠깐 바꿔도 미저장 입력을 유지해야 하는 폼입니다. 화면 이탈·새로고침 보존은 별도 요구사항입니다.

## 8. use(Promise)와 loader: 본문과 느린 영역 분리

기존 프로젝트 목록은 loader가 조회 완료를 기다리고 useSuspenseQuery로 캐시를 구독합니다.
이 방식은 주요 관리 화면에 그대로 유지합니다.
신규 `/react-19`는 비교 학습을 위해 loader가 Promise 자체를 반환하고,
사용자가 데이터 영역을 열 때만 use(Promise)로 읽습니다.
As-Is는 기존 프로젝트 경로의 핵심 코드이며, To-Be는 별도로 추가한 학습 경로입니다.

### As-Is

```tsx
// 기존 프로젝트 route
loader: ({ context }) =>
  Promise.all([context.queryClient.ensureQueryData(projectsQueryOptions())]),

// 기존 ProjectsPage: 캐시 변경을 계속 구독
const query = useSuspenseQuery(projectsQueryOptions());
```

### To-Be

```tsx
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { projectsQueryOptions, projectKeys } from "@/features/projects/queries";
import { ReactExamplesPage } from "@/features/react-examples/pages/examples";

export const Route = createFileRoute("/_dashboard/react-19")({
  loader: ({ context }) => {
    const projectsPromise = context.queryClient.fetchQuery(
      projectsQueryOptions(),
    );
    // The panel may stay closed. Observe rejection without replacing the original Promise.
    void projectsPromise.catch(() => undefined);
    return { projectsPromise, requestId: crypto.randomUUID() };
  },
  component: function ExamplesRoute() {
    const data = Route.useLoaderData();
    const router = useRouter();
    const client = useQueryClient();
    const [refreshing, startTransition] = useTransition();
    return (
      <ReactExamplesPage
        {...data}
        refreshing={refreshing}
        onRefresh={() =>
          startTransition(async () => {
            await client.invalidateQueries({
              queryKey: projectKeys.lists(),
              refetchType: "none",
            });
            await router.invalidate();
          })
        }
      />
    );
  },
});
```

실제 조건부 소비 컴포넌트:

```tsx
import { use } from "react";
import type { Project } from "@/features/projects/model";

export function DeferredProjects({
  visible,
  projectsPromise,
}: {
  visible: boolean;
  projectsPromise: Promise<Project[]>;
}) {
  if (!visible)
    return (
      <p className="text-ink-subtle text-sm">
        버튼을 누르면 준비 중인 프로젝트 데이터를 표시합니다.
      </p>
    );
  const projects = use(projectsPromise);
  return (
    <ul className="grid gap-3" aria-label="지연 로딩 프로젝트">
      {projects.map((project) => (
        <li key={project.id} className="border-line rounded-control border p-3">
          <strong>{project.name}</strong>
          <p className="text-ink-subtle text-sm">{project.description}</p>
        </li>
      ))}
    </ul>
  );
}
```

Promise는 렌더 함수에서 만들지 않고 loader에서 생성합니다. 닫힌 패널에서 요청이
실패하더라도 unhandled rejection이 생기지 않도록 관찰하되 원본 Promise를 그대로 전달합니다.
실패를 성공 데이터로 바꾸는 catch가 아닙니다.

이 예제는 **로드 시점 스냅샷**입니다. use(Promise) 자체는 Query 캐시의 후속 변경을
구독하지 않습니다. 새로고침·오류 재시도는 query를 stale 처리하고 loader를 다시 실행하여
새 Promise와 requestId를 전달합니다. QueryBoundary의 key도 교체해 실패한 Promise를 계속 읽지 않습니다.
이를 전체 useSuspenseQuery의 대체 패턴으로 확장하지 않습니다.

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 방식은 loader에서 필수 데이터를 준비하고 useSuspenseQuery로 캐시를 구독하거나,
보조 요청을 useQuery의 enabled·결과 상태로 제어하는 것입니다. 둘 다 현재 사용하는 방식입니다.

- **useSuspenseQuery가 더 적절한 곳:** [ProjectsPage](../src/features/projects/pages/ProjectsPage.tsx)와 [프로젝트 route](../src/routes/_dashboard/projects.index.tsx)는 목록 조회와 생성·상태 변경에 따른 캐시 갱신을 함께 다룹니다. 한 번 받은 Promise 값보다 지속적인 캐시 구독이 필요합니다.
- **useQuery가 더 적절한 곳:** [ProductSummary](../src/features/products/components/ProductSummary.tsx)의 관련 상품 조회는 `enabled: !!product`로 기존 상품에서만 활성화됩니다. 보조 데이터가 폼 전체를 suspend시키지 않도록 현재 방식을 유지합니다. 상품 폼 책임 분리 후 조회는 요약 컴포넌트가 소유합니다.
- **React 19 방식이 적절한 곳:** `/react-19`의 선택적 프로젝트 패널은 본문과 독립된 loader 스냅샷을 읽는 학습 예제입니다. use(Promise)를 쓰기 위해 기존 관리 화면의 캐시 구독을 제거하지 않습니다.
- **전환 기준:** 데이터가 로드 시점 스냅샷이어도 되는지, 후속 캐시 갱신을 구독해야 하는지, 준비 중일 때 어느 영역을 기다리게 할지를 먼저 결정합니다.

## 9. use(Context)와 짧은 Provider 표기

신규 [ContextExample](../src/features/react-examples/components/ContextExample.tsx)의 비교 예제입니다.
As-Is는 useContext의 일반적인 비교용 표현이며 기존 앱에서 제거한 코드가 아닙니다.
use(Context)는 조건부 return 뒤에서도 읽을 수 있습니다. 호출 위치는 여전히 컴포넌트·Hook 내부여야 합니다.
기존 Zustand 상태를 Context로 이관하지 않습니다.

### As-Is

```tsx
function ConditionalGuide({ expanded }: { expanded: boolean }) {
  const guide = useContext(GuideContext);
  if (!expanded) return <p>설명을 열면 Context 값을 표시합니다.</p>;
  return <p>{guide}</p>;
}
```

### To-Be

```tsx
import { createContext, use } from "react";
import { Button } from "@/shared/ui/button";

const GuideContext = createContext("Context의 기본 설명입니다.");
function ConditionalGuide({ expanded }: { expanded: boolean }) {
  if (!expanded)
    return (
      <p className="text-ink-subtle text-sm">
        설명을 열면 Context 값을 읽습니다.
      </p>
    );
  const guide = use(GuideContext);
  return <p className="text-sm">{guide}</p>;
}
export function ContextExample({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <GuideContext value="use(Context)는 조건문 뒤에서도 가장 가까운 Provider의 값을 읽습니다.">
      <div className="grid gap-3">
        <Button variant="secondary" onClick={onToggle} aria-expanded={expanded}>
          Context 설명 {expanded ? "닫기" : "보기"}
        </Button>
        <ConditionalGuide expanded={expanded} />
      </div>
    </GuideContext>
  );
}
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 useContext는 컴포넌트·Hook 최상위에서 Context를 읽으며, `.Provider`로 값을 공급합니다.
항상 같은 Context가 필요한 컴포넌트에서는 이 명시적인 형태가 충분합니다.

- **기존 방식이 더 적절한 곳:** [TestRouter](../src/shared/lib/test/TestRouter.tsx)의 TestContent는 매번 Content를 읽어야 하므로 `useContext(Content)`를 유지합니다. `.Provider` 역시 동작상 문제가 없어 함께 유지합니다. 조건부 읽기가 없는 이 코드에서는 변환 이점이 없습니다.
- **상태 저장 방식을 유지한 예:** [shop-store](../src/features/shop/store/shop-store.ts)의 장바구니는 Zustand의 selector와 영속화를 사용합니다. Context 소비 문법을 바꾸는 것과 상태 저장소를 교체하는 것은 다른 결정입니다.
- **React 19 방식이 적절한 곳:** ContextExample처럼 닫혀 있을 때 먼저 반환하고 열린 경우에만 Context 값을 읽는 예제입니다. 짧은 Provider 표기도 이 신규 예제에서 사용합니다.

## 10. ref callback이 DOM 자원의 정리 책임 소유

신규 [MeasuredPanel](../src/features/react-examples/components/MeasuredPanel.tsx)은
ResizeObserver의 수명을 DOM ref와 함께 관리합니다. As-Is는 비교용 effect 패턴입니다.
기존 DocsToc·ReadingProgress의 정상적인 effect는 변경하지 않았습니다.
useCallback으로 ref 함수의 참조를 유지해 단순 리렌더마다 observer를 재등록하지 않습니다.

### As-Is

```tsx
const ref = useRef<HTMLDivElement>(null);
useEffect(() => {
  const node = ref.current;
  if (!node || typeof ResizeObserver === "undefined") return;
  const observer = new ResizeObserver(([entry]) => {
    if (entry) setWidth(Math.round(entry.contentRect.width));
  });
  observer.observe(node);
  return () => observer.disconnect();
}, []);
// 생략: <div ref={ref}>에 측정 결과 표시
```

### To-Be

```tsx
import { useCallback, useState } from "react";

export function MeasuredPanel() {
  const [width, setWidth] = useState(0);
  const observe = useCallback((node: HTMLDivElement | null) => {
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={observe}
      className="border-line rounded-control border border-dashed p-4"
    >
      <p className="text-sm">관찰 중인 패널 너비: {width}px</p>
      <p className="text-ink-subtle mt-2 text-xs">
        창 크기를 변경해 보세요. 패널이 제거되면 ref 정리 함수가 observer를
        해제합니다.
      </p>
    </div>
  );
}
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 방식은 useRef로 DOM을 보관하고 effect에서 observer·리스너를 등록한 뒤 effect cleanup에서 해제하는 것입니다.
자원의 수명이 DOM 하나보다 화면의 데이터·구독 조건에 더 가깝다면 effect가 적절합니다.

- **기존 방식이 더 적절한 곳:** [ReadingProgress](../src/features/docs/components/ReadingProgress.tsx)는 window의 scroll/resize, document.body의 ResizeObserver, requestAnimationFrame을 한 effect에서 등록·정리합니다. 특정 div ref 한 개의 연결 수명으로 표현하기보다 화면 전체 구독으로 관리하는 것이 맞습니다.
- **함께 유지한 예:** [DocsToc](../src/features/docs/components/DocsToc.tsx)은 sections에 따라 여러 heading을 관찰합니다. 각 heading이 이 컴포넌트가 직접 렌더링하는 ref 대상도 아니므로 데이터 의존 effect를 유지합니다.
- **React 19 방식이 적절한 곳:** MeasuredPanel처럼 컴포넌트가 직접 렌더링하는 div 한 개의 연결·제거에 observer 수명을 정확히 맞추는 경우입니다.

## 11. 루트 오류 분류와 보고

[bootstrap](../src/app/bootstrap.tsx)의 createRoot에 [rootErrorHandlers](../src/app/error-reporting.ts)를 전달합니다.
Error Boundary는 복구 UI를, 루트 콜백은 React가 관찰한 렌더링 오류의 보고를 담당합니다.
외부 모니터링 SDK나 서버 전송은 추가하지 않습니다.
Router가 자체적으로 처리한 loader 오류·임의 이벤트 오류·모든 API 오류까지 자동 수집하는 장치는 아닙니다.

### As-Is

```tsx
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### To-Be

```tsx
createRoot(container, rootErrorHandlers).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
import type { RootOptions } from "react-dom/client";

export type RenderErrorKind = "caught" | "uncaught" | "recoverable";
export function reportRenderError(
  kind: RenderErrorKind,
  error: unknown,
  componentStack?: string | null,
) {
  // Keep diagnostics local; do not include raw API errors, form values or tokens.
  console.error("React rendering error", {
    kind,
    name: error instanceof Error ? error.name : "UnknownError",
    componentStack: componentStack ?? "",
  });
}
export const rootErrorHandlers: RootOptions = {
  onCaughtError: (error, info) =>
    reportRenderError("caught", error, info.componentStack),
  onUncaughtError: (error, info) =>
    reportRenderError("uncaught", error, info.componentStack),
  onRecoverableError: (error, info) =>
    reportRenderError("recoverable", error, info.componentStack),
};
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

이 항목의 As-Is는 별도 루트 보고 콜백 없이 createRoot를 생성하고 React의 기본 오류 보고를 사용하는 것입니다.
현재 앱의 유일한 루트는 공통 콜백을 연결했으므로, 이전 루트 초기화 방식을 유지한 별도 화면은 없습니다.

- **별개로 기존 처리가 더 적절한 곳:** [ProductForm](../src/features/products/components/ProductForm.tsx)의 `mutation.error`는 저장 실패를 폼 옆에 표시합니다. 사용자가 수정·재시도해야 할 업무 오류이므로 루트 렌더링 보고로 대체하지 않습니다.
- **함께 유지한 예:** [CartPage](../src/features/shop/pages/CartPage.tsx)의 QueryFeedback은 캐시 데이터를 유지한 채 백그라운드 갱신 실패와 refetch 버튼을 제공합니다. 이 UI도 createRoot 콜백으로 해결할 수 없습니다.
- **React 19 방식이 적절한 곳:** React가 관찰한 렌더링 오류를 caught·uncaught·recoverable로 분류해 보고할 때입니다. 폼 오류 처리·Query 피드백·Error Boundary의 복구 UI와 역할을 나눕니다.

## 12. 대표 이미지와 목록 이미지의 로딩 정책 분리

[ProductImage](../src/features/products/components/ProductImage.tsx)에 priority를 추가하고
ShopDetailPage의 첫 대표 이미지에서만 활성화합니다. 목록 이미지는 lazy를 유지합니다.
이 속성들은 React 19에 처음 생긴 기능이 아니며 리소스 로딩 검토에서 발견한 인접 개선입니다.
React 19의 preload/preconnect는 추가하지 않았습니다. 이미 fetchPriority를 사용하는 랜딩과
중복 요청하지 않도록 실제 네트워크·LCP를 측정한 뒤 적용 여부를 판단합니다.

### As-Is

```tsx
import { cn } from "@/shared/lib/cn";

export function ProductImage({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className={cn(
        "rounded-control bg-surface-muted aspect-square object-contain",
        className,
      )}
    />
  );
}
```

### To-Be

```tsx
import { cn } from "@/shared/lib/cn";

export function ProductImage({
  src,
  name,
  className,
  priority = false,
}: {
  src: string;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={name}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={cn(
        "rounded-control bg-surface-muted aspect-square object-contain",
        className,
      )}
    />
  );
}
```

### 기존 방식의 역할과 우리 프로젝트의 유지 사례

기존 방식은 공통 ProductImage가 항상 `loading="lazy"`로 이미지를 렌더링하는 것입니다.
화면 아래의 목록 이미지를 모두 우선 로딩하지 않도록 하는 용도에는 계속 적절합니다.

- **기존 방식이 더 적절한 곳:** [ShopProductCard](../src/features/shop/components/ShopProductCard.tsx)는 ProductImage에 priority를 전달하지 않아 기존 lazy 기본값을 사용합니다. 목록 카드 이미지 전체에 high 우선순위를 부여하지 않습니다.
- **변경 방식이 적절한 곳:** [ShopDetailPage](../src/features/shop/pages/ShopDetailPage.tsx)의 첫 대표 이미지만 eager/high로 요청합니다. 목록에서의 중요도와 상세 첫 화면에서의 중요도를 구분합니다.
- **전환 기준:** 첫 화면을 구성하는 대표 이미지인지 확인한 뒤 우선순위를 지정합니다. 별도의 React 19 preload/preconnect 도입이나 성능 향상 수치는 네트워크·LCP 측정 후 판단합니다. 이 속성 변경 자체는 React 19 전용 기능이 아닙니다.

## 유지하거나 보류한 항목

- 장바구니 수량은 Zustand가 즉시 갱신합니다. 서버 요청이 없는 동작에 useOptimistic을 추가하지 않았습니다.
- 상품 등 복잡한 편집 폼은 RHF·Zod·useMutation을 유지합니다.
- useEffectEvent를 모든 effect나 이벤트 핸들러에 일괄 적용하지 않았습니다.
- React Compiler는 별도 빌드 도구 도입입니다. 측정·호환성 검토 없이 추가하지 않았습니다.
- Server Components, Server Actions, cacheSignal, 서버 사전 렌더링은 현재 Vite SPA에 추가하지 않았습니다.
- 성능 향상을 수치로 주장하지 않습니다. 스칼라 optimistic 값 합성 자체는 O(1)이지만 React 전체 렌더링 비용을 뜻하지 않습니다. 목록 검색·집계의 기존 복잡도는 유지하며 Activity의 추가 공간은 보존하는 패널 상태·DOM 크기에 비례합니다.

## 검증과 스토리

- ref 전달·포커스·StrictMode cleanup과 document.head 제목 중복/갱신을 검사합니다.
- 로그인 검증, 제출 중 비활성화, 실패 후 입력 보존과 재시도를 검사합니다.
- 프로젝트 배지의 응답 전 변경, 실패 롤백, 성공 캐시 반영과 재시도를 검사합니다.
- 지연 Promise의 로딩/실패/새 Promise 복구, 조건부 Context, observer 해제를 검사합니다.
- 브라우저에서 탭 초안 보존, 동적 제목, 프로젝트 상태 변경, React 19 예제를 연결해 확인합니다.
- 기존 메뉴 단축키·키보드 접근성·모바일 화면·Storybook은 전체 `pnpm verify`로 확인합니다.

스토리:

- `Shared/UI/SubmitButton/FormAction`
- `Features/Projects/StatusControl/Interactive`
- `Features/React19/Examples/Ready`, `Loading`, `RetryError`

### React 19 구현 변경 후 실행 결과

- `mise exec -- pnpm verify`: 통과.
- Vitest: 61개 파일, 254개 테스트 통과(coverage 기준 포함).
- Playwright: Chromium E2E 61개 통과.
- 앱 production build 및 Storybook build: 통과.
- 구현 당시 문서 로컬 링크 검사와 `git diff --check`: 통과.
- 기존 Storybook 데코레이터의 Fast Refresh 린트 경고 1개는 남아 있으며 오류는 없습니다.
- 이미지 로딩의 LCP 개선량은 측정하지 않았습니다.

### 이번 문서 보완의 검증 범위

기존 방식의 유지 사례를 추가하면서 문서만 수정했습니다.
추가한 소스 링크의 존재 여부, Markdown 포맷과 diff 공백 오류를 확인합니다.
위의 전체 테스트 결과는 React 19 구현 당시 결과이며, 이번 문서 보완에서 애플리케이션 테스트를 재실행한 결과는 아닙니다.

## 공식 참고 자료

- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [useActionState](https://react.dev/reference/react/useActionState)
- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [use](https://react.dev/reference/react/use)
- [useEffectEvent](https://react.dev/reference/react/useEffectEvent)
- [Activity](https://react.dev/reference/react/Activity)
- [문서 제목](https://react.dev/reference/react-dom/components/title)
- [createRoot 오류 보고](https://react.dev/reference/react-dom/client/createRoot)

문서 사이트가 더 최신 React 버전을 설명할 수 있으므로 실제 구현은 저장소의 설치 버전과 테스트를 기준으로 합니다.

### 로그인 검증과 포커스

로그인 Action의 pending 동안 controlled 입력은 `readOnly`로 잠급니다. `disabled`로 만들면 RHF의 `shouldFocus`가 오류 입력에 포커스를 줄 수 없습니다. 제출 버튼은 `useFormStatus`로 비활성화하며, API 실패 후에는 입력을 보존하고 편집과 재제출을 허용합니다.
