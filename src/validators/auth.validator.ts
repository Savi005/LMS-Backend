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

    export const logoutSchema = z.object({
        refreshToken: z.string().min(1,"Refresh token is required"),
    })
    .strict();

    export const changePasswordSchema = z.object({
        currentPassword: z.string().min(1,"Current password is required"),
        newPassword: z.string().min(8,"New password must be at least 8 characters long"),
    }).refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],})