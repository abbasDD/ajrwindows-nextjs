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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoaderCircle, StarIcon } from "lucide-react";
import { useInsertOne } from "@/hooks/use-insert-data";
import {
  TestimonialsFormValues,
  testiomnialsSchema,
} from "@/schema/admin-dashboard/frontend-schema";
import { Buckets } from "@/constant/constant";
import { bucket } from "@/services/upload.service";

const AddTestiomnialsModal = () => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<TestimonialsFormValues>({
    resolver: zodResolver(testiomnialsSchema),
    defaultValues: {
      name: "",
      message: "",
      image: undefined as unknown as File,
      rating: 1,
    },
  });

  const onSubmit = async (values: TestimonialsFormValues) => {
    setLoading(true);
    try {
      // update the slider
      const imageUrl = await bucket.uploadFile(
        values.image,
        Buckets.HOME_IMAGES,
        "testimonials",
      );
      await useInsertOne("home_testiomnials", {
        name: values.name,
        message: values.message,
        avatar: imageUrl,
        rating: Number(values.rating),
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
        <Button
          size={"lg"}
          variant={"secondary"}
          onClick={() => {
            setOpen(true);
            form.reset();
            setImagePreview(null);
          }}
        >
          Add Testimonials
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Testimonials</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter customer name"
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
              name="message"
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
                      className="mt-2 mx-auto max-h-32 rounded-md object-contain"
                    />
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className=" mt-8 ">
                  <FormLabel className="mb-2">Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`size-6 cursor-pointer ${
                            star <= field.value
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
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
                Add Testimonial
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
export default AddTestiomnialsModal;
