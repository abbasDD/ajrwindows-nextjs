"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, LoaderCircle } from "lucide-react";

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
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";
import {
  ContactFormValues,
  contactSchema,
} from "@/schema/admin-dashboard/frontend-schema";
import { useUpdateById } from "@/hooks/use-update-data";

const PersonalDetails = () => {
  const [loading, setLoading] = useState(false);
  const { data } = useGetData<any>("settings_contact_details");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const contact = data[0];
      form.reset({
        email: contact.email || "",
        phone: contact.phone || "",
      });
    }
  }, [data]);

  const onSubmit = async (values: ContactFormValues) => {
    if (!data) return;
    setLoading(true);
    try {
      await useUpdateById(
        "settings_contact_details",
        {
          email: values.email,
          phone: values.phone,
        },
        data?.[0]?.id as string,
      );
      toast.success("Contact details updated successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update contact details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl"
        >
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      {...field}
                      className="bg-background border-white/10 focus:border-white/50"
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
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 234 567 890"
                      {...field}
                      className="bg-background border-white/10 focus:border-white/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="secondary"
            className="px-8 font-semibold transition-all active:scale-95"
          >
            {loading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Details
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PersonalDetails;
