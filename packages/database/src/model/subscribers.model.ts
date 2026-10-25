import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    topicsubscriber: {
      type: String,
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

export const Subscribers = mongoose.models.subscribers || mongoose.model("subscriber",subscriberSchema);