import { mutation } from "@/services/mutation.service";
import { mutate } from "swr";

export async function useInsertOne<T>(table: string, data: T) {
  const key = `admin-${table}`;
  return await mutate(
    key,
    async () => {
      await mutation.insertOne(table, data);
    },
    {
      revalidate: true,
    },
  );
}
