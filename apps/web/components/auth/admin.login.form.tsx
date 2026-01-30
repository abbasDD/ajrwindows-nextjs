"use client";
import { useForm } from "react-hook-form";
import Image from "next/image";
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
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminLoginForm = () => {
  const [loading, setLoading] = useState(false);
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
  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);

    const loadingId = toast.loading("Please wait");

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
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut();
        toast.dismiss(loadingId);
        throw new Error(profileError?.message || "Invalid credentials");
      }

      toast.dismiss(loadingId);
      toast.success("Login successful");
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.dismiss(loadingId);
      toast.error(err.message || "Something went wrong", {
        className: "!text-red-500",
      });
    } finally {
      form.reset();
      setLoading(false);
    }
  };
  return (
    <div className="w-full px-8 h-full flex flex-col items-center justify-center gap-6">
      <Image src="/logo.png" alt="logo" width={100} height={100} />
      <h2 className="text-2xl">Admin Log In</h2>
      <p>Welcome back! Please enter your details.</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-[70%] mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-white/80">EMAIL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="mt-1 py-8 px-6 border-b border-b-white/30 outline-none text-xl!
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
                <FormLabel className="text-lg text-white/80">
                  PASSWORD
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    className="mt-1 py-8 px-6 border-b border-b-white/30 outline-none text-xl!
                  rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant={"secondary"}
            className="w-full py-7 text-xl"
            disabled={loading}
            size={"lg"}
          >
            {loading && <LoaderCircle />}
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminLoginForm;
