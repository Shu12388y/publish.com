import crypto from "node:crypto";
import type {Context} from "hono";
import type {WebhookRepository} from "../repo/webhook.repo.js";
import {WebhookRepository as DefaultWebhookRepository} from "../repo/webhook.repo.js";
import {
  isValidWebhookID,
  parseWebhookInput,
  parseWebhookUpdate,
} from "../helper/webhook.helper.js";

export class WebhookController {
  constructor(private readonly repository: WebhookRepository) {}

  create = async (c: Context) => {
    const input = parseWebhookInput(await c.req.json().catch(() => null));
    if (!input) {
      return c.json({message: "A valid HTTP or HTTPS backendUrl is required"}, 400);
    }

    try {
      const webhookSecret = crypto.randomBytes(32).toString("hex");
      const webhook = await this.repository.create({
        ...input,
        webhookSecret,
        organizationId: c.var.auth.organizationID,
      });

      return c.json(
        {
          message: "Webhook created successfully",
          webhook: {...webhook.toObject(), webhookSecret},
        },
        201,
      );
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return c.json({message: "A webhook with this URL already exists"}, 409);
      }
      console.error("Webhook creation failed", error);
      return c.json({message: "Internal Server Error"}, 500);
    }
  };

  findAll = async (c: Context) => {
    const webhooks = await this.repository.findAllByOrganization(
      c.var.auth.organizationID,
    );
    return c.json({webhooks});
  };

  find = async (c: Context) => {
    const webhookID = c.req.param("webhookID");
    if (!webhookID || !isValidWebhookID(webhookID)) {
      return c.json({message: "Invalid webhook ID"}, 400);
    }

    const webhook = await this.repository.findById(
      c.var.auth.organizationID,
      webhookID,
    );
    return webhook
      ? c.json({webhook})
      : c.json({message: "Webhook not found"}, 404);
  };

  update = async (c: Context) => {
    const webhookID = c.req.param("webhookID");
    if (!webhookID || !isValidWebhookID(webhookID)) {
      return c.json({message: "Invalid webhook ID"}, 400);
    }

    const update = parseWebhookUpdate(await c.req.json().catch(() => null));
    if (!update) {
      return c.json(
        {message: "A valid backendUrl or isWebEnable value is required"},
        400,
      );
    }

    try {
      const webhook = await this.repository.updateById(
        c.var.auth.organizationID,
        webhookID,
        update,
      );
      return webhook
        ? c.json({webhook})
        : c.json({message: "Webhook not found"}, 404);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return c.json({message: "A webhook with this URL already exists"}, 409);
      }
      console.error("Webhook update failed", error);
      return c.json({message: "Internal Server Error"}, 500);
    }
  };

  delete = async (c: Context) => {
    const webhookID = c.req.param("webhookID");
    if (!webhookID || !isValidWebhookID(webhookID)) {
      return c.json({message: "Invalid webhook ID"}, 400);
    }

    const webhook = await this.repository.deleteById(
      c.var.auth.organizationID,
      webhookID,
    );
    return webhook
      ? c.json({message: "Webhook deleted successfully"})
      : c.json({message: "Webhook not found"}, 404);
  };
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export const webhookController = new WebhookController(
  new DefaultWebhookRepository(),
);
