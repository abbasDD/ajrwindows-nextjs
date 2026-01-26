import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal/client";
import { createClient } from "@/lib/supabase/server";
import { DeliveryStatus, Statues } from "@/types/order-types";

interface PaymentData {
  orderID: string;
  name: string;
  email: string;
  amount: string;
}

async function capturePayPalOrder(orderID: string, accessToken: string) {
  try {
    console.log(`Capturing order ${orderID}`);

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal capture error:", errorData);
      throw new Error(errorData.message || "Failed to capture payment");
    }

    const data = await response.json();
    console.log("Capture response:", data);
    return data;
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: PaymentData = await req.json();

    if (!data.name || !data.email || !data.amount || !data.orderID) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const accessToken = await getPayPalAccessToken();

    const captureData = await capturePayPalOrder(data.orderID, accessToken);

    if (captureData.status !== "COMPLETED") {
      console.log(`Invalid capture status: ${captureData.status}`);
      return NextResponse.json(
        { error: `Payment capture failed with status: ${captureData.status}` },
        { status: 400 },
      );
    }

    const captureId =
      captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    if (!captureId) {
      return NextResponse.json(
        { error: "No capture ID found in PayPal response" },
        { status: 400 },
      );
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        status: DeliveryStatus.SHIPPED,
        payment_status: Statues.PAID,
        paypal_transaction_id: captureId,
      })
      .eq("paypal_order_id", data.orderID)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        {
          error:
            "Payment successful but order update failed. Please contact support.",
          orderID: data.orderID,
          captureId: captureId,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment captured successfully",
        orderID: data.orderID,
        orderId: updatedOrder.id,
        captureID: captureId,
        captureStatus: captureData.status,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
