import { createClient } from "@/lib/supabase/client";

class QueryService {
  private static instance: QueryService;
  private supabase = createClient();

  public static getInstance(): QueryService {
    if (!QueryService.instance) QueryService.instance = new QueryService();
    return QueryService.instance;
  }

  async getAll<T>(table: string): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as T[];
  }
  // get data by id
  async getById<T>(table: string, id: string): Promise<T> {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as T;
  }
  // get data by query
  async getByQuery<T>(
    table: string,
    column: string,
    value: string | number,
  ): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .eq(column, value);
    if (error) throw error;
    return data as T[];
  }
  // Inside your QueryService class
  async getCount(
    table: string,
    column?: string,
    value?: string | number,
  ): Promise<number> {
    let queryBuilder = this.supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    if (column && value !== undefined) {
      queryBuilder = queryBuilder.eq(column, value);
    }
    const { count, error } = await queryBuilder;
    if (error) throw error;
    return count || 0;
  }
}

export const query = QueryService.getInstance();
