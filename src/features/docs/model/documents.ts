export type DocumentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "note"; title: string; text: string };
export type DocSection = { id: string; title: string; blocks: DocumentBlock[] };
export type DocArticle = {
  slug: string;
  title: string;
  category: string;
  description: string;
  minutes: number;
  sections: DocSection[];
};

export const documents: DocArticle[] = [
  {
    slug: "getting-started",
    title: "React Sample 시작하기",
    category: "시작하기",
    minutes: 4,
    description:
      "작은 컴포넌트부터 실제 화면까지. 프로젝트를 실행하고, 샘플을 탐색하며 React 애플리케이션의 흐름을 익혀보세요.",
    sections: [
      {
        id: "overview",
        title: "이 샘플에서 배우는 것",
        blocks: [
          {
            type: "paragraph",
            text: "React Sample은 라우팅, 데이터 조회, 폼 검증과 테스트를 한 프로젝트에서 살펴보는 실습용 애플리케이션입니다. 관리자 화면에서는 데이터를 다루는 흐름을, 이 문서에서는 콘텐츠를 읽고 탐색하는 흐름을 확인할 수 있습니다.",
          },
          {
            type: "list",
            items: [
              "대시보드: 차트, 검색 조건, CSV 내보내기",
              "관리 화면: 사용자·주문·상품의 조회와 편집",
              "문서: 검색, 목차, 코드 복사와 연속 탐색",
            ],
          },
          {
            type: "note",
            title: "먼저 알아두세요",
            text: "관리 API는 MSW로 동작합니다. 새로고침하면 샘플 데이터가 초기화되며, 실제 결제나 서버 저장을 수행하지 않습니다.",
          },
        ],
      },
      {
        id: "run-locally",
        title: "로컬에서 실행하기",
        blocks: [
          {
            type: "paragraph",
            text: "저장소에서 mise로 프로젝트 도구 버전을 맞춘 뒤 의존성을 설치하세요. 개발 서버는 파일 변경을 감지해 화면에 반영합니다. 문서는 로그인 없이 /docs에서 열 수 있습니다.",
          },
          {
            type: "code",
            language: "bash",
            code: "mise install\npnpm install\npnpm dev",
          },
          {
            type: "paragraph",
            text: "UI 컴포넌트만 따로 확인하려면 Storybook을 실행하세요. 기본 상태뿐 아니라 빈 결과와 저장 오류도 살펴볼 수 있습니다.",
          },
          { type: "code", language: "bash", code: "pnpm storybook" },
        ],
      },
      {
        id: "project-map",
        title: "코드의 위치 찾기",
        blocks: [
          {
            type: "paragraph",
            text: "URL 정의는 routes, 화면 구성은 features, 재사용 UI는 shared에서 찾습니다. 기능마다 같은 배치 규칙을 사용하므로 관심 있는 화면에서 API까지 흐름을 따라갈 수 있습니다.",
          },
          {
            type: "code",
            language: "text",
            code: "src/\n  routes/       # URL과 화면 연결\n  features/     # 도메인별 화면과 동작\n  layouts/      # 공통 화면 틀\n  shared/       # UI와 유틸리티\n  mocks/        # 샘플 API와 데이터",
          },
          {
            type: "note",
            title: "다음 단계",
            text: "컴포넌트 설계 문서에서 공통 버튼과 도메인 컴포넌트를 구분하는 기준을 확인하세요.",
          },
        ],
      },
    ],
  },
  {
    slug: "components",
    title: "컴포넌트 설계 가이드",
    category: "핵심 개념",
    minutes: 5,
    description:
      "역할은 작게, 조합은 유연하게. 같은 디자인 언어로 다양한 화면을 구성하는 방법을 소개합니다.",
    sections: [
      {
        id: "boundaries",
        title: "책임에 따라 나누기",
        blocks: [
          {
            type: "paragraph",
            text: "공통 버튼은 사용자가 어떤 주문을 편집하는지 알 필요가 없습니다. 도메인 데이터와 행동은 feature에 두고, 표현과 기본 상호작용은 shared/ui 컴포넌트에 맡기세요.",
          },
          {
            type: "list",
            items: [
              "shared/ui: 버튼, 입력, 페이지네이션처럼 독립적인 표현",
              "features: 주문 상태, 사용자 권한처럼 도메인 의미가 있는 기능",
              "pages: 여러 컴포넌트와 데이터 흐름을 조합하는 화면",
            ],
          },
        ],
      },
      {
        id: "composition",
        title: "Props와 조합",
        blocks: [
          {
            type: "paragraph",
            text: "표현의 차이는 명시적인 Props로 전달하세요. 공통 버튼의 variant를 사용하면 색상, 크기, 포커스 표현을 페이지마다 다시 정의하지 않아도 됩니다.",
          },
          {
            type: "code",
            language: "tsx",
            code: 'import { Button } from "@/shared/ui/button";\n\nexport function SaveButton({ pending }: { pending: boolean }) {\n  return (\n    <Button type="submit" disabled={pending}>\n      {pending ? "저장 중…" : "변경 사항 저장"}\n    </Button>\n  );\n}',
          },
          {
            type: "note",
            title: "추상화 기준",
            text: "모양이 비슷하다는 이유만으로 도메인 컴포넌트를 합치지 마세요. 책임과 변경 이유가 같을 때 공통화를 검토합니다.",
          },
        ],
      },
      {
        id: "accessibility",
        title: "키보드와 접근성",
        blocks: [
          {
            type: "paragraph",
            text: "클릭할 수 있는 요소는 button 또는 link로 표현합니다. 아이콘 버튼에는 접근 가능한 이름을 지정하고, 키보드 포커스가 눈에 보이도록 유지하세요.",
          },
          {
            type: "list",
            items: [
              "입력에는 연결된 label 또는 aria-label 제공",
              "현재 문서에는 aria-current 적용",
              "모바일 메뉴는 Escape로 닫고 포커스를 진입 버튼으로 복귀",
              "오류는 색상뿐 아니라 텍스트로 설명",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "server-state",
    title: "서버 상태와 데이터 흐름",
    category: "핵심 개념",
    minutes: 5,
    description:
      "TanStack Query와 MSW로 데이터 조회, 캐시, 변경 이후의 화면 갱신을 연결합니다.",
    sections: [
      {
        id: "state-ownership",
        title: "상태의 소유자 정하기",
        blocks: [
          {
            type: "paragraph",
            text: "서버에서 읽는 사용자 목록은 TanStack Query에, 테마 같은 클라이언트 설정은 Zustand에 둡니다. 열린 메뉴나 복사 완료 메시지처럼 한 컴포넌트에만 필요한 상태는 지역 상태로 관리합니다.",
          },
          {
            type: "list",
            items: [
              "서버 상태: 목록·상세 데이터와 요청 상태",
              "URL 상태: 공유할 검색 조건과 현재 페이지",
              "폼 상태: 입력값과 검증 오류",
              "지역 상태: 모바일 메뉴와 코드 복사 결과",
            ],
          },
        ],
      },
      {
        id: "request-flow",
        title: "요청과 응답의 경계",
        blocks: [
          {
            type: "paragraph",
            text: "API 함수는 공통 apiRequest를 통해 요청하고 Zod 스키마로 응답을 검증합니다. 화면은 네트워크 구현 대신 query hook을 사용합니다.",
          },
          {
            type: "code",
            language: "text",
            code: "Page → Query hook → API function\n     → apiRequest → fetch → MSW\n     ← 검증한 데이터 ← Zod schema",
          },
          {
            type: "note",
            title: "정적 콘텐츠는 예외",
            text: "이 문서 페이지는 프로젝트에 포함한 콘텐츠를 직접 읽습니다. 네트워크 요청이 없으므로 로딩 상태나 Query 캐시를 추가하지 않습니다.",
          },
        ],
      },
      {
        id: "refresh",
        title: "변경 후 다시 읽기",
        blocks: [
          {
            type: "paragraph",
            text: "주문 상태를 변경하면 상세뿐 아니라 목록과 대시보드에도 영향을 줍니다. mutation 성공 시 관련 query를 갱신해 서로 다른 화면에 오래된 정보가 남지 않도록 합니다.",
          },
          {
            type: "list",
            items: [
              "query key에 데이터 식별자와 조회 조건 포함",
              "저장 실패 시 사용자의 입력 보존",
              "재조회 실패 시 기존 데이터와 재시도 동작 제공",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "forms",
    title: "입력과 폼 검증",
    category: "실전 가이드",
    minutes: 4,
    description:
      "입력부터 저장 결과까지, 사용자가 다음 행동을 이해할 수 있는 폼을 만듭니다.",
    sections: [
      {
        id: "validation",
        title: "입력 계약 정의하기",
        blocks: [
          {
            type: "paragraph",
            text: "Zod에 입력 규칙을 모으고 React Hook Form으로 입력과 오류 상태를 관리합니다. 서버에 요청하기 전 검증하되 API에서도 같은 계약을 확인합니다.",
          },
          {
            type: "code",
            language: "tsx",
            code: 'import { z } from "zod";\n\nexport const noteSchema = z.object({\n  text: z.string().trim().min(1, "메모를 입력하세요.").max(1000),\n});',
          },
        ],
      },
      {
        id: "feedback",
        title: "상태를 명확하게 알리기",
        blocks: [
          {
            type: "paragraph",
            text: "저장 중에는 중복 제출을 막고, 성공하면 갱신한 내용을 보여주세요. 실패하면 원인을 알리고 입력한 내용을 그대로 유지해 다시 시도할 수 있게 합니다.",
          },
          {
            type: "list",
            items: [
              "필드 오류: 입력 바로 아래에 설명",
              "요청 오류: 폼 안에서 재시도 가능한 안내",
              "변경 없는 저장: 불필요한 활동 로그 생성 방지",
            ],
          },
        ],
      },
      {
        id: "form-stories",
        title: "실패 상태도 예제로 남기기",
        blocks: [
          {
            type: "paragraph",
            text: "Storybook에서 기본, 저장 성공, 입력 오류, 저장 실패 상태를 독립적으로 확인하세요. 같은 API fixture를 사용하더라도 스토리마다 상태를 초기화해야 결과가 서로 영향을 주지 않습니다.",
          },
          {
            type: "note",
            title: "확인할 예제",
            text: "Features / Orders / NoteForm과 Features / Users / ProfileForm에서 저장 실패 후 입력을 유지하는 동작을 살펴보세요.",
          },
        ],
      },
    ],
  },
  {
    slug: "testing",
    title: "테스트와 검증",
    category: "실전 가이드",
    minutes: 4,
    description:
      "작은 동작 검증부터 실제 브라우저 여정까지, 변경에 맞는 검증 범위를 선택합니다.",
    sections: [
      {
        id: "test-layers",
        title: "무엇을 어디서 검증할까",
        blocks: [
          {
            type: "list",
            items: [
              "단위 테스트: 검색, 정렬, 계산과 스키마",
              "컴포넌트 테스트: 입력, 오류와 접근 가능한 상태",
              "통합 테스트: fetch와 MSW를 거치는 API 계약",
              "E2E: URL 이동, 반응형 메뉴와 실제 브라우저 동작",
            ],
          },
          {
            type: "paragraph",
            text: "내부 변수보다 사용자가 관찰하는 결과를 검사하세요. 클래스 이름 대신 역할, 이름, 텍스트로 요소를 찾으면 표현을 바꿔도 동작 검증을 유지할 수 있습니다.",
          },
        ],
      },
      {
        id: "commands",
        title: "검증 명령 실행하기",
        blocks: [
          {
            type: "code",
            language: "bash",
            code: "pnpm test\npnpm validate\npnpm verify",
          },
          {
            type: "paragraph",
            text: "validate는 타입, 린트, 포맷, 커버리지와 빌드를 검사합니다. verify는 여기에 Storybook 빌드와 Playwright E2E를 더합니다. 최초 E2E 실행 전 pnpm exec playwright install chromium으로 브라우저를 설치하세요.",
          },
        ],
      },
      {
        id: "review-checklist",
        title: "화면을 마무리하는 기준",
        blocks: [
          {
            type: "list",
            items: [
              "390px 모바일에서 가로 넘침 없이 읽을 수 있는가?",
              "키보드만으로 검색과 메뉴 이동이 가능한가?",
              "직접 URL 진입과 새로고침이 같은 화면을 보여주는가?",
              "라이트·다크 테마에서 텍스트와 포커스가 구분되는가?",
            ],
          },
          {
            type: "note",
            title: "회귀 테스트",
            text: "버그를 고칠 때는 먼저 실패하는 테스트로 문제를 재현하세요. 수정 후 같은 테스트가 통과하는지 확인하면 변경 근거를 남길 수 있습니다.",
          },
        ],
      },
    ],
  },
];
export function findDocument(slug: string) {
  return documents.find((document) => document.slug === slug);
}
export function searchDocuments(query: string) {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  if (!normalized) return [];
  return documents.flatMap((doc) => {
    const section = doc.sections.find((item) =>
      [
        item.title,
        ...item.blocks.flatMap((block) =>
          block.type === "list"
            ? block.items
            : block.type === "code"
              ? [block.code]
              : [block.text],
        ),
      ]
        .join(" ")
        .toLocaleLowerCase("ko-KR")
        .includes(normalized),
    );
    const titleMatch = `${doc.title} ${doc.description}`
      .toLocaleLowerCase("ko-KR")
      .includes(normalized);
    return titleMatch || section
      ? [
          {
            slug: doc.slug,
            title: doc.title,
            excerpt: titleMatch ? doc.description : section!.title,
            hash: titleMatch ? "" : section!.id,
          },
        ]
      : [];
  });
}
