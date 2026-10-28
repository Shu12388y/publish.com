import mongoose from "mongoose";

export function isValidWebhookID(webhookID: string) {
  return mongoose.isValidObjectId(webhookID);
}

export function normalizeBackendUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function parseWebhookInput(value: unknown) {
  if (
    typeof value !== "object" ||
    value === null ||
    !("backendUrl" in value)
  ) {
    return null;
  }

  const backendUrl = normalizeBackendUrl(value.backendUrl);
  return backendUrl ? {backendUrl} : null;
}

export function parseWebhookUpdate(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const update: {backendUrl?: string; isWebEnable?: boolean} = {};
  if ("backendUrl" in value) {
    const backendUrl = normalizeBackendUrl(value.backendUrl);
    if (!backendUrl) {
      return null;
    }
    update.backendUrl = backendUrl;
  }
  if ("isWebEnable" in value) {
    if (typeof value.isWebEnable !== "boolean") {
      return null;
    }
    update.isWebEnable = value.isWebEnable;
  }

  return Object.keys(update).length > 0 ? update : null;
}
