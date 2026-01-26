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
import { ArrowLeft } from "lucide-react";

const ForgotPasswordForm = ({
  handleChangeType,
}: {
  handleChangeType: (type: any) => void;
}) => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });
  const handleSubmit = (values: { email: string }) => {};
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h1 className="text-xl sm:text-4xl pb-2 font-semibold">
          Forgot Password
        </h1>
        <p className="sm:text-xl text-white/80 pb-8">
          Enter your registered email to receive OTP.
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-xl text-white/80">EMAIL</FormLabel>
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
          className="w-full py-7 text-xl"
          size={"lg"}
        >
          Reset Password
        </Button>

        <Button
          onClick={() => handleChangeType("login")}
          className="text-secondary text-xl group"
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
