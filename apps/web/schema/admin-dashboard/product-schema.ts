import * as z from "zod";

export const productTypeSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export type ProductTypeFormValues = z.infer<typeof productTypeSchema>;

export const productSchema = z
  .object({
    productName: z.string().min(1, "Product name is required"),
    categoryId: z.string().min(1, "Please select a category"),
    productTypeId: z.string().min(1, "Product type is required"),
    usage: z.string().min(1, "Usage is required"),
    color: z.string().min(1, "Color is required"),
    price: z
      .string()
      .min(1, "Price is required")
      .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid price (e.g. 10.99)"),
    discountedPrice: z
      .string()
      .optional()
      .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), "Invalid format"),
    description: z.string().min(1, "Description is required"),
    frameWidth: z.string().min(1, "Required"),
    frameHeight: z.string().min(1, "Required"),
    frameMaterial: z.string().min(1, "Required"),
    sillMaterial: z.string().min(1, "Required"),
    paintType: z.string().min(1, "Required"),
    slabWidth: z.string().min(1, "Required"),
    slabHeight: z.string().min(1, "Required"),
    slabMaterial: z.string().min(1, "Required"),
    slabStyle: z.string().min(1, "Required"),
    glassType: z.string().min(1, "Required"),
    glazing: z.string().min(1, "Required"),
    hinge: z.string().min(1, "Required"),
    image: z
      .any()
      .refine((file) => !file || file instanceof File, {
        message: "Invalid file",
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.discountedPrice && data.price) {
        return parseFloat(data.discountedPrice) < parseFloat(data.price);
      }
      return true;
    },
    {
      message: "Discounted price must be smaller than the actual price",
      path: ["discountedPrice"],
    },
  );

export type ProductFormValues = z.infer<typeof productSchema>;
