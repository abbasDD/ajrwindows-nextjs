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
import { RegisterAuthType, registerSchema } from "@/schema/auth.schema";
import { PhoneInput } from "../ui/phone-input";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterAuthType>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const supabase = createClient();

  const handleSubmit = async (values: RegisterAuthType) => {
    setLoading(true);
    const toastId = toast.loading("Please wait ...");
    try {
      const { data: alreadyExists, error: rpcError } = await supabase.rpc(
        "check_if_email_exists",
        { email_input: values.email },
      );
      if (rpcError) throw new Error("Connection error while checking email.");
      if (alreadyExists) {
        throw new Error("Email already exists in our system.");
      }
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            phone: values.phone,
          },
        },
      });
      if (error) throw new Error(error.message);
      form.reset();
      toast.success("Success!", {
        description: (
          <p className="italic">
            🎉 Congratulations! Your registration was successful.
          </p>
        ),
      });
    } catch (e: any) {
      console.log(e);
      const errorMessage = e.message || "An unexpected error occurred.";
      toast.error("Failed to register", {
        className: "!text-red-500",
        description: (
          <p className="text-sm text-red-400 italic">{errorMessage}</p>
        ),
      });
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h1 className="text-xl md:text-2xl xl:text-3xl pb-8 font-semibold">
          Register
        </h1>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-base text-white/80">
                USERNAME
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  {...field}
                  className="mt-1 py-8 px-6 border-b border-b-white/30 outline-none text-base! rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  className="mt-1 py-8 px-6 border-b border-b-white/30 outline-none text-base! rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-base text-white/80">
                PHONE
              </FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter your phone"
                  {...field}
                  className="text-xl!"
                  defaultCountry="CA"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 w-full max-sm:flex-col">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sm:text-base text-white/80">
                  PASSWORD
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="Password"
                      {...field}
                      className="mt-1 py-8 px-4 pr-12 border-b border-b-white/30 outline-none text-base! rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary w-full"
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sm:text-base text-white/80">
                  CONFIRM PASSWORD
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="Confirm Password"
                      {...field}
                      className="mt-1 py-8 px-4 pr-12 border-b border-b-white/30 outline-none text-base! rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary w-full"
                      type={showConfirmPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-secondary transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={24} />
                      ) : (
                        <Eye size={24} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          variant={"secondary"}
          className="w-full py-6 text-lg"
          size={"lg"}
          disabled={loading}
          type="submit"
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
