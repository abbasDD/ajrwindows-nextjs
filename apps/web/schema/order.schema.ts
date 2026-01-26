import * as z from "zod";

export const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area/Province is required"),
  zipcode: z.string().min(4, "Zip code is required"),
  address: z.string().min(5, "Full address is required"),
  delivery_type: z.enum(["pickup", "standard_shipping"]),
  payment_method: z.enum(["cod", "paypal"]),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
