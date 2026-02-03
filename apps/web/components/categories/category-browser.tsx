"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { CategoryDataType } from "@/types/category-types";
import { ProductDataType } from "@/types/product-types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import {
  PackageSearch,
  ChevronDown,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "lucide-react";
import ProductCard from "../product-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

const CategoryBrowser = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"low" | "high">("low");
  const itemsPerPage = 8;

  const { data: categories, isLoading: catLoading } =
    useGetData<CategoryDataType>("categories");
  const { data: products, isLoading: prodLoading } =
    useGetData<ProductDataType>("products");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result =
      activeTab === "all"
        ? [...products]
        : products.filter((p) => p.category_id === activeTab);

    return result.sort((a, b) => {
      const priceA = a.discounted_price || a.price;
      const priceB = b.discounted_price || b.price;
      return sortOrder === "low" ? priceA - priceB : priceB - priceA;
    });
  }, [products, activeTab, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const isLoading = catLoading || prodLoading;

  return (
    <section className="w-full mt-6 bg-card/40 backdrop-blur-md rounded-3xl! p-6 sm:p-12 border border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-xl md:text-2xl  font-bold text-white tracking-tight">
            {activeTab === "all"
              ? "All Collections"
              : categories?.find((c) => c.id === activeTab)?.category}
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Showing {filteredProducts.length} items
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl gap-2"
            >
              {sortOrder === "low" ? (
                <ArrowDownNarrowWide size={16} />
              ) : (
                <ArrowUpNarrowWide size={16} />
              )}
              Sort by:{" "}
              {sortOrder === "low"
                ? "Price: Low to High"
                : "Price: High to Low"}
              <ChevronDown size={14} className="opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#1b1e32] border-white/10 text-white"
          >
            <DropdownMenuItem
              onClick={() => setSortOrder("low")}
              className="cursor-pointer"
            >
              💰 Price: Low → High
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortOrder("high")}
              className="cursor-pointer"
            >
              💎 Price: High → Low
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full mb-12"
        onValueChange={(val) => {
          setActiveTab(val);
          setCurrentPage(1);
        }}
      >
        <div className="flex justify-center">
          <TabsList className="h-auto flex justify-between items-center  bg-white/5 border border-white/10 overflow-x-auto">
            <TabsTrigger
              value="all"
              className="py-2.5 px-6 rounded-lg data-[state=active]:bg-primary"
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
                    className="py-2.5 px-6 rounded-lg data-[state=active]:bg-primary transition-all"
                  >
                    {cat.category}
                  </TabsTrigger>
                ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/4] w-full rounded-2xl bg-white/5" />
                <Skeleton className="h-4 w-3/4 bg-white/5" />
              </div>
            ))
          : paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {!isLoading && filteredProducts.length === 0 && (
        <div className="py-20 flex justify-center">
          <Empty className="bg-white/[0.02] border border-white/5 p-12 rounded-[2rem] max-w-lg">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="bg-primary/10 p-6 rounded-full"
              >
                <PackageSearch size={40} className="animate-pulse" />
              </EmptyMedia>
              <EmptyTitle className="text-2xl font-bold mt-4">
                No Items Found
              </EmptyTitle>
              <EmptyDescription className="text-white/40">
                We couldn't find any products in this category. Please try a
                different category or check back later!
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-16">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={`cursor-pointer ${currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-primary"}`}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page} className="hidden sm:block">
                    <PaginationLink
                      isActive={currentPage === page}
                      className="cursor-pointer data-[active=true]:bg-primary"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  className={`cursor-pointer ${currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-primary"}`}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
};

export default CategoryBrowser;
