"use client";

import { useCartStore } from "@/store/use-cart-store";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CheckoutForm from "./checkout-form";
import { OrderAmount } from "./order-amount";
import { PromoCodeTypes } from "@/types/product-types";

export default function CheckoutCom() {
  const { items } = useCartStore();
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeTypes | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
          <ShoppingBag size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">
            Your cart is empty
          </h1>
          <p className="text-white/40 max-w-xs mx-auto">
            Add some luxury items to your cart before checking out.
          </p>
        </div>
        <Link href="/shop">
          <button className="bg-secondary text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
            Return to Shop
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-12">
        <Link
          href="/cart"
          className="flex items-center gap-2 text-white/40 hover:text-secondary transition-colors mb-4 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Cart
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold ">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start mb-12">
        <div className="w-full lg:w-[65%] order-2 lg:order-1">
          <CheckoutForm appliedPromo={appliedPromo} />
        </div>

        <div className="w-full lg:w-[35%] order-1 lg:order-2">
          <OrderAmount
            appliedPromo={appliedPromo}
            setAppliedPromo={setAppliedPromo}
          />
        </div>
      </div>
    </>
  );
}
