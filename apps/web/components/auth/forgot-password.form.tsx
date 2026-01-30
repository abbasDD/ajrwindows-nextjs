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
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const ForgotPasswordForm = ({
  handleChangeType,
}: {
  handleChangeType: (type: any) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        },
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset link sent! Check your email.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h1 className="text-xl md:text-2xl xl:text-3xl pb-2 font-semibold">
          Forgot Password
        </h1>
        <p className="text-base xl:text-lg text-white/80 pb-8">
          Enter your registered email to receive OTP.
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-white/80">EMAIL</FormLabel>
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

        <Button
          variant={"secondary"}
          className="w-full py-6 text-lg"
          size={"lg"}
          disabled={isLoading}
        >
          {isLoading && <LoaderCircle className="animate-spin" />}
          Reset Password
        </Button>

        <Button
          onClick={() => handleChangeType("login")}
          className="text-secondary text-base group"
          variant={"link"}
        >
          <ArrowLeft className="group-hover:-translate-x-1.5 transition-all ease-in-out" />
          Back
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
