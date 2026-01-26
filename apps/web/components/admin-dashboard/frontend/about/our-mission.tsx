"use client";

import { useEffect, useState } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Editor from "@/components/editor/editor";
import {
  AboutFormValues,
  aboutSchema,
} from "@/schema/admin-dashboard/frontend-schema";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { Buckets } from "@/constant/constant";
import { bucket } from "@/services/upload.service";
import { useUpdateById } from "@/hooks/use-update-data";

export default function OurMission() {
  const { data } = useGetData<any>("about_mission");

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      content: "",
      image: null,
    },
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (data && data?.length > 0) {
      form.setValue("content", data[0]?.content ?? "");
      setPreview(data[0]?.image_url ?? "");
    }
  }, [data]);

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<AboutFormValues, "image">,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    field.onChange(file);

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onSubmit = async (value: AboutFormValues) => {
    if (data && !data[0].id) return;
    setLoading(true);
    try {
      let finalImageUrl = preview;
      if (value.image instanceof File) {
        finalImageUrl = await bucket.uploadFile(
          value.image,
          Buckets.HOME_IMAGES,
          "about/mission",
        );
      }
      await useUpdateById(
        "about_mission",
        {
          image_url: finalImageUrl,
          content: value.content,
        },
        data?.[0]?.id as string,
      );
      toast.success("Mission updated successfully");
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Banner</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, field)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {preview && (
            <div>
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded-md border"
              />
            </div>
          )}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor
                    value={field.value}
                    onChange={(d) => field.onChange(d)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            variant={"secondary"}
            size={"lg"}
          >
            {loading && <LoaderCircle className="animate-spin" />}
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
