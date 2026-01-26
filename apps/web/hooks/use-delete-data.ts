import { mutation } from "@/services/mutation.service";
import { mutate } from "swr";

export async function useDeleteOne<T>(table: string, id: string) {
  const key = `admin-${table}`;
  return await mutate(
    key,
    async () => {
      await mutation.deleteOne(table, id);
    },
    {
      revalidate: true,
    },
  );
}
