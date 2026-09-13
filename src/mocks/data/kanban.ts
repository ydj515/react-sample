import type {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
} from "@/features/kanban/model";

const columns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "백로그",
    accent: "border-line-strong bg-surface-muted text-ink-muted",
    description: "아직 시작하지 않은 작업",
  },
  {
    id: "in_progress",
    title: "진행 중",
    accent: "border-info/40 bg-info-soft text-info",
    description: "담당자가 진행 중인 작업",
  },
  {
    id: "review",
    title: "리뷰",
    accent: "border-caution/40 bg-caution-soft text-caution",
    description: "코드 리뷰·QA·배포 준비",
  },
  {
    id: "done",
    title: "완료",
    accent: "border-positive/40 bg-positive-soft text-positive",
    description: "이번 스프린트에 끝낸 작업",
  },
];

const baseDate = new Date("2026-09-13").getTime();

const day = 24 * 60 * 60 * 1000;

function offset(days: number) {
  return new Date(baseDate + days * day).toISOString().slice(0, 10);
}

const initialCards: KanbanCard[] = [
  {
    id: "card-1",
    columnId: "backlog",
    order: 0,
    title: "결제 실패 토스트 개선",
    description: "재시도 버튼과 함께 어떤 단계에서 실패했는지 안내",
    priority: "medium",
    assignee: { id: "user-1", name: "김민준", initials: "김" },
    tags: ["결제", "UX"],
    dueDate: offset(7),
  },
  {
    id: "card-2",
    columnId: "backlog",
    order: 1,
    title: "다국어 알림 템플릿",
    description: "영어/일본어 번역 추가 및 번역 누락 알림",
    priority: "low",
    assignee: { id: "user-2", name: "이서연", initials: "이" },
    tags: ["i18n"],
    dueDate: offset(14),
  },
  {
    id: "card-3",
    columnId: "backlog",
    order: 2,
    title: "칸반 페이지 초기 셋업",
    description: "DnD와 optimistic update를 포함한 신규 화면",
    priority: "high",
    assignee: { id: "user-3", name: "박지호", initials: "박" },
    tags: ["신규"],
    dueDate: offset(2),
  },
  {
    id: "card-4",
    columnId: "backlog",
    order: 3,
    title: "디자인 토큰 마이그레이션",
    description: "디자인 시스템 v2 토큰으로 색상 매핑",
    priority: "medium",
    assignee: { id: "user-4", name: "정유진", initials: "정" },
    tags: ["디자인"],
    dueDate: offset(10),
  },
  {
    id: "card-5",
    columnId: "backlog",
    order: 4,
    title: "테스트 실패: 강제 시뮬레이션",
    description: "이 카드를 이동하면 서버가 409로 응답해 롤백을 검증한다.",
    priority: "urgent",
    assignee: { id: "user-5", name: "한지원", initials: "한" },
    tags: ["QA"],
    dueDate: null,
  },
  {
    id: "card-6",
    columnId: "in_progress",
    order: 0,
    title: "회원 탈퇴 플로우 점검",
    description: "데이터 보존 기간 옵션과 안내 문구 다듬기",
    priority: "high",
    assignee: { id: "user-6", name: "최도윤", initials: "최" },
    tags: ["회원"],
    dueDate: offset(3),
  },
  {
    id: "card-7",
    columnId: "in_progress",
    order: 1,
    title: "주문 목록 필터 UX 개선",
    description: "필터 칩에 카운트를 함께 표시",
    priority: "medium",
    assignee: { id: "user-1", name: "김민준", initials: "김" },
    tags: ["주문", "UX"],
    dueDate: offset(5),
  },
  {
    id: "card-8",
    columnId: "in_progress",
    order: 2,
    title: "이메일 템플릿 QA",
    description: "다크 모드에서 가독성 확인",
    priority: "low",
    assignee: { id: "user-2", name: "이서연", initials: "이" },
    tags: ["이메일"],
    dueDate: offset(6),
  },
  {
    id: "card-9",
    columnId: "in_progress",
    order: 3,
    title: "재고 부족 알림 자동화",
    description: "재고 임계치 알림을 알림 센터로 발행",
    priority: "high",
    assignee: { id: "user-3", name: "박지호", initials: "박" },
    tags: ["상품", "알림"],
    dueDate: offset(1),
  },
  {
    id: "card-10",
    columnId: "review",
    order: 0,
    title: "프로젝트 상세 상태 배지",
    description: "상태별 색상·아이콘 일관성 정리",
    priority: "medium",
    assignee: { id: "user-4", name: "정유진", initials: "정" },
    tags: ["프로젝트"],
    dueDate: offset(2),
  },
  {
    id: "card-11",
    columnId: "review",
    order: 1,
    title: "CSV 내보내기 인코딩 점검",
    description: "엑셀에서 한글 깨짐 방지 옵션 추가",
    priority: "high",
    assignee: { id: "user-7", name: "윤서아", initials: "윤" },
    tags: ["내보내기"],
    dueDate: offset(4),
  },
  {
    id: "card-12",
    columnId: "review",
    order: 2,
    title: "모바일 빈 상태 안내",
    description: "검색 결과가 없을 때 추천 검색어 노출",
    priority: "low",
    assignee: { id: "user-8", name: "강주원", initials: "강" },
    tags: ["UX", "모바일"],
    dueDate: offset(9),
  },
  {
    id: "card-13",
    columnId: "done",
    order: 0,
    title: "로그인 실패 입력 보존",
    description: "API 오류 후 사용자 입력과 토스트 유지",
    priority: "high",
    assignee: { id: "user-1", name: "김민준", initials: "김" },
    tags: ["로그인"],
    dueDate: offset(-2),
  },
  {
    id: "card-14",
    columnId: "done",
    order: 1,
    title: "스토리북 회귀 테스트",
    description: "공통 UI 스토리 스모크 테스트 자동화",
    priority: "medium",
    assignee: { id: "user-2", name: "이서연", initials: "이" },
    tags: ["테스트"],
    dueDate: offset(-5),
  },
  {
    id: "card-15",
    columnId: "done",
    order: 2,
    title: "메뉴 검색 키보드 단축키",
    description: "Cmd/Ctrl+K로 검색창 열기",
    priority: "low",
    assignee: { id: "user-6", name: "최도윤", initials: "최" },
    tags: ["GNB"],
    dueDate: offset(-7),
  },
  {
    id: "card-16",
    columnId: "done",
    order: 3,
    title: "알림 센터 MVP",
    description: "GNB 종 아이콘과 풀 페이지, 무한 스크롤",
    priority: "high",
    assignee: { id: "user-3", name: "박지호", initials: "박" },
    tags: ["신규", "알림"],
    dueDate: offset(-1),
  },
];

