"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDataById, useGetDataByQuery } from "@/hooks/use-get-data";
import { formatTimestamp } from "@/lib/utils";
import { Loader2, User, FileText, MapPin, Package } from "lucide-react";
import {
  DeliveryStatus,
  OrderTypes,
  PaymentMethod,
  Statues,
} from "@/types/order-types";
import Image from "next/image";
import { toast } from "sonner";
import { useUpdateById } from "@/hooks/use-update-data";

export default function OrderDetailsView({ orderId }: { orderId: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: order, isLoading: loadingOrder } = useGetDataById<OrderTypes>(
    "orders",
    orderId,
  );
  const { data: items, isLoading: loadingItems } = useGetDataByQuery<any>(
    "order_items",
    "order_id",
    orderId,
  );

  const handleStatusChange = async (newStatus: DeliveryStatus) => {
    setIsUpdating(true);
    try {
      const updatedFields = {
        status: newStatus,
        payment_status:
          newStatus === DeliveryStatus.DELIVERED
            ? Statues.PAID
            : order?.payment_status,
      };

      await useUpdateById("orders", updatedFields, orderId);
      toast.success(`Delievery status updated to ${newStatus}`);
      if (
        newStatus === DeliveryStatus.CANCELLED ||
        newStatus === DeliveryStatus.DELIVERED
      )
        window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loadingOrder || loadingItems) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-secondary" size={40} />
        <p className="text-white/40 font-medium tracking-wide">
          Retrieving order details...
        </p>
      </div>
    );
  }

  if (!order)
    return <div className="text-white text-center p-10">Order not found.</div>;

  const isCOD = order.payment_method === PaymentMethod.COD;
  const isFinalized =
    order.status === DeliveryStatus.DELIVERED ||
    order.status === DeliveryStatus.CANCELLED;

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <FileText className="text-secondary size-5" /> Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-white/[0.01]">
              <span className="text-white font-semibold">Delivery Status</span>
              {isCOD && !isFinalized ? (
                <Select
                  disabled={isUpdating}
                  onValueChange={(value) =>
                    handleStatusChange(value as DeliveryStatus)
                  }
                  defaultValue={order.status}
                >
                  <SelectTrigger className="w-[180px]  border-white/20">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="border-white/20 text-white">
                    <SelectItem value={DeliveryStatus.PENDING}>
                      Pending
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.PROCESSING}>
                      Processing
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.SHIPPED}>
                      Shipped
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.DELIVERED}>
                      Delivered
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.CANCELLED}>
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className="px-4 py-1 bg-white/5 text-white border-white/20">
                  {order.status?.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center text-sm px-1">
              <span className="text-white/80">Placement Date</span>
              <span className="text-white font-medium">
                {formatTimestamp(order.created_at as string)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm px-1">
              <span className="text-white/80">Payment Status</span>
              <Badge
                className={
                  order.payment_status === Statues.PAID
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }
              >
                {order.payment_status?.toUpperCase()}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm px-1">
              <span className="text-white/80">Payment Method</span>
              <Badge variant={"outline"}>
                {order.payment_method?.toUpperCase()}
              </Badge>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xl font-semibold">
                <span className="text-white">Total Revenue</span>
                <span className="text-secondary">
                  ${order.total_amount?.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <User className="text-secondary size-5" /> Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl border border-white/10 text-white/80">
                <User size={22} />
              </div>
              <div>
                <p className="text-base font-bold capitalize mb-1">
                  {order.full_name}
                </p>
                <p className="text-white/80 text-sm">{order.email}</p>
                <p className="text-white/80 text-sm">{order.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-white/5">
              <div className="p-3 rounded-xl border border-white/10 text-white/80">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-base font-bold  mb-1">
                  Shipping Destination
                </p>
                <p className="text-base text-white/80 leading-relaxed space-x-1">
                  {order.address}, {order.area} {order.city}, {order.zipcode}{" "}
                  {order.country}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Package className="text-secondary size-5" /> Items Purchased
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader className="bg-white/[0.01]">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 font-bold pl-6 py-4">
                Product Details
              </TableHead>
              <TableHead className="text-white/40 font-bold text-center">
                Quantity
              </TableHead>
              <TableHead className="text-white/40 font-bold text-right">
                Unit Price
              </TableHead>
              <TableHead className="text-white/40 font-bold text-right pr-6">
                Line Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item: any) => (
              <TableRow
                key={item.id}
                className="border-white/5 hover:bg-white/[0.02] transition-all"
              >
                <TableCell className="pl-6 py-5">
                  <div className="flex items-center gap-5">
                    <div className="relative size-16 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                      <Image
                        src={item?.image_url || "/placeholder.png"}
                        alt={item.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold text-base leading-none">
                        {item.name || "Product Name"}
                      </span>
                      <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest">
                        Ref: {item.product_id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-white font-black bg-white/5 px-4 py-1.5 rounded-lg border border-white/10">
                    {item.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-right text-white/60 font-medium">
                  ${item.price_at_purchase?.toFixed(2)}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <span className="text-secondary font-black text-lg">
                    ${(item.quantity * item.price_at_purchase).toFixed(2)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
