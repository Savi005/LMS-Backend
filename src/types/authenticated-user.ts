import type { UserRole } from "./role";

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}
