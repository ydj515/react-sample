import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Package,
  ShoppingCart,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type { Notification } from "@/features/notifications/model/notification-schema";

const categoryIcons: Record<Notification["category"], LucideIcon> = {
  order: ShoppingCart,
  project: CheckCircle2,
  user: UserRound,
  product: Package,
  system: Bell,
};

const severityClass: Record<Notification["severity"], string> = {
  info: "bg-info-soft text-info",
  success: "bg-positive-soft text-positive",
  warning: "bg-caution-soft text-caution",
};

const severityIcon: Record<Notification["severity"], LucideIcon> = {
  info: Bell,
  success: CheckCircle2,
  warning: AlertTriangle,
};

export function NotificationCategoryIcon({
  category,
  severity,
}: {
  category: Notification["category"];
  severity: Notification["severity"];
}) {
  const Icon = severityIcon[severity] ?? categoryIcons[category];
  return (
    <span
      aria-hidden
      className={`grid size-9 shrink-0 place-items-center rounded-full ${severityClass[severity]}`}
    >
      <Icon className="size-4" />
    </span>
  );
}
