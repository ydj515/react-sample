import {
  userSchema,
  type UserProfile,
  type UserAccess,
} from "@/features/users/model/user-schema";
import { apiRequest } from "@/shared/api/http-client";
const headers = { "Content-Type": "application/json" };
export function getUsers() {
  return apiRequest("/api/users", { schema: userSchema.array() });
}
export function getUser(id: string) {
  return apiRequest(`/api/users/${encodeURIComponent(id)}`, {
    schema: userSchema,
  });
}
export function updateUserAccess(id: string, input: UserAccess) {
  return apiRequest(`/api/users/${encodeURIComponent(id)}/access`, {
    schema: userSchema,
    method: "PATCH",
    headers,
    body: JSON.stringify(input),
  });
}

export function updateUserProfile(id: string, input: UserProfile) {
  return apiRequest(`/api/users/${encodeURIComponent(id)}/profile`, {
    schema: userSchema,
    method: "PATCH",
    headers,
    body: JSON.stringify(input),
  });
}
