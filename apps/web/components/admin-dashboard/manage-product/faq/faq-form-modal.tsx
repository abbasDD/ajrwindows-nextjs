"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useInsertOne } from "@/hooks/use-insert-data";
import { useUpdateById } from "@/hooks/use-update-data";

const faqSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Answer description is required"),
});

type FAQFormValues = z.infer<typeof faqSchema>;

interface FAQModalProps {
  productId: string;
  faq_id?: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
}

export default function FAQFormModal({
  productId,
  faq_id,
  open,
  setOpen,
  title = "",
  description = "",
}: FAQModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: title || "",
        description: description || "",
      });
    }
  }, [open, title, description, form]);

  const onSubmit = async (values: FAQFormValues) => {
    setLoading(true);
    try {
      const payload = {
        product_id: productId,
        title: values.title,
        description: values.description,
      };

      if (faq_id) {
        await useUpdateById("product_faqs", payload, faq_id);
        toast.success("FAQ updated successfully");
      } else {
        await useInsertOne("product_faqs", payload);
        toast.success("FAQ added successfully");
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:min-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#D4C385]">
            {faq_id ? "Edit FAQ" : "Add New FAQ"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input className="custom_input_fields" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer / Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      className="custom_input_fields"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#D4C385] text-black hover:bg-[#D4C385]/90"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-4 w-4" />
                ) : faq_id ? (
                  "Update"
                ) : (
                  "Save FAQ"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
