"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { CalendarIcon, Edit, LoaderCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formSchema,
  PromoFormValues,
} from "@/schema/admin-dashboard/promo-code-schema";
import { useInsertOne } from "@/hooks/use-insert-data";
import { useUpdateById } from "@/hooks/use-update-data";
import { PromoCodeTypes } from "@/types/product-types";
import { Switch } from "@/components/ui/switch";

export function PromoCodeDialog({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<PromoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: "",
      is_active: true,
      min_order_amount: "",
      max_discount: "",
      usage_limit: "",
      valid_from: new Date(),
      valid_until: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("code", initialData.code);
      form.setValue("type", initialData.type);
      form.setValue("value", String(initialData.value));
      form.setValue("min_order_amount", String(initialData.min_order_amount));
      form.setValue("max_discount", String(initialData.max_discount));
      form.setValue("usage_limit", String(initialData.usage_limit));
      form.setValue("valid_from", new Date(initialData.valid_from));
      form.setValue("valid_until", new Date(initialData.valid_until));
      form.setValue("is_active", initialData.is_active);
    }
  }, [initialData]);

  async function onSubmit(values: PromoFormValues) {
    setLoading(true);
    try {
      const promoData: PromoCodeTypes = {
        code: values.code,
        type: values.type,
        value: Number(values.value),
        min_order_amount: Number(values.min_order_amount),
        max_discount: Number(values.max_discount),
        usage_limit: Number(values.usage_limit),
        valid_from: values.valid_from,
        valid_until: values.valid_until,
        is_active: values.is_active,
      };
      {
        initialData
          ? await useUpdateById("promo_codes", promoData, initialData.id)
          : await useInsertOne("promo_codes", promoData);
      }
      toast.success(
        initialData
          ? "Promo code updated successfully"
          : "Promo code added successfully",
      );
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size={initialData ? "icon" : "lg"}
          onClick={() => {
            setOpen(true);
            if (!initialData) form.reset();
          }}
        >
          {initialData ? <Edit className="h-4 w-4" /> : <>Add New Promo Code</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? "Update Promo Code" : "Add New Promo Code"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Promo Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code *</FormLabel>
                    <FormControl>
                      <Input className="custom_input_fields" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="custom_input_fields w-full">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">
                          Percentage (%)
                        </SelectItem>
                        <SelectItem value="fixed">
                          Fixed Amount (Rs.)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {["value", "min_order_amount", "max_discount", "usage_limit"].map(
                (name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {name.replace(/_/g, " ")}
                        </FormLabel>
                        <FormControl>
                          <Input className="custom_input_fields" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ),
              )}

              <FormField
                control={form.control}
                name="valid_from"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "custom_input_fields pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid Until</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "custom_input_fields pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <= (form.getValues("valid_from") || new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 py-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className={field.value ? "bg-green-500" : "bg-gray-300"}
                    />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                variant="secondary"
                className="w-full"
              >
                {loading && <LoaderCircle className="animate-spin" />}
                {initialData ? "Update" : "Add"} Promo Code
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
