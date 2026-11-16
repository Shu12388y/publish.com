import crypto from "node:crypto";
import { Readable } from "node:stream";
import csv from "csv-parser";
import { z } from "zod";

export const MAX_CSV_BYTES = 10 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 10_000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((email) => emailPattern.test(email));
const topicsSchema = z
  .union([z.string(), z.array(z.string())])
  .transform((value) =>
    (Array.isArray(value) ? value : value.split(","))
      .map((topic) => topic.trim())
      .filter(Boolean),
  )
  .refine(
    (topics) => topics.length > 0 && topics.length === new Set(topics).size,
  );

export function parseSubscriberInput(value: unknown) {
  const result = z
    .object({
      email: emailSchema,
      topics: topicsSchema.optional(),
      topicsubscriber: topicsSchema.optional(),
    })
    .transform(({ email, topics, topicsubscriber }) => ({
      email,
      topics: topics ?? topicsubscriber,
    }))
    .refine(({ topics }) => topics !== undefined)
    .safeParse(value);
  if (!result.success || !result.data.topics) {
    return null;
  }
  return {
    email: result.data.email,
    topics: result.data.topics,
  };
}

export function normalizeTopics(value: unknown): string[] | null {
  const result = topicsSchema.safeParse(value);
  return result.success ? result.data : null;
}

export async function parseCsv(content: string): Promise<string[]> {
  const emails = new Set<string>();
  const parser = Readable.from([content]).pipe(csv({ headers: false }));

  for await (const row of parser) {
    const values = Object.values(row) as string[];
    for (const value of values) {
      const email = emailSchema.safeParse(value);
      if (email.success) {
        emails.add(email.data);
        break;
      }
    }
  }

  return [...emails];
}

export function verifyWebhookSignature(
  body: string,
  timestamp: string | undefined,
  signature: string | undefined,
  secret: string | undefined,
) {
  if (!timestamp || !signature || !secret || !/^\d+$/.test(timestamp)) {
    return false;
  }

  const timestampNumber = Number(timestamp);
  if (
    !Number.isSafeInteger(timestampNumber) ||
    Math.abs(Date.now() - timestampNumber * 1000) > 5 * 60 * 1000
  ) {
    return false;
  }

  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex")}`;
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return (
    provided.length === expectedBuffer.length &&
    crypto.timingSafeEqual(provided, expectedBuffer)
  );
}
