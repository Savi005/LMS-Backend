import{z} from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2).max(50),
    email: z.email().trim().toLowerCase(),
    password:z.string().min(8),
    role: z.enum(["student", "teacher", "admin"]),
})

.strict();