import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { Select } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import {
  notificationCategories,
  type NotificationListSearch,
} from "@/features/notifications/model/notification-schema";

export function NotificationFilters({
  search,
  onChange,
  onReset,
}: {
  search: NotificationListSearch;
  onChange: (patch: Partial<NotificationListSearch>) => void;
  onReset?: () => void;
}) {
  return (
    <FilterBar>
      <FilterField label="카테고리">
        <Select
          aria-label="알림 카테고리"
          value={search.category}
          onChange={(event) =>
            onChange({
              category: event.target
                .value as NotificationListSearch["category"],
            })
          }
        >
          <option value="all">전체</option>
          {notificationCategories.map((category) => (
            <option key={category} value={category}>
              {labelFor(category)}
            </option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="읽음 상태">
        <Select
          aria-label="알림 읽음 상태"
          value={search.filter}
          onChange={(event) =>
            onChange({
              filter: event.target.value as NotificationListSearch["filter"],
            })
          }
        >
          <option value="all">전체</option>
          <option value="unread">안 읽음</option>
        </Select>
      </FilterField>
      {onReset ? (
        <Button type="button" variant="secondary" onClick={onReset}>
          초기화
        </Button>
      ) : null}
    </FilterBar>
  );
}

function labelFor(category: (typeof notificationCategories)[number]) {
  switch (category) {
    case "order":
      return "주문";
    case "project":
      return "프로젝트";
    case "user":
      return "사용자";
    case "product":
      return "상품";
    case "system":
      return "시스템";
    default:
      return category;
  }
}
