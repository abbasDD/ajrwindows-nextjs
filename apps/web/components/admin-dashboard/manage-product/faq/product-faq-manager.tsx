"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Folder, Plus, Edit } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { useDeleteOne } from "@/hooks/use-delete-data";
import { toast } from "sonner";
import DeleteConfirmDialoag from "@/components/ui/delete-confirm-dialog";
import FAQFormModal from "./faq-form-modal";

const ProductFAQManager = ({ productId }: { productId: string }) => {
  const { data, isLoading, error } = useGetData<any>("product_faqs");
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const productFaqs =
    data?.filter((faq: any) => faq.product_id === productId) || [];
  const handleDelete = async (id: string) => {
    try {
      await useDeleteOne("product_faqs", id);
      toast.success("FAQ deleted successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 border-[#D4C385] text-[#D4C385] hover:bg-[#D4C385] hover:text-black transition-all"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Manage FAQs
          </Button>
        </DialogTrigger>

        <DialogContent className="min-w-auto lg:min-w-5xl  h-[60vh] flex flex-col gap-6 ">
          <div className="border-b  flex items-center justify-between  py-6">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-[#D4C385]">
                Product FAQs
              </DialogTitle>
              <p className="text-sm text-gray-400">
                Add, edit, or remove frequently asked questions for this
                product.
              </p>
            </div>
            <Button
              size="lg"
              variant={"secondary"}
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add FAQ
            </Button>
          </div>

          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-300">Question Title</TableHead>
                <TableHead className="text-gray-300">
                  Answer / Description
                </TableHead>
                <TableHead className="text-gray-300 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell>
                        <Skeleton className="h-5 w-48 bg-white/5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full bg-white/5" />
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-20 bg-white/5" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!isLoading && (error || productFaqs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia
                          variant="icon"
                          className="bg-white/5 text-[#D4C385]"
                        >
                          <Folder />
                        </EmptyMedia>
                        <EmptyTitle className="text-white">
                          No FAQs Found
                        </EmptyTitle>
                        <EmptyDescription>
                          {error?.message ||
                            "This product doesn't have any FAQs yet. Click 'Add FAQ' to create one."}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                productFaqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="font-medium text-[#D4C385] align-top w-[30%]">
                      {faq.title}
                    </TableCell>
                    <TableCell className="text-gray-400 align-top ">
                      {faq.description}
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          onClick={() => setIsUpdate(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <FAQFormModal
                          productId={productId}
                          faq_id={faq.id}
                          title={faq.title}
                          description={faq.description}
                          open={isUpdate}
                          setOpen={setIsUpdate}
                        />
                        <DeleteConfirmDialoag
                          onConfirm={() => handleDelete(faq.id)}
                          isLoading={isLoading}
                          title="Delete FAQ?"
                          description="This will permanently remove this question and answer."
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <FAQFormModal productId={productId} open={open} setOpen={setOpen} />
    </>
  );
};
export default ProductFAQManager;
