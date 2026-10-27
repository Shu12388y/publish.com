import mongoose from "mongoose";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isValidTopicID(topicID: string) {
  return mongoose.isValidObjectId(topicID);
}

export function parseTopicInput(value: unknown) {
  if (!isRecord(value) || typeof value.topicName !== "string") {
    return null;
  }

  const topicName = value.topicName.trim();
  if (!topicName || (value.status !== undefined && typeof value.status !== "string")) {
    return null;
  }

  return {
    topicName,
    ...(value.status === undefined ? {} : {status: value.status.trim()}),
  };
}

export function parseTopicUpdate(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const update: {topicName?: string; status?: string} = {};
  if (value.topicName !== undefined) {
    if (typeof value.topicName !== "string" || !value.topicName.trim()) {
      return null;
    }
    update.topicName = value.topicName.trim();
  }
  if (value.status !== undefined) {
    if (typeof value.status !== "string" || !value.status.trim()) {
      return null;
    }
    update.status = value.status.trim();
  }
  return Object.keys(update).length === 0 ? null : update;
}
