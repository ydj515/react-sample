import { z } from "zod";
import { listSearchSchema } from "@/shared/lib/list-search";

export const userRoles = ["admin", "manager", "viewer"] as const;
export const userStatuses = ["active", "invited", "suspended"] as const;
export const roleLabels = {
  admin: "관리자",
  manager: "매니저",
  viewer: "조회 전용",
};
export const userStatusLabels = {
  active: "활성",
  invited: "초대됨",
  suspended: "이용 중지",
};
export const membershipGrades = ["일반", "Silver", "Gold", "Platinum"] as const;
export const permissionLabels = {
  reviews: ["상품 리뷰 작성", "구매한 상품에 리뷰를 남길 수 있습니다."],
  coupons: ["쿠폰 사용", "발급된 쿠폰을 주문 시 사용할 수 있습니다."],
  email: ["이메일 수신", "마케팅 이메일과 뉴스레터를 수신합니다."],
  sms: ["SMS 수신", "배송 알림과 프로모션 문자를 수신합니다."],
  adminPanel: ["관리자 패널 접근", "관리자 화면 접근 설정을 관리합니다."],
} as const;
export const permissionsSchema = z.object({
  reviews: z.boolean(),
  coupons: z.boolean(),
  email: z.boolean(),
  sms: z.boolean(),
  adminPanel: z.boolean(),
});
export const userProfileSchema = z.object({
  name: z.string().trim().min(2, "이름은 2자 이상 입력하세요.").max(40),
  email: z.email("이메일을 확인하세요."),
  department: z.string().trim().min(1).max(40),
  nickname: z.string().trim().min(2, "닉네임은 2자 이상 입력하세요.").max(40),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+() -]{7,20}$/, "연락처를 확인하세요."),
  grade: z.enum(membershipGrades),
  address: z.string().trim().max(200),
  memo: z.string().trim().max(1000),
});
export type UserProfile = z.infer<typeof userProfileSchema>;
export const userAccessSchema = z.object({
  role: z.enum(userRoles),
  status: z.enum(userStatuses),
  permissions: permissionsSchema.optional(),
});
export const userSchema = userProfileSchema
  .extend(userAccessSchema.shape)
  .extend({
    permissions: permissionsSchema,
    points: z.number().nonnegative(),
    id: z.string(),
    joinedAt: z.iso.datetime(),
    lastSeenAt: z.iso.datetime().nullable(),
    activity: z.array(
      z.object({ id: z.string(), text: z.string(), at: z.iso.datetime() }),
    ),
  });
export type ManagedUser = z.infer<typeof userSchema>;
export type UserAccess = z.infer<typeof userAccessSchema>;
export const usersSearchSchema = listSearchSchema.extend({
  role: z.enum(["all", ...userRoles]).catch("all"),
  status: z.enum(["all", ...userStatuses]).catch("all"),
});
export const userDetailSearchSchema = usersSearchSchema.extend({
  tab: z.enum(["profile", "orders", "access", "activity"]).catch("profile"),
});
