import type {
  Notification,
  NotificationPage,
} from "@/features/notifications/model";

// 기준일: 데모 데이터의 "현재" 시각으로 고정해 테스트/문서가 일관된 결과를 사용한다.
const baseTime = new Date("2026-09-13T09:00:00Z").getTime();

function iso(offsetMinutes: number) {
  return new Date(baseTime - offsetMinutes * 60_000).toISOString();
}

const notifications: Notification[] = [
  {
    id: "ntf-001",
    category: "order",
    severity: "warning",
    title: "주문 #2047 배송이 지연되고 있습니다",
    body: "CJ대한통운 010-1234-5678 운송장이 48시간 동안 업데이트되지 않았습니다.",
    createdAt: iso(2),
    read: false,
    actor: { id: "user-1", name: "김민준" },
    link: { to: "/orders/%232047", label: "주문 상세 열기" },
  },
  {
    id: "ntf-002",
    category: "project",
    severity: "success",
    title: "프로젝트 '웹 리디자인' 마일스톤 완료",
    body: "디자인 시안 검토 단계가 종료되어 다음 단계로 진행할 수 있습니다.",
    createdAt: iso(12),
    read: false,
    actor: { id: "user-2", name: "이서연" },
    link: { to: "/projects/project-2", label: "프로젝트 보기" },
  },
  {
    id: "ntf-003",
    category: "user",
    severity: "info",
    title: "신규 관리자 가입 요청",
    body: "박지호 님이 관리자 권한을 요청했습니다. 검토 후 승인해 주세요.",
    createdAt: iso(34),
    read: false,
    actor: { id: "user-3", name: "박지호" },
    link: { to: "/users/user-3", label: "사용자 보기" },
  },
  {
    id: "ntf-004",
    category: "order",
    severity: "success",
    title: "주문 #2046 결제 완료",
    body: "카드 결제 138,000원이 정상 승인되었습니다.",
    createdAt: iso(70),
    read: false,
    actor: { id: "user-1", name: "김민준" },
    link: { to: "/orders/%232046", label: "주문 상세 열기" },
  },
  {
    id: "ntf-005",
    category: "product",
    severity: "warning",
    title: "재고 부족: 베이직 슬립온 270",
    body: "재고가 3개 남았습니다. 입고 예정일은 9월 18일입니다.",
    createdAt: iso(95),
    read: false,
    actor: null,
    link: { to: "/products/product-2/edit", label: "재고 보충" },
  },
  {
    id: "ntf-006",
    category: "system",
    severity: "info",
    title: "주간 리포트가 준비되었습니다",
    body: "9월 2주차 매출 요약과 카테고리별 변동 리포트를 확인하세요.",
    createdAt: iso(180),
    read: false,
    actor: null,
    link: { to: "/reports", label: "리포트 열기" },
  },
  {
    id: "ntf-007",
    category: "order",
    severity: "info",
    title: "주문 #2045 배송 시작",
    body: "CJ대한통운 010-2222-3333으로 배송이 시작되었습니다.",
    createdAt: iso(240),
    read: true,
    actor: { id: "user-4", name: "정유진" },
    link: { to: "/orders/%232045", label: "주문 상세 열기" },
  },
  {
    id: "ntf-008",
    category: "project",
    severity: "info",
    title: "새 작업이 할당되었습니다",
    body: "'백오피스 알림 패널' 작업이 담당자로 배정되었습니다.",
    createdAt: iso(360),
    read: true,
    actor: { id: "user-2", name: "이서연" },
    link: { to: "/projects", label: "작업 보기" },
  },
  {
    id: "ntf-009",
    category: "user",
    severity: "info",
    title: "권한 변경 요청",
    body: "한지원 님이 '콘텐츠팀' 관리자 권한을 요청했습니다.",
    createdAt: iso(420),
    read: true,
    actor: { id: "user-5", name: "한지원" },
    link: { to: "/users/user-5", label: "사용자 보기" },
  },
  {
    id: "ntf-010",
    category: "product",
    severity: "success",
    title: "신규 상품이 등록되었습니다",
    body: "에어쿠션 러닝화 5종이 카탈로그에 추가되었습니다.",
    createdAt: iso(540),
    read: true,
    actor: { id: "user-6", name: "최도윤" },
    link: { to: "/products", label: "상품 목록 보기" },
  },
  {
    id: "ntf-011",
    category: "order",
    severity: "info",
    title: "주문 #2044 배송 완료",
    body: "배송이 완료되어 구매 확정 안내가 전송되었습니다.",
    createdAt: iso(720),
    read: true,
    actor: { id: "user-7", name: "윤서아" },
    link: null,
  },
  {
    id: "ntf-012",
    category: "system",
    severity: "info",
    title: "스토리지 80% 도달",
    body: "이미지 자산 저장소가 80%를 사용 중입니다. 정리를 권장합니다.",
    createdAt: iso(900),
    read: true,
    actor: null,
    link: null,
  },
  {
    id: "ntf-013",
    category: "project",
    severity: "warning",
    title: "마감 임박 작업 3건",
    body: "오늘 자정까지 완료하지 않은 작업이 3건 있습니다.",
    createdAt: iso(1200),
    read: true,
    actor: null,
    link: { to: "/operations", label: "운영 화면 열기" },
  },
  {
    id: "ntf-014",
    category: "order",
    severity: "info",
    title: "주문 #2043 취소 요청",
    body: "구매자가 결제 후 1시간 내 취소 요청을 보냈습니다.",
    createdAt: iso(1320),
    read: true,
    actor: { id: "user-8", name: "강주원" },
    link: { to: "/orders/%232043", label: "주문 상세 열기" },
  },
  {
    id: "ntf-015",
    category: "product",
    severity: "info",
    title: "리뷰 12건 등록",
    body: "지난 24시간 동안 신규 리뷰가 12건 등록되었습니다.",
    createdAt: iso(1500),
    read: true,
    actor: null,
    link: { to: "/products", label: "상품 목록 보기" },
  },
];

