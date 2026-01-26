"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import LayoutXSmall from "../layout/layout-x-small";
import { CategoryDataType } from "@/types/category-types";
import { ProductDataType } from "@/types/product-types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { PackageSearch } from "lucide-react";
import ProductCard from "../product-card";

const OurProducts = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const { data: categories, isLoading: catLoading } =
    useGetData<CategoryDataType>("categories");
  const {
    data: products,
    isLoading: prodLoading,
    error,
  } = useGetData<ProductDataType>("products");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeTab === "all") return products;
    return products.filter((p) => p.category_id === activeTab);
  }, [products, activeTab]);

  const isLoading = catLoading || prodLoading;

  return (
    <LayoutXSmall className="py-20 w-full">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
          Our Products
        </h1>
        <p className="max-w-4xl mx-auto text-base md:text-lg text-white/60 leading-relaxed">
          Get instant quotes, customize in real-time, and order directly from
          AJR
        </p>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full mb-6"
        onValueChange={setActiveTab}
      >
        <div className="flex justify-center mb-12">
          <TabsList
            className="inline-flex h-auto p-1 items-center justify-start
            md:justify-center overflow-x-auto overflow-y-hidden max-w-full  no-scrollbar border border-white/5"
          >
            <TabsTrigger
              value="all"
              className="cursor-pointer py-2.5 px-5 md:py-3 md:px-8 text-sm md:text-base transition-all whitespace-nowrap"
            >
              All
            </TabsTrigger>

            {catLoading
              ? [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 mx-1 bg-white/5" />
                ))
              : categories?.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="cursor-pointer py-2.5 px-5 md:py-3 md:px-8 text-sm md:text-base transition-all whitespace-nowrap"
                  >
                    {cat.category}
                  </TabsTrigger>
                ))}
          </TabsList>
        </div>
      </Tabs>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-2xl bg-white/5" />
                <Skeleton className="h-4 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-1/2 bg-white/5" />
              </div>
            ))
          : filteredProducts.length > 0 &&
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {!isLoading && filteredProducts.length === 0 && (
        <Empty className="my-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearch className="text-[#e2d492]" />
            </EmptyMedia>
            <EmptyTitle>No Product Found</EmptyTitle>
            <EmptyDescription>
              {error?.message ||
                "No products found in this category. Try another category."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <div className="flex justify-center mt-16">
        <Button
          variant="secondary"
          size="lg"
          className="px-10 py-6 text-lg font-semibold"
          onClick={() => router.push("/categories")}
        >
          Go to Shop
        </Button>
      </div>
    </LayoutXSmall>
  );
};

export default OurProducts;
