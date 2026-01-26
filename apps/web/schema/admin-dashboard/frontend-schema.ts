import * as z from "zod";
export const sliderSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(100, "Description exceeds the maximum length"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
  active: z.boolean(),
});

export type SliderFormValues = z.infer<typeof sliderSchema>;

export const testiomnialsSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters"),
  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(120, "Message exceeds the maximum length, 120 characters"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
  rating: z.number().min(1, "Rating must be at least 1"),
});
export type TestimonialsFormValues = z.infer<typeof testiomnialsSchema>;

export const aboutSchema = z.object({
  content: z.string().min(1, "Mission text is required"),
  image: z
    .any()
    .refine((file) => !file || file instanceof File, {
      message: "Invalid file",
    })
    .optional()
    .nullable(),
});
export type AboutFormValues = z.infer<typeof aboutSchema>;

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const socialSchema = z.object({
  facebook: z.string().url().or(z.literal("")),
  instagram: z.string().url().or(z.literal("")),
  youtube: z.string().url().or(z.literal("")),
  tiktok: z.string().url().or(z.literal("")),
});

export type SocialFormValues = z.infer<typeof socialSchema>;
