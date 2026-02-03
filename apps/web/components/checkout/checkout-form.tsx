"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Truck, Package, Wallet, Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserStore } from "@/store/use-user-store";
import { OrderFormValues, orderSchema } from "@/schema/order.schema";
import { PhoneInput } from "../ui/phone-input";
import { Textarea } from "../ui/textarea";
import { useCartStore } from "@/store/use-cart-store";
import { createClient } from "@/lib/supabase/client";
import { PayPalModal } from "./paypal-modal";
import { PromoCodeTypes } from "@/types/product-types";
import { calculateOrderTotals } from "@/lib/cart-calculation";
import { bucket } from "@/services/upload.service";
import { Buckets } from "@/constant/constant";

const CheckoutForm = ({
  appliedPromo,
}: {
  appliedPromo: PromoCodeTypes | null;
}) => {
  const { user } = useUserStore();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [dbOrderId, setDbOrderId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: user?.email?.split("@")[0] || "",
      email: user?.email || "",
      phone: "",
      country: "Canada",
      city: "",
      area: "",
      zipcode: "",
      address: "",
      delivery_type: "standard_shipping",
      payment_method: "cod",
    },
  });
  useEffect(() => {
    if (user) {
      form.setValue("name", user?.email?.split("@")[0] || "");
      form.setValue("email", user?.email || "");
    }
  }, [user]);

  const { finalTotal, subtotal, productDiscountTotal } = calculateOrderTotals(
    items,
    appliedPromo,
  );
  console.log(items);
  async function onSubmit(values: OrderFormValues) {
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          full_name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          area: values.area,
          zipcode: values.zipcode,
          country: values.country,
          delivery_type: values.delivery_type,
          payment_method: values.payment_method,
          subtotal: subtotal,
          discount_amount: productDiscountTotal,
          shipping_fee: 0,
          total_amount: finalTotal,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order Insert Error:", orderError);
        throw new Error(orderError.message);
      }

      const orderItems = await Promise.all(
        items.map(async (item) => {
          const finalImageUrl = await bucket.uploadBase64OrReturnUrl(
            item.image,
            Buckets.PRODUCTS,
            "custom-orders",
          );
          return {
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
            image_url: finalImageUrl,
            name: item.name,
          };
        }),
      );

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Items Insert Error:", itemsError);
        throw new Error(itemsError.message);
      }
      if (values.payment_method === "paypal") {
        setDbOrderId(orderData.id);
        setShowPayPal(true);
      } else {
        router.push("/order-success/" + orderData.id);
        toast.success("Order placed successfully (COD)!");
        clearCart();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const handlePayPalSuccess = (orderId: string) => {
    toast.success("Payment successful!");
    clearCart();
    setShowPayPal(false);
    router.push("/order-success/" + orderId);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <div className="size-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                1
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Delivery Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="custom_input_fields"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">Phone</FormLabel>
                    <FormControl>
                      <PhoneInput placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
                        {...field}
                        className="custom_input_fields"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Canada"
                        {...field}
                        className="custom_input_fields"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Toronto"
                        {...field}
                        className="custom_input_fields"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">Area</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mississauga"
                        {...field}
                        className="custom_input_fields"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="M5V 1A8"
                        {...field}
                        className="custom_input_fields"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60">
                    Street Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Luxury Lane"
                      {...field}
                      className="custom_input_fields !h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <div className="size-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                2
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Shipping Method
              </h2>
            </div>

            <FormField
              control={form.control}
              name="delivery_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="standard_shipping"
                            className="sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${field.value === "standard_shipping" ? "border-secondary bg-secondary/5" : "border-white/5 bg-white/5"}`}
                        >
                          <div className="flex items-center gap-3">
                            <Truck
                              className={
                                field.value === "standard_shipping"
                                  ? "text-secondary"
                                  : "text-white/40"
                              }
                            />
                            <div>
                              <p className="font-bold">Standard Shipping</p>
                              <p className="text-xs mt-1 text-white/40">
                                3-5 Business Days
                              </p>
                            </div>
                          </div>
                          {/* <span className="font-bold text-secondary">$30.00</span> */}
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="pickup" className="sr-only" />
                        </FormControl>
                        <FormLabel
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${field.value === "pickup" ? "border-secondary bg-secondary/5" : "border-white/5 bg-white/5"}`}
                        >
                          <div className="flex items-center gap-3">
                            <Package
                              className={
                                field.value === "pickup"
                                  ? "text-secondary"
                                  : "text-white/40"
                              }
                            />
                            <div>
                              <p className="font-bold">Local Pickup</p>
                              <p className="text-xs mt-1 text-white/40">
                                Available in 24h
                              </p>
                            </div>
                          </div>
                          {/* <span className="font-bold text-secondary">Free</span> */}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <div className="size-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                3
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Payment Method
              </h2>
            </div>

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="cod" className="sr-only" />
                        </FormControl>
                        <FormLabel
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${field.value === "cod" ? "border-secondary bg-secondary/5" : "border-white/5 bg-white/5"}`}
                        >
                          <Wallet
                            className={
                              field.value === "cod"
                                ? "text-secondary"
                                : "text-white/40"
                            }
                          />
                          <span className="font-bold">Cash On Delivery</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="paypal" className="sr-only" />
                        </FormControl>
                        <FormLabel
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${field.value === "paypal" ? "border-secondary bg-secondary/5" : "border-white/5 bg-white/5"}`}
                        >
                          <CreditCard
                            className={
                              field.value === "paypal"
                                ? "text-secondary"
                                : "text-white/40"
                            }
                          />
                          <span className="font-bold">PayPal</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              variant={"secondary"}
              className="w-1/2 font-semibold h-14  bg-secondary text-black hover:bg-secondary/80 rounded-xl transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Complete Purchase"
              )}
            </Button>
          </div>
        </form>
      </Form>
      {showPayPal && dbOrderId && (
        <PayPalModal
          orderId={dbOrderId}
          totalAmount={finalTotal}
          customerName={form.getValues("name")}
          customerEmail={form.getValues("email")}
          onClose={() => setShowPayPal(false)}
          onSuccess={handlePayPalSuccess}
          items={items}
          promo_code_discount={appliedPromo?.value ?? 0}
        />
      )}
    </>
  );
};
export default CheckoutForm;
