"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Package, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ThankYouDetailsProps {
  order: any;
}

const ThankYouDetails = ({ order }: ThankYouDetailsProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="size-16 text-secondary animate-in zoom-in duration-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Thank you for your purchase!
        </h1>
        <p className="text-muted-foreground text-lg">
          Your order{" "}
          <span className="text-secondary font-mono">
            #{order.id.slice(0, 8)}
          </span>{" "}
          has been placed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Truck className="size-4 text-secondary" />
            <CardTitle className="text-xs uppercase tracking-wider">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium capitalize">{order.status}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <CreditCard className="size-4 text-secondary" />
            <CardTitle className="text-xs uppercase tracking-wider">
              Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium uppercase">{order.payment_method}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Package className="size-4 text-secondary" />
            <CardTitle className="text-xs uppercase tracking-wider">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.order_items.length} Items</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative size-16 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={item.products?.image_url}
                      alt={item.products?.product_name}
                      className="object-cover size-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {item.products?.product_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-white">
                  ${(item.price_at_purchase * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-white">${order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2">
              <span className="text-white">Total Amount</span>
              <span className="text-secondary">
                ${order.total_amount?.toFixed(2)} CAD
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link href="/categories" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 text-white"
          >
            Continue Shopping
          </Button>
        </Link>
        <Link href="/user-orders" className="w-full sm:w-auto">
          <Button variant={"secondary"} className="w-full  font-bold">
            View All Orders
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYouDetails;
