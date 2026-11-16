import mongoose, { Types } from "mongoose";

export interface SubscriberDocument {
  email: string;
  topicsubscriber: Types.ObjectId;
  isActive: boolean;
  isVerified: boolean;
  organizationId: string;
}

const subscriberSchema = new mongoose.Schema<SubscriberDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    topicsubscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "topic",
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Subscribers =
  (mongoose.models.subscriber as
    mongoose.Model<SubscriberDocument> | undefined) ||
  mongoose.model<SubscriberDocument>("subscriber", subscriberSchema);
