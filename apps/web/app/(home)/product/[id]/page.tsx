import { Metadata } from "next";
import LayoutXLarge from "@/components/layout/layout-x-large";
import PublicLayout from "@/components/layout/public-layout";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductDetails from "@/components/product-details/product-deatils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("product_name, description, image_url")
    .eq("id", id)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.product_name} | Your Brand`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [productRes, faqRes] = await Promise.all([
    supabase
      .from("products")
      .select(
        `
        *,
        categories (
          category        )
      `,
      )
      .eq("id", id)
      .single(),
    supabase.from("product_faqs").select("*").eq("product_id", id),
  ]);

  if (!productRes.data) notFound();

  return (
    <PublicLayout>
      <LayoutXLarge className="min-h-screen mt-40">
        <ProductDetails
          initialProduct={productRes.data}
          initialFaqs={faqRes.data || []}
        />
      </LayoutXLarge>
    </PublicLayout>
  );
}
