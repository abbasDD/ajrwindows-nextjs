"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSessionError, setIsSessionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const code = searchParams.get("code");
  const urlError = searchParams.get("error");
  const urlErrorDescription = searchParams.get("error_description");

  useEffect(() => {
    if (urlError || urlErrorDescription) {
      setIsSessionError(true);
      setErrorMessage(urlErrorDescription || "The reset link is invalid.");
    }
  }, [urlError, urlErrorDescription]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true);
    try {
      if (!code) throw new Error("Verification code is missing.");
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (updateError) throw updateError;
      toast.success("Security updated successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Auth update error:", error);
      toast.error(error.message || "Session expired or invalid.");
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <Card className="max-w-md w-full border-none shadow-none mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-secondary mb-1">
          <KeyRound size={16} />
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">
            Secure Access
          </span>
        </div>
        <CardTitle className="text-2xl font-medium tracking-tight text-white">
          Update Password
        </CardTitle>
        <CardDescription className="text-sm text-white/50">
          Set a new password to regain access to your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {isSessionError ? (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center justify-center py-8 px-4 border border-white/10 bg-white/5 rounded-lg text-center">
              <AlertCircle className="text-red-400 mb-4" size={32} />
              <h3 className="text-white font-medium mb-2">Link Expired</h3>
              <p className="text-white/50 text-xs leading-relaxed max-w-[240px]">
                {errorMessage ||
                  "For security, reset links are one-time use and expire quickly."}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full text-xs font-bold uppercase tracking-wider h-12"
              onClick={() => router.push("/")} // Or wherever your forgot-password flow is
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Request New Link
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/40 text-[10px] font-semibold tracking-widest uppercase">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="custom_input_fields !py-6 !text-base pr-12"
                            placeholder="••••••••••••"
                            {...field}
                            value={field.value || ""}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/40 text-[10px] font-semibold tracking-widest uppercase">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="custom_input_fields !py-6 !text-base"
                          placeholder="••••••••••••"
                          {...field}
                          value={field.value || ""}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full text-sm font-semibold uppercase tracking-wider transition-all h-12"
                disabled={isLoading || !code}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Credentials"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
