import mongoose from "mongoose";

interface TopicDocument {
  topicName: string;
  status: string;
  organizationID: string;
}

const topicSchema = new mongoose.Schema<TopicDocument>(
  {
    topicName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "0",
    },
    organizationID: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Topic =
  (mongoose.models.topics as mongoose.Model<TopicDocument> | undefined) ||
  mongoose.model<TopicDocument>("topic", topicSchema);
