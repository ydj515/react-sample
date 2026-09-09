import {
  BarChart3,
  BookOpen,
  LayoutTemplate,
  Users,
  ShoppingCart,
  Package,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  to:
    | "/"
    | "/operations"
    | "/reports"
    | "/projects"
    | "/settings"
    | "/users"
    | "/orders"
    | "/products"
    | "/docs"
    | "/shop"
    | "/landing";
  label: string;
  icon: LucideIcon;
};
export type NavigationGroup = { label: string; items: NavigationItem[] };

export const navigationGroups: NavigationGroup[] = [
  {
    label: "대시보드",
    items: [
      { to: "/", label: "종합 대시보드", icon: LayoutDashboard },
      { to: "/operations", label: "프로젝트 운영", icon: ListChecks },
      { to: "/reports", label: "분석 리포트", icon: BarChart3 },
    ],
  },
  {
    label: "관리",
    items: [
      { to: "/users", label: "사용자 관리", icon: Users },
      { to: "/orders", label: "주문 관리", icon: ShoppingCart },
      { to: "/products", label: "상품 관리", icon: Package },
    ],
  },
  {
    label: "워크스페이스",
    items: [{ to: "/projects", label: "프로젝트", icon: FolderKanban }],
  },
  {
    label: "샘플",
    items: [
      { to: "/docs", label: "Blog / Docs", icon: BookOpen },
      { to: "/shop", label: "E-commerce", icon: ShoppingCart },
      { to: "/landing", label: "Landing Pages", icon: LayoutTemplate },
    ],
  },
  {
    label: "환경",
    items: [{ to: "/settings", label: "설정", icon: Settings2 }],
  },
];

export const navigationCommands = navigationGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label })),
);

export function currentNavigation(pathname: string) {
  return navigationCommands.find(
    (item) =>
      item.to === pathname ||
      (item.to !== "/" && pathname.startsWith(`${item.to}/`)),
  );
}

export function searchNavigation(query: string) {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  return navigationCommands.filter((item) =>
    `${item.group} ${item.label}`
      .toLocaleLowerCase("ko-KR")
      .includes(normalized),
  );
}
