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
import { mutation } from "@/services/mutation.service";

interface RegisterFormProps {
  handleChangeType: (type: any) => void;
}
const RegisterForm = ({ handleChangeType }: RegisterFormProps) => {
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RegisterAuthType) => {
    setLoading(true);
    const toastId = toast.loading("Please wait ...");
    try {
      const { data: user, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      console.log(user);
      if (error) {
        toast.dismiss(toastId);
        throw new Error(error.message);
      }
      const data = {
        id: user?.user?.id,
        username: values.username,
        phone: values.phone,
        role: "user",
      };
      await mutation.insertOne("users", data);
      form.reset();
      toast.dismiss(toastId);
      toast.success("Register successful", {
        description: (
          <p className="italic">
            Please check your email for verification link
          </p>
        ),
      });
    } catch (e) {
      console.log(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h1 className="text-xl sm:text-4xl pb-8 font-semibold">Register</h1>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-xl text-white/80">
                USERNAME
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  {...field}
                  className="mt-1 py-8 px-6 border-b border-b-white/30 outline-none text-xl!
                  rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-xl text-white/80">PHONE</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter your email"
                  {...field}
                  className="text-xl!"
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
                <FormLabel className="sm:text-xl text-white/80">
                  PASSWORD
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    {...field}
                    className=" mt-1 py-8 px-4 border-b border-b-white/30 outline-none text-xl!
                  rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
                    type="password"
                  />
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
                <FormLabel className="sm:text-xl text-white/80">
                  CONFIRM PASSWORD
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    {...field}
                    className=" mt-1 py-8 px-4 border-b border-b-white/30 outline-none text-xl!
                  rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          variant={"secondary"}
          className="w-full py-7 text-xl"
          size={"lg"}
          disabled={loading}
        >
          Register
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
