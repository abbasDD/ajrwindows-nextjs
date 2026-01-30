"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";

import { useInsertOne } from "@/hooks/use-insert-data";
import { useGetData } from "@/hooks/use-get-data";
import {
  ProductTypeFormValues,
  productTypeSchema,
} from "@/schema/admin-dashboard/product-schema";
import { ProductTypeDataType } from "@/types/product-types";
import { useUpdateById } from "@/hooks/use-update-data";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: ProductTypeDataType;
}

const AddProductType = ({ open, setOpen, initialData }: Props) => {
  const [loading, setLoading] = useState(false);
  const { data: categories } = useGetData<any[]>("categories");

  const form = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: { categoryId: "", name: "", slug: "" },
  });

  const productName = form.watch("name");

  useEffect(() => {
    if (productName) {
      const generatedSlug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [productName]);
  useEffect(() => {
    if (initialData) {
      form.setValue("name", initialData.name);
      form.setValue("slug", initialData.slug);
      form.setValue("categoryId", initialData.category_id);
    }
  }, [initialData]);

  const onSubmit = async (values: ProductTypeFormValues) => {
    setLoading(true);
    try {
      {
        initialData
          ? await useUpdateById(
              "product_types",
              {
                name: values.name,
                slug: values.slug,
                category_id: values.categoryId,
              },
              initialData.id.toString(),
            )
          : await useInsertOne("product_types", {
              name: values.name,
              slug: values.slug,
              category_id: values.categoryId,
            });
      }
      const message = initialData
        ? "Product Type updated successfully"
        : "Product Type added successfully";
      toast.success(message);
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    if (!initialData) form.reset();
  };
  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Add New"} Product Type
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background w-full border-white/10">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat?.id} value={cat?.id}>
                          {cat?.category}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-background border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-background border-white/10 font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin mr-2" />
                ) : initialData ? null : (
                  <Plus className="mr-2" />
                )}
                {initialData ? "Update" : "Add"} Product Type
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductType;
