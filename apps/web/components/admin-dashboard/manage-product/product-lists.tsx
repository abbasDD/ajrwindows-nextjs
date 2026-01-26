"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Edit, Package } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { useGetData } from "@/hooks/use-get-data";
import { useDeleteOne } from "@/hooks/use-delete-data";
import { Buckets } from "@/constant/constant";
import { getPathFromPublicUrl } from "@/lib/utils";
import { bucket } from "@/services/upload.service";
import { CategoryDataType } from "@/types/category-types";
import { ProductDataType } from "@/types/product-types";
import DeleteConfirmDialoag from "@/components/ui/delete-confirm-dialog";
import { useRouter } from "next/navigation";
import ProductFAQManager from "./faq/product-faq-manager";

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-12 w-12 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-20 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
function EmptyState({ message }: { message?: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package className="h-10 w-10" />
        </EmptyMedia>
        <EmptyTitle>No Products Found</EmptyTitle>
        <EmptyDescription>
          {message ||
            "Try selecting a different category or add a new product."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
export default function ProductList() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: categories, isLoading: catLoading } =
    useGetData<CategoryDataType>("categories");
  const {
    data: products,
    isLoading: prodLoading,
    error,
  } = useGetData<ProductDataType>("products");
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeTab === "all") return products;
    return products.filter((p) => p.category_id === activeTab);
  }, [products, activeTab]);
  const isLoading = catLoading || prodLoading;

  const handleDelete = async (id: string, image_url: string) => {
    try {
      const path = getPathFromPublicUrl(image_url, Buckets.PRODUCTS);
      await useDeleteOne("products", id);
      if (path) await bucket.deleteFile(Buckets.PRODUCTS, path);
      toast.success("Product deleted successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4">
        {!isLoading && categories && (
          <Tabs
            defaultValue="all"
            onValueChange={setActiveTab}
            className="w-full "
          >
            <TabsList>
              <TabsTrigger value="all" className="px-6">
                All Products
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id.toString()}>
                  {cat.category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discounted</TableHead>
            <TableHead>Prodcut Faqs </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24">
                <EmptyState message={error?.message} />
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id} className="group">
                <TableCell>
                  <Image
                    src={product.image_url}
                    alt={product.product_name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover border aspect-square"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {product.product_name}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {product.usage}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant="outline"
                      className="w-fit text-[10px] uppercase"
                    >
                      {product.color}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell className="text-green-600 font-semibold">
                  ${product.discounted_price}
                </TableCell>
                <TableCell>
                  <div>
                    <ProductFAQManager productId={product.id as string} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-blue-600"
                      onClick={() =>
                        router.push(
                          `/admin/dashboard/manage-product/${product.id}`,
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmDialoag
                      onConfirm={() =>
                        handleDelete(product.id as any, product.image_url)
                      }
                      isLoading={isLoading}
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. This will permanently delete the item."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
