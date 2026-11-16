import mongoose from "mongoose";
import { z } from "zod";

const webhookFieldsSchema = z.object({
  backendUrl: z
    .string()
    .url()
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    }),
  isWebEnable: z.boolean().optional(),
});

export function isValidWebhookID(webhookID: string) {
  return mongoose.isValidObjectId(webhookID);
}

export function parseWebhookInput(value: unknown) {
  const result = webhookFieldsSchema
    .pick({ backendUrl: true })
    .safeParse(value);
  return result.success ? result.data : null;
}

export function parseWebhookUpdate(value: unknown) {
  const result = webhookFieldsSchema.partial().safeParse(value);
  if (!result.success || Object.keys(result.data).length === 0) {
    return null;
  }
  return result.data;
}
