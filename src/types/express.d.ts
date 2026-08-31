import type { UserRole } from "../types/role";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: UserRole;
            };
        }
    }
}

export {};