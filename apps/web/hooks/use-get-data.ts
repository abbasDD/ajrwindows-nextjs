import useSWR, { SWRResponse } from "swr";
import { query } from "@/services/query.service";

export function useGetData<T>(table: string): SWRResponse<T[]> {
  return useSWR<T[]>(
    `admin-${table}`,
    async () => await query.getAll<T>(table),
  );
}

export function useGetDataById<T>(
  table: string,
  id: string | null,
): SWRResponse<T> {
  if (!id) return useSWR<T>(`admin-${table}`, null);
  return useSWR<T>(
    `admin-${table}-${id}`,
    async () => await query.getById<T>(table, id),
  );
}
export function useGetDataByQuery<T>(
  table: string,
  column: string,
  value: string | number,
): SWRResponse<T[]> {
  return useSWR<T[]>(
    `admin-${table}-${column}-${value}`,
    async () => await query.getByQuery<T>(table, column, value),
  );
}

export function useDashboardStats() {
  const { data: usersCount, isLoading: loadingUsers } = useSWR(
    "admin-count-users",
    () => query.getCount("users"),
  );
  const { data: activeOrders, isLoading: loadingActive } = useSWR(
    "admin-count-active-orders",
    () => query.getCount("orders", "payment_status", "pending"),
  );
  const { data: completedOrders, isLoading: loadingCompleted } = useSWR(
    "admin-count-completed-orders",
    () => query.getCount("orders", "payment_status", "paid"),
  );
  return {
    stats: {
      users: usersCount || 0,
      active: activeOrders || 0,
      completed: completedOrders || 0,
    },
    isLoading: loadingUsers || loadingActive || loadingCompleted,
  };
}
