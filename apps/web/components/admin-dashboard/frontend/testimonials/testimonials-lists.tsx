"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // ADD THIS
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatTimestamp, getPathFromPublicUrl } from "@/lib/utils";
import { Folder, StarIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useGetData } from "@/hooks/use-get-data";
import { TestimonialsFormValues } from "@/schema/admin-dashboard/frontend-schema";
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
import { Buckets } from "@/constant/constant";
import { bucket } from "@/services/upload.service";

interface TestimonialsData extends TestimonialsFormValues {
  id: string;
  avatar: string;
  created_at: string;
}

function DeleteAlertModal({
  id,
  image_url,
}: {
  id: string;
  image_url: string;
}) {
  const handleDelete = async () => {
    try {
      const path = getPathFromPublicUrl(image_url, Buckets.HOME_IMAGES);
      await useDeleteOne("home_testiomnials", id);
      if (path) await bucket.deleteFile(Buckets.HOME_IMAGES, path);
      toast.success("Testimonials deleted successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Testimonials</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this testimonials?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="text-red-100 bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function TestimonialsList() {
  const { data, isLoading, error } =
    useGetData<TestimonialsData>("home_testiomnials");

  return (
    <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="max-md:hidden">Message</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-12 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="max-md:hidden">
                    <Skeleton className="h-4 w-60" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
          {!isLoading && (error || data?.length === 0) && (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Folder />
                    </EmptyMedia>
                    <EmptyTitle>No! Testimonials Found</EmptyTitle>
                    <EmptyDescription>
                      {error?.message ||
                        "No testimonials found. Create a testimonials to get started."}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}

          {data &&
            data?.length > 0 &&
            data?.map((values) => (
              <TableRow key={values?.id}>
                <TableCell>
                  <Image
                    src={values?.avatar}
                    className="size-16 rounded-full object-cover"
                    alt="Test image"
                    width={200}
                    height={200}
                  />
                </TableCell>
                <TableCell>{values.name}</TableCell>
                <TableCell className="max-w-xs truncate max-md:hidden">
                  {values.message}{" "}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const isActive = index < values.rating;
                      return (
                        <StarIcon
                          key={index}
                          className={`h-4 w-4 ${
                            isActive
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>{formatTimestamp(values.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <DeleteAlertModal
                      id={values.id as string}
                      image_url={values.avatar}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />{" "}
    </ScrollArea>
  );
}
