"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoaderCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInsertOne } from "@/hooks/use-insert-data";
import { CategoryDataType } from "@/types/category-types";
import { useUpdateById } from "@/hooks/use-update-data";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: CategoryDataType;
}

const AddCategories = ({ open, setOpen, initialData }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const categoryName = form.watch("name");

  useEffect(() => {
    if (categoryName) {
      const generatedSlug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [categoryName]);

  useEffect(() => {
    if (initialData) {
      form.setValue("name", initialData.category);
      form.setValue("slug", initialData.slug);
    }
  }, [initialData]);

  const onSubmit = async (values: CategoryFormValues) => {
    setLoading(true);
    try {
      {
        initialData
          ? await useUpdateById(
              "categories",
              {
                category: values.name,
                slug: values.slug,
              },
              initialData.id,
            )
          : await useInsertOne("categories", {
              category: values.name,
              slug: values.slug,
            });
      }
      const message = initialData
        ? "Category updated successfully"
        : "Category added successfully";
      toast.success(message);
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add category");
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
          <DialogTitle>{initialData ? "Edit" : "Add New"} Category</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new category for your products. The slug is auto-generated
            but editable.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Electronics"
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
                      placeholder="e.g. electronics"
                      {...field}
                      className="bg-background border-white/10 font-mono text-sm"
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
                {loading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {initialData ? "Edit" : "Add"} Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategories;
