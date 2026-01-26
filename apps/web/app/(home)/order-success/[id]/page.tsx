import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PublicLayout from "@/components/layout/public-layout";
import LayoutXLarge from "@/components/layout/layout-x-large";
import ThankYouDetails from "@/components/order-success/thank-you-details";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Success #${id.slice(0, 8)} | Your Brand`,
    description: "Thank you for your purchase!",
  };
}

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          product_name,
          image_url
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !order) notFound();

  return (
    <PublicLayout>
      <LayoutXLarge className="min-h-screen mt-32 mb-20">
        <ThankYouDetails order={order} />
      </LayoutXLarge>
    </PublicLayout>
  );
}
