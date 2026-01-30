"use client";
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
import { formatTimestamp, getPathFromPublicUrl } from "@/lib/utils";
import { Folder } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useGetData } from "@/hooks/use-get-data";
import { SliderFormValues } from "@/schema/admin-dashboard/frontend-schema";
import { useDeleteOne } from "@/hooks/use-delete-data";
import { toast } from "sonner";
import { bucket } from "@/services/upload.service";
import { Buckets } from "@/constant/constant";
import DeleteConfirmDialoag from "@/components/ui/delete-confirm-dialog";

interface SliderData extends SliderFormValues {
  id: string;
  image_url: string;
  created_at: string;
}
export default function SliderList() {
  const { data, isLoading, error } = useGetData<SliderData>("hero_sliders");

  const handleDelete = async (id: string, image_url: string) => {
    try {
      const path = getPathFromPublicUrl(image_url, Buckets.HOME_IMAGES);
      await useDeleteOne("hero_sliders", id);
      if (path) await bucket.deleteFile(Buckets.HOME_IMAGES, path);
      toast.success("Slider deleted successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="max-lg:hidden">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="max-md:hidden">Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell className="max-lg:hidden">
                  <Skeleton className="h-12 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
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
            <TableCell colSpan={7}>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Folder />
                  </EmptyMedia>
                  <EmptyTitle>No! Sliders Found</EmptyTitle>
                  <EmptyDescription>
                    {error?.message ||
                      "No sliders found. Create a slider to get started."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        )}

        {data &&
          data?.length > 0 &&
          data?.map((slider) => (
            <TableRow key={slider?.id}>
              <TableCell className="max-lg:hidden">
                <Image
                  src={slider?.image_url}
                  className="h-12 w-20 object-cover rounded"
                  alt="slider image"
                  width={200}
                  height={200}
                />
              </TableCell>

              <TableCell className="truncate">{slider.title}</TableCell>

              <TableCell className="max-w-xs max-md:hidden truncate">
                {slider.description}
              </TableCell>

              <TableCell className="max-w-xs truncate">
                <Badge variant={slider.active ? "secondary" : "destructive"}>
                  {slider.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{formatTimestamp(slider.created_at)}</TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <DeleteConfirmDialoag
                    onConfirm={() => handleDelete(slider.id, slider.image_url)}
                    isLoading={isLoading}
                    title="Are you absolutely sure?"
                    description="This action cannot be undone. This will permanently delete the item."
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
