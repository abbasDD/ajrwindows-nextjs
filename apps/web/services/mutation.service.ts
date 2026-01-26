import { createClient } from "@/lib/supabase/client";

class MutationService {
  private static instance: MutationService;
  private supabase = createClient();

  public static getInstance(): MutationService {
    if (!MutationService.instance)
      MutationService.instance = new MutationService();
    return MutationService.instance;
  }
  // insert one
  async insertOne<T>(table: string, data: T): Promise<T> {
    const { data: response, error } = await this.supabase
      .from(table)
      .insert(data);
    if (error) throw error;
    return response as T;
  }
  // delete one
  async deleteOne<T>(table: string, id: string): Promise<T> {
    const { data: response, error } = await this.supabase
      .from(table)
      .delete()
      .match({ id });
    if (error) throw error;
    return response as T;
  }
  // update by id
  async updateById<T>(table: string, id: string, data: T): Promise<T> {
    const { data: response, error } = await this.supabase
      .from(table)
      .update(data)
      .match({ id });
    if (error) throw error;
    return response as T;
  }
}
export const mutation = MutationService.getInstance();
