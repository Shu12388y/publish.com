import mongoose from "mongoose";

export interface SubscriberDocument {
  email: string;
  topicsubscriber: string;
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
      type: String,
      required: true,
      default: "",
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

subscriberSchema.index({organizationId: 1, email: 1}, {unique: true});

export const Subscribers =
  (mongoose.models.subscriber as mongoose.Model<SubscriberDocument> | undefined) ||
  mongoose.model<SubscriberDocument>("subscriber", subscriberSchema);