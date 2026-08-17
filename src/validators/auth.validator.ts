import{z} from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2).max(50),
    email: z.email().trim().toLowerCase(),
    password:z.string().min(8),
    role: z.enum(["student", "teacher", "admin"]),
})

.strict();

export const loginSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8),
})
.strict();

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1,"Refresh token is required"),
})
.strict();