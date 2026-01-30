"use client";

import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/use-user-store";
import { useEffect } from "react";

export default function AuthInitializer() {
  const supabase = createClient();
  const { setUser } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return null;
}
