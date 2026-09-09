import { Badge } from "@/shared/ui/badge";
import { userStatusLabels, type ManagedUser } from "../model/user-schema";

const variants = {
  active: "success",
  invited: "info",
  suspended: "warning",
} as const;
export function UserStatusBadge({ status }: { status: ManagedUser["status"] }) {
  return (
    <Badge className="whitespace-nowrap" variant={variants[status]}>
      {userStatusLabels[status]}
    </Badge>
  );
}
