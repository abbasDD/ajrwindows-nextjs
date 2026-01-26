"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useInsertOne } from "@/hooks/use-insert-data";
import {
  SliderFormValues,
  sliderSchema,
} from "@/schema/admin-dashboard/frontend-schema";
import { Buckets } from "@/constant/constant";
import { bucket } from "@/services/upload.service";

const AddSliderModal = () => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<SliderFormValues>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined as unknown as File,
      active: true,
    },
  });

  const onSubmit = async (values: SliderFormValues) => {
    setLoading(true);
    try {
      // update the slider
      const imageUrl = await bucket.uploadFile(
        values.image,
        Buckets.HOME_IMAGES,
        "sliders",
      );
      await useInsertOne("hero_sliders", {
        title: values.title,
        description: values.description,
        image_url: imageUrl,
        active: values.active,
      });
      toast.success("Slider created successfully");
      setOpen(false);
      form.reset();
      setImagePreview(null);
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} variant={"secondary"}>
          Add Slider
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Slider</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter slider title"
                      {...field}
                      className="py-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-24"
                      placeholder="Enter description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-12 pt-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        field.onChange(file);
                        handleImageChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 mx-auto max-h-40 rounded-md object-contain"
                    />
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex mt-8 iitems-center gap-4">
                  <FormLabel className="mb-0">Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end space-x-2">
              <Button
                disabled={loading}
                type="submit"
                size={"lg"}
                variant={"secondary"}
              >
                {loading && <LoaderCircle className="animate-spin" />}
                Save
              </Button>
              <Button
                variant="outline"
                type="button"
                size="lg"
                disabled={loading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default AddSliderModal;
