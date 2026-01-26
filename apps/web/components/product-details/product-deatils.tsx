"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingBasket, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { ProductDataType } from "@/types/product-types";
import { useUserStore } from "@/store/use-user-store";
import { useGetDataByQuery } from "@/hooks/use-get-data";
import ProductCard from "../product-card";
import { Skeleton } from "../ui/skeleton";

interface ProdcutWithCategory extends ProductDataType {
  categories?: {
    category: string;
  };
}

const ProductDetails = ({
  initialProduct,
  initialFaqs,
}: {
  initialProduct: ProdcutWithCategory;
  initialFaqs: Record<string, string>[];
}) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { data, isLoading } = useGetDataByQuery<ProductDataType>(
    "products",
    "category_id",
    initialProduct.category_id,
  );
  const releatedProducts = data?.filter(
    (product) => (product?.id as string) !== initialProduct.id,
  );
  const addItem = useCartStore((state) => state.addItem);
  console.log(initialProduct.category_id);
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please login to your account to add items to the cart.",
        icon: <Lock className="h-4 w-4" />,
      });
      return;
    }

    addItem({
      id: initialProduct.id as string,
      name: initialProduct.product_name,
      price: initialProduct.price,
      discounted_price: initialProduct.discounted_price,
      image: initialProduct.image_url,
      quantity: 1,
    });

    toast.success(`${initialProduct.product_name} added to cart`);
  };

  const categoryName = initialProduct.categories?.category || "COLLECTION";

  return (
    <div className="px-6 py-12 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="group mb-8 text-white/40 hover:text-white p-0 hover:bg-transparent"
      >
        <ArrowLeft
          className="mr-2 group-hover:-translate-x-1 transition-transform"
          size={18}
        />
        Back to Collections
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="flex justify-center">
          <div className="w-full max-w-[400px] aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-[#0f0f11] relative shadow-2xl">
            <img
              src={initialProduct.image_url}
              alt={initialProduct.product_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Badge className="bg-secondary/20 text-secondary w-fit tracking-[0.2em] px-4 py-1.5 uppercase text-[10px] font-bold">
            {categoryName}
          </Badge>

          <h1 className="text-2xl lg:text-5xl font-bold text-white tracking-tighter leading-tight">
            {initialProduct.product_name}
          </h1>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-semibold text-secondary">
              $
              {initialProduct.discounted_price > 0
                ? initialProduct.discounted_price
                : initialProduct.price}
            </span>
            {initialProduct.discounted_price > 0 && (
              <span className="text-xl text-white/30 line-through">
                ${initialProduct.price}
              </span>
            )}
          </div>

          <p className="text-white/70 text-base leading-relaxed max-w-lg">
            {initialProduct.description}
          </p>

          <div className="flex gap-4 pt-4 max-sm:flex-col">
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              className="flex-1 h-14 rounded-xl font-bold hover:scale-[1.02] transition-transform"
            >
              <ShoppingBasket className="mr-2" size={20} /> Add to Cart
            </Button>
            {/* <Link href="/customdoor" className="flex-1"> */}
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Customize
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </div>
      {initialFaqs.length > 0 && (
        <div className="my-28 mx-auto max-w-4xl">
          <h3 className="text-xl font-medium mb-6 tracking-wide">FAQs</h3>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {initialFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id as string}
                className="border-white/5 bg-card rounded-xl px-6"
              >
                <AccordionTrigger className="text-white/80 text-base py-6 hover:no-underline hover:text-white transition-colors">
                  {faq.title}
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-[14px] leading-loose pb-6">
                  {faq.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
      {releatedProducts && releatedProducts?.length > 0 && (
        <div>
          <h1 className="text-xl font-medium mb-6 tracking-wide">
            Releated Products
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/4] w-full rounded-2xl bg-white/5" />
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                  </div>
                ))
              : releatedProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