function paginate(
  items: Notification[],
  cursor: string | null,
  limit: number,
): NotificationPage {
  const startIndex = cursor ? Number.parseInt(cursor, 10) : 0;

  const safeStart = Number.isFinite(startIndex) ? Math.max(0, startIndex) : 0;

  const slice = items.slice(safeStart, safeStart + limit);

  const nextStart = safeStart + slice.length;
  return {
    items: slice,
    nextCursor: nextStart < items.length ? String(nextStart) : null,
  };
}

export function listNotifications(params: {
  cursor?: string | null;
  limit?: number;
  category?: string;
  filter?: string;
}): NotificationPage {
  const limit = Math.max(1, Math.min(20, params.limit ?? 8));

  const filtered = notifications.filter((notification) => {
    if (params.category && params.category !== "all") {
      if (notification.category !== params.category) return false;
    }
    if (params.filter === "unread" && notification.read) return false;
    return true;
  });
  return paginate(filtered, params.cursor ?? null, limit);
}

export function countUnread(): { count: number; latestId: string | null } {
  const unread = notifications.filter((notification) => !notification.read);

  const latest = unread[0] ?? null;
  return { count: unread.length, latestId: latest ? latest.id : null };
}

export function findNotification(id: string) {
  return notifications.find((notification) => notification.id === id) ?? null;
}

export function markRead(id: string) {
  const notification = findNotification(id);
  if (!notification) return null;
  notification.read = true;
  return notification;
}

export function markAllRead() {
  let count = 0;
  for (const notification of notifications) {
    if (!notification.read) {
      notification.read = true;
      count += 1;
    }
  }
  return { count, latestId: null as string | null };
}

export function resetNotificationsMockData() {
  // fixture 의 read 상태를 id 기반으로 복구한다 (ntf-007 부터 read=true).
  for (const notification of notifications) {
    notification.read = notification.id >= "ntf-007";
  }
}
