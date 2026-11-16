import mongoose from "mongoose";

interface DomainDocument {
  organizationId: string;
  domain: string;
  verificationToken?: string;
  isVerify: boolean;
  newsletterMail?: string;
}

const domainSchema = new mongoose.Schema<DomainDocument>(
  {
    organizationId: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    verificationToken: {
      type: String,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    newsletterMail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Domain =
  (mongoose.models.domain as mongoose.Model<DomainDocument> | undefined) ||
  mongoose.model<DomainDocument>("domain", domainSchema);
