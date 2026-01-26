"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatTimestamp } from "@/lib/utils";
import { Trash, Edit, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteOne } from "@/hooks/use-delete-data";
import { toast } from "sonner";
import AddProductType from "./add-product-type";

function DeleteProductTypeModal({ id }: { id: string }) {
  const handleDelete = async () => {
    try {
      await useDeleteOne("product_types", id);
      toast.success("Product type deleted successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="h-8 w-8">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this product type. Associated products
            may be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ProductTypeList() {
  const { data, isLoading, error } = useGetData<any>("product_types");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead>Product Type</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Loading State */}
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}

          {/* Empty State */}
          {!isLoading && (!data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="h-60">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Layers />
                    </EmptyMedia>
                    <EmptyTitle>No Product Types Found</EmptyTitle>
                    <EmptyDescription>
                      {error?.message ||
                        "Add a product type to organize your inventory."}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}

          {/* Data List */}
          {data &&
            Array.isArray(data) &&
            data.map((item) => (
              <TableRow
                key={item.id}
                className="border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs text-secondary">
                    {item.slug}
                  </code>
                </TableCell>
                <TableCell>
                  {/* Displaying the category ID or name if joined */}
                  <span className="text-xs text-muted-foreground truncate max-w-[100px] block">
                    {item.category_id}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatTimestamp(item.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-white/10 hover:bg-white/5"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteProductTypeModal id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {selectedItem && (
        <AddProductType
          open={editOpen}
          setOpen={setEditOpen}
          initialData={selectedItem}
        />
      )}
    </>
  );
}
export default ProductTypeList;
