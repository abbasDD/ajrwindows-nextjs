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
import { Badge } from "@/components/ui/badge";
import { useGetData } from "@/hooks/use-get-data";

export default function UsersLists() {
  const { data, isLoading, error } = useGetData<any>("user_profiles");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>User Type</TableHead>
          <TableHead>Created At</TableHead>
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
                  <EmptyTitle>No! Users Found</EmptyTitle>
                  <EmptyDescription>
                    {error?.message || "No users on this platform yet."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        )}

        {data &&
          data?.length > 0 &&
          data?.map((user) => (
            <TableRow key={user?.id}>
              <TableCell>{user.username}</TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell className="max-w-xs truncate">
                {user?.phone ?? "Unknown"}
              </TableCell>

              <TableCell className="max-w-xs truncate">
                <Badge variant={"secondary"}>{user.role}</Badge>
              </TableCell>
              <TableCell>{formatTimestamp(user.created_at)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
