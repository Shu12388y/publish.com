import crypto from "node:crypto";
import {Readable} from "node:stream";
import csv from "csv-parser";

export const MAX_CSV_BYTES = 10 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 10_000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim().toLowerCase();
  return emailPattern.test(email) ? email : null;
}

export function normalizeTopics(value: unknown): string[] | null {
  if (typeof value !== "string" && !Array.isArray(value)) {
    return null;
  }

  const values = Array.isArray(value) ? value : value.split(",");
  const topics = values
    .filter((topic): topic is string => typeof topic === "string")
    .map((topic) => topic.trim())
    .filter(Boolean);

  return topics.length > 0 && topics.length === new Set(topics).size
    ? topics
    : null;
}

export function parseSubscriberInput(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const email = normalizeEmail(value.email);
  const topics = normalizeTopics(value.topics ?? value.topicsubscriber);
  if (!email || !topics) {
    return null;
  }

  return {email, topics};
}

export async function parseCsv(content: string): Promise<string[]> {
  const emails = new Set<string>();
  const parser = Readable.from([content]).pipe(csv({headers: false}));

  for await (const row of parser) {
    const values = Object.values(row) as string[];
    for (const value of values) {
      const email = normalizeEmail(value);
      if (email) {
        emails.add(email);
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
  if (!Number.isSafeInteger(timestampNumber) ||
      Math.abs(Date.now() - timestampNumber * 1000) > 5 * 60 * 1000) {
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
