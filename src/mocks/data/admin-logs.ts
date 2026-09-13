import type { AdminLog } from "@/features/admin-logs/model";

const channels: AdminLog["channel"][] = [
  "auth",
  "orders",
  "products",
  "users",
  "system",
];

const severities: AdminLog["severity"][] = ["info", "warning", "error"];

const actors = [
  "system",
  "admin@example.com",
  "manager@example.com",
  "scheduler",
  "billing-bot",
];

const channelMessages: Record<AdminLog["channel"], string[]> = {
  auth: [
    "사용자 로그인 성공",
    "사용자 로그인 실패",
    "비밀번호 재설정 메일 발송",
    "관리자 세션 만료",
    "OAuth 토큰 갱신",
  ],
  orders: [
    "주문 결제 완료",
    "주문 상태 변경",
    "배송 추적 정보 업데이트",
    "부분 취소 처리",
    "환불 요청 등록",
  ],
  products: [
    "상품 등록",
    "재고 임박 알림",
    "옵션 변경 저장",
    "태그 일괄 수정",
    "판매 통계 갱신",
  ],
  users: [
    "신규 사용자 초대",
    "역할 변경",
    "이용 정지",
    "비밀번호 변경",
    "이메일 수신 동의 변경",
  ],
  system: [
    "스케줄러 작업 실행",
    "데이터 백업 완료",
    "스토리지 사용량 경고",
    "캐시 워밍업",
    "배포 작업 시작",
  ],
};

const resources: Record<AdminLog["channel"], string[]> = {
  auth: ["/api/login", "/api/users/me", "/api/auth/refresh"],
  orders: ["/api/orders", "/api/orders/ord-240", "/api/orders/ord-198"],
  products: ["/api/products", "/api/products/prd-12", "/api/products/prd-77"],
  users: ["/api/users", "/api/users/usr-09", "/api/users/usr-22"],
  system: ["/internal/scheduler", "/internal/backup", "/internal/cache"],
};

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function createFixture(count: number): AdminLog[] {
  const base = Date.UTC(2025, 8, 1, 9, 0, 0);

  const logs: AdminLog[] = [];
  for (let i = 0; i < count; i += 1) {
    const channel = channels[i % channels.length] ?? "system";

    const severity = severities[(i * 7) % severities.length] ?? "info";

    const actor = actors[(i * 11) % actors.length] ?? "system";

    const messages = channelMessages[channel];

    const resourcesForChannel = resources[channel];

    const message = messages[(i * 3) % messages.length] ?? "활동 기록";

    const resource =
      resourcesForChannel[(i * 5) % resourcesForChannel.length] ?? "/";

    const offsetSeconds = i * 137;

    const occurred = new Date(base + offsetSeconds * 1000).toISOString();
    logs.push({
      id: `log-${(i + 1).toString().padStart(4, "0")}`,
      occurredAt: occurred,
      channel,
      severity,
      actor,
      message,
      resource,
      actions:
        severity === "error"
          ? [
              {
                id: `ack-${i}`,
                label: "확인",
                tone: "secondary",
              },
              {
                id: `retry-${i}`,
                label: "재시도",
                tone: "primary",
              },
            ]
          : [],
    });
  }
  return logs;
}

export const adminLogsFixture: AdminLog[] = createFixture(420);

export function formatLogDateTime(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds(),
  )}`;
}
