import type {Context} from "hono";
import {Topic} from "@publish.com/database/db";
import type {SubscriberRepository} from "../repo/subscriber.repo.js";
import {SubscriberRepository as DefaultSubscriberRepository} from "../repo/subscriber.repo.js";
import {
  MAX_CSV_BYTES,
  MAX_IMPORT_ROWS,
  isRecord,
  normalizeTopics,
  parseCsv,
  parseSubscriberInput,
  verifyWebhookSignature,
} from "../helper/subscriber.helper.js";

export class SubscriberController {
  constructor(private readonly repository: SubscriberRepository) {}

  private validateTopics = async (organizationId: string, topics: string[]) => {
    const existing = await Topic.find({
      organizationID: organizationId,
      topicName: {$in: topics},
    })
      .select({topicName: 1, _id: 0})
      .lean();
    const existingNames = new Set(existing.map((topic) => topic.topicName));
    return topics.every((topic) => existingNames.has(topic));
  };

  private save = async (organizationId: string, emails: string[], topics: string[]) => {
    if (emails.length === 0 || emails.length > MAX_IMPORT_ROWS) {
      return null;
    }
    if (!(await this.validateTopics(organizationId, topics))) {
      return "invalid-topics" as const;
    }
    const subscribers = await this.repository.upsertMany(
      emails.map((email) => ({email, topics, organizationId})),
    );
    return subscribers;
  };

  create = async (c: Context) => {
    const input = parseSubscriberInput(await c.req.json().catch(() => null));
    if (!input) {
      return c.json({message: "A valid email and at least one topic are required"}, 400);
    }

    const result = await this.save(c.var.auth.organizationID, [input.email], input.topics);
    if (result === "invalid-topics") {
      return c.json({message: "One or more topics do not exist"}, 400);
    }
    if (!result) {
      return c.json({message: "Invalid subscriber data"}, 400);
    }
    return c.json({subscriber: result[0]}, 201);
  };

  uploadCsv = async (c: Context) => {
    const form = await c.req.parseBody();
    const file = form.file;
    const topics = normalizeTopics(form.topics);
    if (!(file instanceof File) || !topics) {
      return c.json({message: "A CSV file and topics are required"}, 400);
    }
    if (file.size > MAX_CSV_BYTES) {
      return c.json({message: "CSV file exceeds the 10 MB limit"}, 413);
    }

    let emails: string[];
    try {
      emails = await parseCsv(await file.text());
    } catch (error) {
      console.error("Subscriber CSV parsing failed", error);
      return c.json({message: "CSV contains invalid formatting"}, 400);
    }
    const result = await this.save(c.var.auth.organizationID, emails, topics);
    if (result === "invalid-topics") {
      return c.json({message: "One or more topics do not exist"}, 400);
    }
    if (!result) {
      return c.json({message: "CSV must contain between 1 and 10,000 valid emails"}, 400);
    }
    return c.json({message: "Subscribers imported successfully", count: result.length}, 201);
  };

  webhook = async (c: Context) => {
    const body = await c.req.text();
    if (
      !verifyWebhookSignature(
        body,
        c.req.header("x-webhook-timestamp"),
        c.req.header("x-webhook-signature"),
        process.env.SUBSCRIBER_WEBHOOK_SECRET,
      )
    ) {
      return c.json({message: "Invalid webhook signature"}, 401);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      return c.json({message: "Webhook body must be valid JSON"}, 400);
    }
    if (!isRecord(payload) || typeof payload.organizationID !== "string") {
      return c.json({message: "organizationID is required"}, 400);
    }

    const input = parseSubscriberInput(payload);
    if (!input) {
      return c.json({message: "A valid email and at least one topic are required"}, 400);
    }
    const result = await this.save(payload.organizationID, [input.email], input.topics);
    if (result === "invalid-topics") {
      return c.json({message: "One or more topics do not exist"}, 400);
    }
    if (!result) {
      return c.json({message: "Invalid subscriber data"}, 400);
    }
    return c.json({subscriber: result[0]}, 201);
  };
}

export const subscriberController = new SubscriberController(
  new DefaultSubscriberRepository(),
);
