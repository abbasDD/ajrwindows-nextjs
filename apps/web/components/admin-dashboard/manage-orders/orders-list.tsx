"use client";

import { useState, useMemo } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatTimestamp } from "@/lib/utils";
import { ShoppingBag, Eye } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function OrdersList() {
  const { data, isLoading, error } = useGetData<any>("orders");
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.length / itemsPerPage) : 0;
  }, [data, itemsPerPage]);

  const currentItems = useMemo(() => {
    if (!data) return [];
    const sliceStart = (currentPage - 1) * itemsPerPage;
    const sliceEnd = sliceStart + itemsPerPage;
    return data.slice(sliceStart, sliceEnd);
  }, [data, currentPage, itemsPerPage]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-none hover:bg-emerald-500/10">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-none hover:bg-amber-500/10">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}

            {!isLoading && (!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-[400px]">
                  <Empty className="mx-auto">
                    <EmptyHeader>
                      <EmptyMedia
                        variant="icon"
                        className="bg-primary/10 p-4 rounded-full"
                      >
                        <ShoppingBag className="text-primary" />
                      </EmptyMedia>
                      <EmptyTitle>No Orders Found</EmptyTitle>
                      <EmptyDescription>
                        {error?.message || "There are no orders processed yet."}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              currentItems.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-bold uppercase text-muted-foreground">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                  <TableCell className="font-semibold text-secondary">
                    ${order.total_amount?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatTimestamp(order.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        router.push(
                          "/admin/dashboard/manage-orders/" + order.id,
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8"
                    >
                      <Eye className="size-3" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 1 && data && data?.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, data?.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{data?.length}</span>{" "}
            orders
          </p>

          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page} className="hidden sm:inline-block">
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
