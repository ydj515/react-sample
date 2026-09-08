import type { ManagedUser } from "@/features/users/model/user-schema";
import type { ManagedOrder } from "@/features/orders/model/order-schema";
import {
  productImages,
  type Product,
} from "@/features/products/model/product-schema";
import { commerceFixture } from "./commerce";

const names = [
  "김민준",
  "이서연",
  "박지호",
  "최수아",
  "정현우",
  "한소민",
  "오승환",
  "윤서준",
  "강지윤",
  "임도현",
  "서하린",
  "송예준",
  "홍수빈",
  "장우진",
  "유채원",
  "문시우",
  "신예린",
  "배준서",
  "조다은",
  "백현서",
  "노지안",
  "양태윤",
  "남서현",
  "심지후",
];
const users: ManagedUser[] = names.map((name, i) => ({
  id: `user-${i + 1}`,
  name,
  email: `member${i + 1}@example.com`,
  nickname: `member_${i + 1}`,
  phone: "010-0000-0000",
  grade: i % 3 === 0 ? "Gold" : "일반",
  address: `서울특별시 샘플로 ${i + 10} (예시 주소)`,
  memo: i === 0 ? "배송 전 연락을 선호하는 고객입니다." : "",
  points: 5200 + i * 100,
  permissions: {
    reviews: true,
    coupons: true,
    email: false,
    sms: true,
    adminPanel: i < 2,
  },
  department: ["운영팀", "고객지원팀", "콘텐츠팀", "상품팀"][i % 4]!,
  role: i < 2 ? "admin" : i % 3 === 0 ? "manager" : "viewer",
  status: i % 9 === 8 ? "suspended" : i % 7 === 6 ? "invited" : "active",
  joinedAt: `2025-05-${String(i + 1).padStart(2, "0")}T09:00:00Z`,
  lastSeenAt:
    i % 7 === 6
      ? null
      : `2025-06-${String(30 - (i % 8)).padStart(2, "0")}T08:30:00Z`,
  activity: [
    {
      id: `user-event-${i}`,
      text: "워크스페이스에 초대되었습니다.",
      at: `2025-05-${String(i + 1).padStart(2, "0")}T09:00:00Z`,
    },
  ],
}));
const orders: ManagedOrder[] = commerceFixture.orders.map((order, i) => ({
  ...order,
  customerId:
    users.find((user) => user.name === order.customer)?.id ?? users[i % 6]!.id,
  email:
    users.find((user) => user.name === order.customer)?.email ??
    users[i % 6]!.email,
  phone: "010-0000-0000",
  grade: "Gold",
  deliveryRequest: "부재 시 문 앞에 놓아주세요.",
  carrier: "CJ대한통운",
  trackingNumber: order.status === "대기" ? "" : `DEMO-${2047 - i}`,
  paidAt: `${order.date}T09:00:00Z`,
  approvalNumber: `SAMPLE-${2047 - i}`,
  discount: 10000,
  shippingFee: 0,
  pointsUsed: 1000,
  items: [
    {
      productId: `product-${i + 1}`,
      name: order.product,
      image:
        productImages[
          ["신발", "의류", "액세서리", "기타"].indexOf(order.category)
        ] ?? productImages[3],
      color: "기본",
      size: order.category === "신발" ? "270" : "FREE",
      quantity: 1,
      unitPrice: order.amount + 11000,
    },
  ],
  address: `서울특별시 샘플로 ${10 + i} (예시 주소)`,
  paymentMethod: i % 2 ? "간편 결제" : "카드 결제",
  timeline: [
    {
      id: `${order.id}-received`,
      status: "대기",
      text: "주문이 접수되었습니다.",
      at: `${order.date}T09:00:00Z`,
    },
    ...(order.status === "대기"
      ? []
      : [
          {
            id: `${order.id}-current`,
            status: order.status,
            text: `${order.status} 상태로 처리되었습니다.`,
            at: `${order.date}T12:00:00Z`,
          },
        ]),
  ],
  notes: [],
}));
const uniqueProducts = [
  ...new Map(
    commerceFixture.orders.map((order) => [order.product, order]),
  ).values(),
];
const products: Product[] = uniqueProducts.map((order, i) => ({
  id: `product-${i + 1}`,
  name: order.product,
  sku: `SKU-${String(i + 1).padStart(3, "0")}`,
  brand: order.brand,
  category: order.category as Product["category"],
  price: order.amount,
  listPrice: Math.ceil((order.amount * 1.2) / 1000) * 1000,
  variants: ["250", "260", "270"].map((size, index) => ({
    color: "화이트",
    size: order.category === "신발" ? size : ["S", "M", "L"][index]!,
    stock:
      index === 2
        ? [42, 8, 0, 65, 4, 18][i % 6]! -
          Math.floor([42, 8, 0, 65, 4, 18][i % 6]! / 3) * 2
        : Math.floor([42, 8, 0, 65, 4, 18][i % 6]! / 3),
  })),
  sales: [180, 210, 145, 230, 195, 287].map((quantity, index) => ({
    month: `${index + 1}월`,
    quantity: quantity + i,
    revenue: (quantity + i) * order.amount,
  })),
  reviews: [
    {
      id: `review-${i}-1`,
      author: "김민준",
      rating: 5,
      date: "2025-06-28",
      text: "착용감이 편안하고 마감이 꼼꼼합니다. 일상에서 자주 사용하고 있어요.",
    },
    {
      id: `review-${i}-2`,
      author: "이서연",
      rating: 4,
      date: "2025-06-20",
      text: "배송이 빠르고 안내된 상품 정보와 같았습니다.",
    },
    {
      id: `review-${i}-3`,
      author: "박지호",
      rating: 5,
      date: "2025-06-15",
      text: "가격 대비 만족스럽습니다. 다음에도 구매하고 싶어요.",
    },
  ],
  stock: [42, 8, 0, 65, 4, 18][i % 6]!,
  status: i % 11 === 10 ? "archived" : i % 7 === 6 ? "draft" : "active",
  image:
    productImages[
      ["신발", "의류", "액세서리", "기타"].indexOf(order.category)
    ] ?? productImages[3],
  tags: i % 3 === 0 ? ["인기", "추천"] : ["기본"],
  description: `${order.brand} ${order.product} 상품 예제입니다.`,
  createdAt: `2025-05-${String((i % 28) + 1).padStart(2, "0")}T09:00:00Z`,
  updatedAt: "2025-06-30T09:00:00Z",
}));
export const managementFixture = { users, orders, products };
export const managementData = structuredClone(managementFixture);
export function resetManagementMockData() {
  Object.assign(managementData, structuredClone(managementFixture));
}
