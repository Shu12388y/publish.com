import mongoose from "mongoose";
import { z } from "zod";

const topicFieldsSchema = z.object({
  topicName: z.string().trim().min(1),
  status: z.string().trim().min(1).optional(),
});

export function isValidTopicID(topicID: string) {
  return mongoose.isValidObjectId(topicID);
}

export function parseTopicInput(value: unknown) {
  const result = topicFieldsSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseTopicUpdate(value: unknown) {
  const result = topicFieldsSchema.partial().safeParse(value);
  if (!result.success || Object.keys(result.data).length === 0) {
    return null;
  }
  return result.data;
}
