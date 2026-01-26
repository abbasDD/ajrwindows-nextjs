"use client";

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
import { ShoppingBag, Eye } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function OrdersList() {
  const { data, isLoading, error } = useGetData<any>("orders");
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
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
              {[1, 2, 3, 4, 5].map((i) => (
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

          {!isLoading && (error || !data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty className="py-10">
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

          {data?.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs font-bold uppercase">
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
              <TableCell className="font-semibold">
                ${order.total_amount?.toFixed(2)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatTimestamp(order.created_at)}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    router.push("/admin/dashboard/manage-orders/" + order.id)
                  }
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  <Eye className="size-3" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
