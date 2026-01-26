"use client";

import { useCartStore } from "@/store/use-cart-store";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { calculateOrderTotals } from "@/lib/cart-calculation";
import { createClient } from "@/lib/supabase/client";
import { PromoCodeTypes } from "@/types/product-types";

interface OrderAmountProps {
  appliedPromo: PromoCodeTypes | null;
  setAppliedPromo: (promo: PromoCodeTypes) => void;
}
export const OrderAmount = ({
  appliedPromo,
  setAppliedPromo,
}: OrderAmountProps) => {
  const { items } = useCartStore();
  const [promo, setPromo] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const { finalTotal, subtotal, promoDiscountAmount, productDiscountTotal } =
    calculateOrderTotals(items, appliedPromo);

  const handleApplyPromo = async () => {
    if (!promo) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promo.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast.error("Invalid or inactive promo code");
        return;
      }
      const now = new Date();
      if (data.valid_until && new Date(data.valid_until) < now) {
        toast.error("This promo code has expired");
        return;
      }

      if (subtotal < data.min_order_amount) {
        toast.error(`Minimum order for this code is $${data.min_order_amount}`);
        return;
      }

      setAppliedPromo(data);
      toast.success("Promo code applied!");
    } catch (err) {
      toast.error("Error applying promo code");
    } finally {
      setLoading(false);
      setPromo("");
    }
  };

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-xl font-bold mb-6 tracking-tight">Order Summary</h3>
        <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 relative">
              <div className=" size-16 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <span className="absolute  -right-1 size-5 bg-secondary text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p
                  className={`text-xs text-white/40 ${item.discounted_price && "line-through"}`}
                >
                  ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
            <Input
              placeholder="Promo code"
              className="custom_input_fields pl-10"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5"
            onClick={handleApplyPromo}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Applying..." : "Apply"}
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-white/60">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedPromo && (
            <div className="flex justify-between text-secondary font-medium animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-1">
                <span>Promo Discount</span>
                <span className="text-[10px] bg-secondary/20 px-1.5 py-0.5 rounded text-secondary uppercase">
                  {appliedPromo.code}
                </span>
              </div>
              <span>
                -
                {appliedPromo.type === "percentage"
                  ? `${appliedPromo.value}%`
                  : `$${appliedPromo.value}`}
                {` (-$${promoDiscountAmount.toFixed(2)})`}
              </span>
            </div>
          )}

          <Separator className="bg-white/5 my-4" />
          {productDiscountTotal > 0 && (
            <div className="flex justify-between text-xs font-bold text-white/50">
              <span>Total Discount</span>
              <span className="text-secondary">
                ${productDiscountTotal.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-white">
            <span>Total Amount</span>
            <span className="text-secondary">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
