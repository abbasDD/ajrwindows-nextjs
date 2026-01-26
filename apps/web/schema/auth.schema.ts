import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginAuth = z.infer<typeof loginSchema>;
export const registerSchema = z
  .object({
    username: z
      .string()
      .regex(
        /^[a-z0-9]{3,20}$/,
        "Username must be 3 to 20 characters, lowercase letters and numbers only",
      ),
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type RegisterAuthType = z.infer<typeof registerSchema>;
