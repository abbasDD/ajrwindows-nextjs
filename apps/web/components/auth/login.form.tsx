"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/auth.schema";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginForm = ({
  handleChangeType,
  setOpen,
}: {
  handleChangeType: (type: any) => void;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    const loadingId = toast.loading("Please wait for a moment...");
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (authError || !authData.user) {
        toast.dismiss(loadingId);
        throw new Error(authError?.message || "Invalid credentials");
      }
      const userId = authData.user.id;
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      form.reset();
      toast.success("Login successful");
      toast.dismiss(loadingId);
      setOpen(false);

      if (profile && profile?.role === "admin") {
        toast.dismiss(loadingId);
        return router.push("/admin/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", {
        className: "!text-red-500",
      });
    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h1 className="text-xl md:text-2xl xl:text-3xl pb-8 font-semibold">
          Login
        </h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-base text-white/80">
                EMAIL
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="mt-1 py-8 px-6 border-b border-b-white/30 outline-none text-base!
                  rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-base text-white/80">
                PASSWORD
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  className="mt-1 py-8 px-6 border-b border-b-white/30 outline-none text-base!
                  rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          onClick={() => handleChangeType("forgot-password")}
          className="text-secondary -mt-4 px-0 text-base"
          variant={"link"}
          type="button"
        >
          Forgot your password?
        </Button>
        <Button
          variant={"secondary"}
          className="w-full py-6 text-lg"
          size={"lg"}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
