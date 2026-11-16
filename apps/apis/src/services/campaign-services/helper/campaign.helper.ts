import mongoose from "mongoose";
import { z } from "zod";

const campaignFieldsSchema = z.object({
  topic: z.string().refine(mongoose.isValidObjectId).optional(),
  subject: z.string().trim().min(1).optional(),
  content: z
    .string()
    .refine((value) => value.trim().length > 0)
    .optional(),
  status: z.string().trim().min(1).optional(),
  isSchedule: z.boolean().optional(),
  scheduleTime: z.string().trim().optional(),
  timezone: z.string().trim().optional(),
});

const campaignInputSchema = campaignFieldsSchema.required({
  subject: true,
  content: true,
});

export function isValidCampaignID(campaignID: string) {
  return mongoose.isValidObjectId(campaignID);
}

export function parseCampaignInput(value: unknown) {
  const result = campaignInputSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseCampaignUpdate(value: unknown) {
  const result = campaignFieldsSchema.partial().safeParse(value);
  if (!result.success || Object.keys(result.data).length === 0) {
    return null;
  }
  return result.data;
}
