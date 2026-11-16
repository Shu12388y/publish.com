import mongoose, { Types } from "mongoose";

export interface CampaignDocument {
  organizationId: string;
  topic?: Types.ObjectId;
  subject: string;
  content: string;
  status: string;
  isSchedule: boolean;
  scheduleTime?: string;
  timezone?: string;
}

const campaignSchema = new mongoose.Schema<CampaignDocument>(
  {
    organizationId: {
      type: String,
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "topic",
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "DRAFT",
    },
    isSchedule: {
      type: Boolean,
      default: false,
    },
    scheduleTime: {
      type: String,
    },
    timezone: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Campaign =
  (mongoose.models.campaign as mongoose.Model<CampaignDocument> | undefined) ||
  mongoose.model<CampaignDocument>("campaign", campaignSchema);
