"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatTimestamp } from "@/lib/utils";
import { TicketPercent, CheckCircle2, XCircle } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { PromoCodeDialog } from "./promo-code-dialog";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmDialoag from "@/components/ui/delete-confirm-dialog";
import { useDeleteOne } from "@/hooks/use-delete-data";
import { toast } from "sonner";

export default function PromoCodeList() {
  const { data, isLoading, error } = useGetData<any>("promo_codes");

  const handleDelete = async (id: string) => {
    try {
      await useDeleteOne("promo_codes", id.toString());
      toast.success("Promo code deleted successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Validity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Loading State */}
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell>
                    <Skeleton className="h-4 w-24 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 bg-white/5" />
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-20 bg-white/5" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}

          {/* Empty/Error State */}
          {!isLoading && (error || !data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="h-60">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <TicketPercent className="text-[#e2d492]" />
                    </EmptyMedia>
                    <EmptyTitle>No Promo Codes</EmptyTitle>
                    <EmptyDescription>
                      {error?.message ||
                        "Create your first discount code to boost sales."}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}

          {data &&
            Array.isArray(data) &&
            data.map((promo: any) => (
              <TableRow key={promo.id}>
                <TableCell className="font-bold text-[#e2d492]">
                  {promo.code}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {promo.type === "percentage"
                      ? `${promo.value}% Off`
                      : `Rs. ${promo.value} Off`}
                  </span>
                </TableCell>
                <TableCell>
                  {promo.is_active ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/10">
                      <XCircle className="mr-1 h-3 w-3" /> Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatTimestamp(promo.valid_from)} -{" "}
                  {formatTimestamp(promo.valid_until)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <PromoCodeDialog initialData={promo} />
                    <DeleteConfirmDialoag
                      onConfirm={() => handleDelete(promo.id)}
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. This will permanently delete the item."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
