import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, items, promo_code_discount } = await req.json();

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Order ID and items are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const accessToken = await getPayPalAccessToken();

    const subtotal = Number(order.subtotal || 0);
    const discount = Math.abs(Number(order.discount_amount || 0));
    const shipping = Number(order.shipping_fee || 0);
    const totalDiscount = discount + (Number(promo_code_discount) || 0);
    const calculatedTotal = (subtotal - (totalDiscount + shipping)).toFixed(2);

    const orderRequest = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: "USD",
            value: calculatedTotal,
            breakdown: {
              item_total: { currency_code: "USD", value: subtotal.toFixed(2) },
              discount: {
                currency_code: "USD",
                value: totalDiscount.toFixed(2),
              },
              shipping: { currency_code: "USD", value: shipping.toFixed(2) },
            },
          },
          shipping: {
            name: {
              full_name: order.full_name,
            },
            address: {
              address_line_1: order.address,
              admin_area_2: order.city,
              admin_area_1: order.state || "",
              postal_code: order.zipcode,
              country_code: "US",
            },
          },
          items: items.map((item: any) => ({
            name: (item.name || "Product").substring(0, 127),
            unit_amount: {
              currency_code: "USD",
              value: Number(item.price).toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      application_context: {
        brand_name: "Your Store Name",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/failed`,
      },
    };

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal Error Details:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.details?.[0]?.description || "PayPal validation failed" },
        { status: 400 },
      );
    }

    await supabase
      .from("orders")
      .update({ paypal_order_id: data.id })
      .eq("id", orderId);

    return NextResponse.json({
      id: data.id,
      status: data.status,
    });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error during order creation" },
      { status: 500 },
    );
  }
}
