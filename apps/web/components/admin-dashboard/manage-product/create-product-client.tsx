"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGetData, useGetDataById } from "@/hooks/use-get-data";
import { useUpdateById } from "@/hooks/use-update-data";
import { useInsertOne } from "@/hooks/use-insert-data";
import {
  ProductFormValues,
  productSchema,
} from "@/schema/admin-dashboard/product-schema";
import { generateSlug } from "@/lib/utils";
import { bucket } from "@/services/upload.service";
import { Buckets } from "@/constant/constant";
import { ProductDataType } from "@/types/product-types";

const PRODUCT_SPECS = [
  { name: "frameWidth", label: "Frame Width", placeholder: "e.g. 33.50" },
  { name: "frameHeight", label: "Frame Height", placeholder: "e.g. 81.75" },
  { name: "frameMaterial", label: "Frame Material", placeholder: "e.g. Wood" },
  {
    name: "sillMaterial",
    label: "Sill Material",
    placeholder: "e.g. Mill finish",
  },
  { name: "paintType", label: "Paint Type", placeholder: "e.g. Painted" },
  { name: "slabWidth", label: "Slab Width", placeholder: "e.g. 32" },
  { name: "slabHeight", label: "Slab Height", placeholder: "e.g. 79" },
  { name: "slabMaterial", label: "Slab Material", placeholder: "e.g. Steel" },
  { name: "slabStyle", label: "Slab Style", placeholder: "e.g. D10" },
  { name: "glassType", label: "Glass Type", placeholder: "e.g. 3mm/3mm" },
  { name: "glazing", label: "Glazing", placeholder: "e.g. 180 low e" },
  { name: "hinge", label: "Hinge", placeholder: "e.g. In Swing Left" },
] as const;

const CreateProductForm = ({ productId }: { productId?: string }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const { data: categories, isLoading: isLoadingCategory } =
    useGetData<any>("categories");
  const { data: allProductTypes, isLoading: isLoadingProductType } =
    useGetData<any>("product_types");
  const { data: existingProduct, isLoading: isFetching } = useGetDataById<any>(
    "products",
    productId as string,
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      productName: "",
      categoryId: "",
      productTypeId: "",
      usage: "",
      color: "",
      price: "",
      discountedPrice: "",
      description: "",
      frameWidth: "",
      frameHeight: "",
      frameMaterial: "",
      sillMaterial: "",
      paintType: "",
      slabWidth: "",
      slabHeight: "",
      slabMaterial: "",
      slabStyle: "",
      glassType: "",
      glazing: "",
      hinge: "",
      image: null,
    },
  });

  useEffect(() => {
    if (existingProduct && categories && allProductTypes) {
      form.reset({
        productName: existingProduct.product_name,
        categoryId: existingProduct.category_id,
        productTypeId: existingProduct.product_type_id,
        usage: existingProduct.usage || "",
        color: existingProduct.color || "",
        price: String(existingProduct.price),
        discountedPrice: String(existingProduct.discounted_price || ""),
        description: existingProduct.description || "",
        frameWidth: existingProduct.frame_width || "",
        frameHeight: existingProduct.frame_height || "",
        frameMaterial: existingProduct.frame_material || "",
        sillMaterial: existingProduct.sill_material || "",
        paintType: existingProduct.paint_type || "",
        slabWidth: existingProduct.slab_width || "",
        slabHeight: existingProduct.slab_height || "",
        slabMaterial: existingProduct.slab_material || "",
        slabStyle: existingProduct.slab_style || "",
        glassType: existingProduct.glass_type || "",
        glazing: existingProduct.glazing || "",
        hinge: existingProduct.hinge || "",
      });
      setImagePreview(existingProduct.image_url);
    }
  }, [
    existingProduct,
    categories,
    form,
    allProductTypes,
    isLoadingCategory,
    isLoadingProductType,
  ]);

  const selectedCategoryId = form.watch("categoryId");

  const filteredProductTypes = useMemo(() => {
    if (!selectedCategoryId || !allProductTypes) return [];
    return allProductTypes.filter(
      (type: any) => type?.category_id === selectedCategoryId,
    );
  }, [selectedCategoryId, allProductTypes]);

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      let finalImageUrl = existingProduct?.image_url;
      if (values.image instanceof File) {
        finalImageUrl = await bucket.uploadFile(
          values.image,
          Buckets.PRODUCTS,
          "products",
        );
      }

      const productData: ProductDataType = {
        category_id: values.categoryId,
        product_type_id: values.productTypeId,
        product_name: values.productName,
        slug: generateSlug(values.productName),
        usage: values.usage,
        color: values.color,
        price: Number(values.price),
        discounted_price: values.discountedPrice
          ? Number(values.discountedPrice)
          : 0,
        description: values.description,
        frame_width: values.frameWidth,
        frame_height: values.frameHeight,
        frame_material: values.frameMaterial,
        sill_material: values.sillMaterial,
        paint_type: values.paintType,
        slab_width: values.slabWidth,
        slab_height: values.slabHeight,
        slab_material: values.slabMaterial,
        slab_style: values.slabStyle,
        glass_type: values.glassType,
        glazing: values.glazing,
        hinge: values.hinge,
        image_url: finalImageUrl,
      };

      if (productId) {
        await useUpdateById("products", productData, productId);
        toast.success("Product updated successfully");
      } else {
        await useInsertOne("products", productData);
        toast.success("Product added successfully");
      }
      router.push("/admin/dashboard/manage-product");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (productId && isFetching) {
    return (
      <div className="flex justify-center py-20">
        <LoaderCircle className="animate-spin h-10 w-10 text-[#D4C385]" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* 1. Classification */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#D4C385] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4C385]/30"></span>
            Classification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium">
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="custom_input_fields w-full">
                        <SelectValue placeholder="-- Select Category --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1A1D24] border-white/10 text-white">
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium">
                    Product Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCategoryId}
                  >
                    <FormControl>
                      <SelectTrigger className="custom_input_fields w-full">
                        <SelectValue
                          placeholder={
                            selectedCategoryId
                              ? "-- Select Type --"
                              : "Select Category first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1A1D24] border-white/10 text-white">
                      {filteredProductTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#D4C385] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4C385]/30"></span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-300 font-medium">
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input className="custom_input_fields" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {["usage", "color", "price", "discountedPrice"].map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 capitalize font-medium">
                      {key.replace(/([A-Z])/g, " $1")}
                    </FormLabel>
                    <FormControl>
                      <Input className="custom_input_fields" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-300 font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="bg-white/5 h-24 border-white/10 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#D4C385] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4C385]/30"></span>
            Product Media
          </h2>
          <div className="bg-white/5 border border-dashed border-white/10 grid place-items-center w-full h-[220px] rounded-xl p-6 overflow-hidden relative">
            {!imagePreview ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <UploadCloud className="h-10 w-10 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-300">Upload product image</p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer h-full"
                  onChange={(e) => handleImageChange(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="relative group max-w-sm mx-auto w-full h-full bg-[#0F1115] rounded-lg overflow-hidden border border-white/10">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      form.setValue("image", undefined as any);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" /> Remove Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#D4C385] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4C385]/30"></span>
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_SPECS.map((spec) => (
              <FormField
                key={spec.name}
                control={form.control}
                name={spec.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400 text-sm">
                      {spec.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="custom_input_fields"
                        placeholder={spec.placeholder}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            variant="secondary"
            className="min-w-[150px]"
          >
            {loading && <LoaderCircle className="animate-spin mr-2" />}{" "}
            {productId ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProductForm;
