"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { CartItem } from "@/store/use-cart-store";

interface PayPalModalProps {
  orderId: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  onSuccess: (orderId: string) => void;
  onClose: () => void;
  items: CartItem[];
  promo_code_discount?: number;
}
const ButtonWrapper = ({ showSpinner, ...props }: any) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <div className="relative min-h-[150px] w-full flex flex-col items-center justify-center">
      {isPending && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#121212] z-10">
          <Loader2 className="size-8 text-amber-400 animate-spin" />
          <p className="text-white/40 text-xs font-medium tracking-widest uppercase">
            Initializing PayPal...
          </p>
        </div>
      )}
      <PayPalButtons {...props} />
    </div>
  );
};
export const PayPalModal = ({
  orderId,
  totalAmount,
  customerName,
  customerEmail,
  onSuccess,
  onClose,
  items,
  promo_code_discount,
}: PayPalModalProps) => {
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-white/10 w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white"
          disabled={isVerifying}
        >
          <X />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-2">Final Step</h3>
          <p className="text-white/60 text-sm">
            Please complete the payment of{" "}
            <span className="font-bold text-white">
              ${totalAmount.toFixed(2)}
            </span>
          </p>
        </div>

        {isVerifying ? (
          <div className="flex flex-col items-center py-10 gap-4">
            <Loader2 className="size-10 text-secondary animate-spin" />
            <p className="text-white/60 animate-pulse">Verifying payment...</p>
          </div>
        ) : (
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
              currency: "USD",
              intent: "capture",
              disableFunding: "credit,card",
            }}
          >
            <ButtonWrapper
              style={{ layout: "vertical", shape: "rect", color: "gold" }}
              createOrder={async () => {
                try {
                  const response = await fetch("/api/paypal/create-order", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      orderId: orderId,
                      totalAmount: totalAmount,
                      items: items,
                      promo_code_discount: promo_code_discount || 0,
                    }),
                  });

                  const result = await response.json();

                  if (!response.ok) {
                    throw new Error(
                      result.error || "Failed to create PayPal order",
                    );
                  }

                  return result.id;
                } catch (error: any) {
                  console.error("Create PayPal order error:", error);
                  toast.error(error.message || "Failed to create PayPal order");
                  throw error;
                }
              }}
              onApprove={async (data: any) => {
                setIsVerifying(true);
                try {
                  const response = await fetch("/api/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      orderID: data.orderID,
                      name: customerName,
                      email: customerEmail,
                      amount: totalAmount.toString(),
                    }),
                  });

                  const result = await response.json();

                  if (result.success) {
                    onSuccess(result.orderId);
                  } else {
                    toast.error(result.error || "Payment verification failed");
                    setIsVerifying(false);
                  }
                } catch (err: any) {
                  console.error("Payment verification error:", err);
                  toast.error(
                    err.message || "An error occurred during verification",
                  );
                  setIsVerifying(false);
                }
              }}
              onError={(err: any) => {
                console.error("PayPal SDK Error:", err);
                toast.error("PayPal window failed to load.");
              }}
              onCancel={() => {
                toast.info("Payment cancelled");
              }}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
};
