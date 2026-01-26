import * as z from "zod";

const numberRegex = /^\d+$/;

export const formSchema = z
  .object({
    code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
    type: z.enum(["percentage", "fixed"]),
    value: z.string().regex(numberRegex, "Must be a valid number"),
    min_order_amount: z
      .string()
      .regex(numberRegex, "Must be a number")
      .optional(),
    max_discount: z.string().regex(numberRegex, "Must be a number").optional(),
    usage_limit: z.string().regex(numberRegex, "Must be a number").optional(),
    valid_from: z.date({ message: "Start date is required" }),
    valid_until: z.date({ message: "End date is required" }),
    is_active: z.boolean(),
  })
  .refine((data) => data.valid_until > data.valid_from, {
    message: "End date must be after start date",
    path: ["valid_until"],
  });

export type PromoFormValues = z.infer<typeof formSchema>;
