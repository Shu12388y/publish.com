import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  },
);

export const Topic =
  mongoose.models.topics || mongoose.model("topic", topicSchema);