import { Currency } from "@/constant/constant";
import * as z from "zod";

export const paymentSettingsSchema = z.object({
  mode: z.enum(["sandbox", "live"]),
  client_id: z.string().min(1, "Client ID is required"),
  client_secret: z.string().min(1, "Client Secret is required"),
  currency: z.enum(Object.values(Currency)),
});

export type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>;
