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
import { formatTimestamp } from "@/lib/utils";
import { Folder } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ViewDetailsModal from "./view-details-modal";

export default function QueriesLists() {
  const { data, isLoading, error } = useGetData<any>("contacts");
  const [open, setOpen] = useState(false);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Message Snippest</TableHead>
          <TableHead>Date Sent</TableHead>
          <TableHead>Action</TableHead>
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
                  <EmptyTitle>No! Queries Found</EmptyTitle>
                  <EmptyDescription>
                    {error?.message || "No Queries on this platform yet."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        )}

        {data &&
          data?.length > 0 &&
          data?.map((query) => (
            <TableRow key={query?.id}>
              <TableCell>{query.name}</TableCell>

              <TableCell>{query.email}</TableCell>

              <TableCell className="max-w-md truncate">
                {query?.message}
              </TableCell>
              <TableCell>{formatTimestamp(query.created_at)}</TableCell>
              <TableCell>
                <div>
                  <Button
                    onClick={() => setOpen(true)}
                    variant={"secondary"}
                    size={"sm"}
                  >
                    View
                  </Button>
                  <ViewDetailsModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    query={query}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
