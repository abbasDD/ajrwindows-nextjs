import { mutation } from "@/services/mutation.service";
import { mutate } from "swr";

export async function useUpdateById<T>(table: string, data: T, id: string) {
  const key = `admin-${table}`;
  return await mutate(
    key,
    async () => {
      await mutation.updateById(table, id, data);
    },
    {
      revalidate: true, // revalidate the data when the mutation is successful
    },
  );
}
