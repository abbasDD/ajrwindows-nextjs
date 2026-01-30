"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Instagram, Youtube, LoaderCircle } from "lucide-react";

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
  SocialFormValues,
  socialSchema,
} from "@/schema/admin-dashboard/frontend-schema";
import { useUpdateById } from "@/hooks/use-update-data";
import TikTokIcon from "@/components/tiktok-icon";

const SOCIAL_PLATFORMS = [
  {
    id: "facebook",
    label: "Facebook",
    icon: <Facebook className="w-4 h-4" />,
    placeholder: "https://facebook.com/yourpage",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: <Instagram className="w-4 h-4" />,
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: <Youtube className="w-4 h-4" />,
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: <TikTokIcon size={14} />,
    placeholder: "https://tiktok.com/@yourprofile",
  },
];

const SocialLinks = () => {
  const [loading, setLoading] = useState(false);
  const { data } = useGetData<any>("settings_social_links");

  const form = useForm<SocialFormValues>({
    resolver: zodResolver(socialSchema),
    mode: "onChange",
    defaultValues: {
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const savedLinks = data[0].links;
      form.reset(savedLinks);
    }
  }, [data]);

  const onSubmit = async (values: SocialFormValues) => {
    if (!data) return;
    setLoading(true);
    try {
      await useUpdateById(
        "settings_social_links",
        {
          links: values,
        },
        data?.[0]?.id as string,
      );
      toast.success("Social links updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SOCIAL_PLATFORMS.map((platform) => (
              <FormField
                key={platform.id}
                control={form.control}
                name={platform.id as keyof SocialFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {platform.icon}
                      {platform.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={platform.placeholder}
                        {...field}
                        className="bg-background border-white/10 focus:border-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="secondary"
            className="mt-4"
          >
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Save Social Links
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SocialLinks;
