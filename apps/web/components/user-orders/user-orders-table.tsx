"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  CreditCard,
  Eye,
  Loader2,
  PackageSearch,
  ArrowRight,
} from "lucide-react";
import { useUserStore } from "@/store/use-user-store";
import { createClient } from "@/lib/supabase/client";
import { PayPalModal } from "../checkout/paypal-modal";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { OrderTypes } from "@/types/order-types";
import { CartItem } from "@/store/use-cart-store";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

const UserOrdersTable = () => {
  const { user } = useUserStore();
  const supabase = createClient();

  const [orders, setOrders] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<OrderTypes | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [isFetchingItems, setIsFetchingItems] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error) {
      setOrders(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [user?.id, currentPage, supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePayNow = async (order: OrderTypes) => {
    setIsFetchingItems(true);
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      if (error) throw error;

      const formattedItems: CartItem[] = data.map((item: any) => ({
        id: item.product_id,
        name: item.name || "Product",
        price: item.price_at_purchase,
        quantity: item.quantity,
        discounted_price: item.discounted_price,
        image: item.image_url || "",
      }));

      setOrderItems(formattedItems);
      setSelectedOrder(order);
    } catch (error) {
      console.error("Fetch items error:", error);
      toast.error("Failed to load order items for payment.");
    } finally {
      setIsFetchingItems(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const renderPaginationItems = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i} className="cursor-pointer">
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
            className={
              currentPage === i
                ? "bg-secondary text-black hover:bg-secondary/90 border-none"
                : "text-white hover:bg-white/10"
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return pages;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="size-10 text-secondary animate-spin" />
        <p className="text-white/40 font-medium tracking-wide">
          Syncing your orders...
        </p>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center py-10 w-full">
        <Empty className="bg-white/[0.02] border border-white/5 p-12 rounded-[2.5rem] max-w-lg text-center backdrop-blur-sm">
          <EmptyHeader className="flex flex-col items-center">
            <EmptyMedia
              variant="icon"
              className="bg-secondary/10 p-6 rounded-full border border-secondary/20 mb-2"
            >
              <PackageSearch
                size={44}
                className="text-secondary animate-pulse"
              />
            </EmptyMedia>
            <EmptyTitle className="text-3xl font-bold mt-4 text-white">
              No Orders Yet
            </EmptyTitle>
            <EmptyDescription className="text-white/40 max-w-xs mx-auto leading-relaxed mt-2">
              Your order history is empty. Once you make a purchase, your order
              details and tracking will appear right here.
            </EmptyDescription>
          </EmptyHeader>
          <div className="mt-8">
            <Link href="/shop">
              <Button className="bg-secondary text-black font-bold px-10 py-6 rounded-2xl hover:bg-secondary/90 transition-all hover:scale-105 group">
                Browse Products
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-md bg-white/[0.02] border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60 font-bold uppercase text-[11px] tracking-widest pl-6">
                ID
              </TableHead>
              <TableHead className="text-white/60 font-bold uppercase text-[11px] tracking-widest">
                Date
              </TableHead>
              <TableHead className="text-white/60 font-bold uppercase text-[11px] tracking-widest text-center">
                Status
              </TableHead>
              <TableHead className="text-white/60 font-bold uppercase text-[11px] tracking-widest text-right">
                Amount
              </TableHead>
              <TableHead className="text-white/60 font-bold uppercase text-[11px] tracking-widest text-right pr-6">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const isUnpaidPayPal =
                order.payment_method === "paypal" &&
                order.payment_status === "pending";

              return (
                <TableRow
                  key={order.id}
                  className="border-white/5 hover:bg-white/[0.03] transition-colors group"
                >
                  <TableCell className="font-mono text-xs text-secondary pl-6">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-white/80 font-medium">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        order.payment_status === "paid"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-white pr-4">
                    ${order.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-3">
                      {isUnpaidPayPal ? (
                        <Button
                          size="sm"
                          disabled={isFetchingItems}
                          className="bg-secondary text-black font-extrabold hover:bg-secondary/80 gap-2 px-4 shadow-lg shadow-secondary/10 h-8 text-xs rounded-lg transition-all active:scale-95"
                          onClick={() => handlePayNow(order)}
                        >
                          {isFetchingItems ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <CreditCard className="size-3" />
                          )}
                          Pay Now
                        </Button>
                      ) : (
                        <Link href={`/order-success/${order.id}`}>
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8 border-white/10 hover:bg-white/10 rounded-lg group"
                          >
                            <Eye className="size-4 text-white group-hover:scale-110 transition-transform" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                className={`text-white hover:bg-white/10 cursor-pointer ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                className={`text-white hover:bg-white/10 cursor-pointer ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {selectedOrder && (
        <PayPalModal
          orderId={selectedOrder.id as string}
          totalAmount={selectedOrder.total_amount}
          customerName={selectedOrder.full_name}
          customerEmail={selectedOrder.email}
          onClose={() => {
            setSelectedOrder(null);
            setOrderItems([]);
          }}
          onSuccess={() => {
            setSelectedOrder(null);
            setOrderItems([]);
            fetchOrders();
          }}
          items={orderItems}
        />
      )}
    </div>
  );
};

export default UserOrdersTable;