let cards: KanbanCard[] = structuredClone(initialCards);

export const kanbanFixture: KanbanBoard = {
  columns,
  cards: structuredClone(initialCards),
};

export function getKanbanBoard(): KanbanBoard {
  return {
    columns: structuredClone(columns),
    cards: structuredClone(cards),
  };
}

export interface MoveCardInput {
  cardId: string;
  toColumnId: KanbanCard["columnId"];
  toIndex: number;
}

export interface MoveCardResult {
  card: KanbanCard;
}

export type MoveCardFailure =
  | { status: 404; code: "CARD_NOT_FOUND"; message: string }
  | { status: 409; code: "INVALID_MOVE"; message: string };

export function moveCard(
  input: MoveCardInput,
): MoveCardResult | MoveCardFailure {
  const card = cards.find((item) => item.id === input.cardId);
  if (!card) {
    return {
      status: 404,
      code: "CARD_NOT_FOUND",
      message: "카드를 찾을 수 없습니다.",
    };
  }
  if (card.title.includes("테스트 실패")) {
    return {
      status: 409,
      code: "INVALID_MOVE",
      message: "서버가 이동 요청을 거절했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
  const sourceColumn = card.columnId;

  const movedCard: KanbanCard = {
    ...card,
    columnId: input.toColumnId,
    order: input.toIndex,
  };

  const remaining = cards.filter((item) => item.id !== card.id);

  const targetSiblings = remaining
    .filter((item) => item.columnId === input.toColumnId)
    .sort((a, b) => a.order - b.order);

  const insertIndex = Math.max(
    0,
    Math.min(input.toIndex, targetSiblings.length),
  );
  targetSiblings.splice(insertIndex, 0, movedCard);
  targetSiblings.forEach((item, index) => {
    item.order = index;
  });
  const rebuilt: KanbanCard[] = [];
  for (const column of columns) {
    const inColumn =
      column.id === input.toColumnId
        ? targetSiblings
        : remaining
            .filter((item) => item.columnId === column.id)
            .sort((a, b) => a.order - b.order);
    inColumn.forEach((item, index) => {
      item.order = index;
    });
    rebuilt.push(...inColumn);
  }
  cards = rebuilt;
  const finalCard = cards.find((item) => item.id === card.id) ?? movedCard;
  // sourceColumn 변수를 명시적으로 사용하지 않으면 경고가 발생한다.
  void sourceColumn;
  return { card: structuredClone(finalCard) };
}

export function resetKanbanMockData() {
  cards = structuredClone(initialCards);
}

export const kanbanData = {
  getCards: () => cards,
};
