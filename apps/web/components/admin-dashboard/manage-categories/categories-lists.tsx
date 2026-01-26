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
import { Trash, Edit, Tag } from "lucide-react";
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
import { CategoryDataType } from "@/types/category-types";
import AddCategories from "./add-category";

function DeleteCategoryModal({ id }: { id: string }) {
  const handleDelete = async () => {
    try {
      await useDeleteOne("categories", id);
      toast.success("Category deleted successfully");
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
            This will permanently delete this category. This action cannot be
            undone.
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

export default function CategoryList() {
  const { data, isLoading, error } = useGetData<any>("categories");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDataType | null>(null);

  const handleEdit = (category: CategoryDataType) => {
    setSelectedCategory(category);
    setEditOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
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
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}

          {/* Empty/Error State */}
          {!isLoading && (error || !data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="h-60">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Tag />
                    </EmptyMedia>
                    <EmptyTitle>No Categories Found</EmptyTitle>
                    <EmptyDescription>
                      {error?.message ||
                        "Start by adding your first product category."}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}

          {data &&
            Array.isArray(data) &&
            data?.map((category: CategoryDataType) => (
              <TableRow
                key={category.id}
                className="border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="font-medium">
                  {category.category}
                </TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs text-secondary">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatTimestamp(category.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-white/10 hover:bg-white/5"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteCategoryModal id={category.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {selectedCategory && (
        <AddCategories
          open={editOpen}
          setOpen={setEditOpen}
          initialData={selectedCategory}
        />
      )}
    </>
  );
}
