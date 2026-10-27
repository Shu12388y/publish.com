import mongoose from "mongoose";

interface AuthDocument {
  email: string;
  password: string;
  fullname: string;
  organization: string;
  organizationID: string;
}

const authSchema = new mongoose.Schema<AuthDocument>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
      unique: true,
    },
    organizationID:{
        type:String,
        required:true,
        unique:true
    }
  },
  {
    timestamps: true,
  },
);

export const Auth =
  (mongoose.models.auths as mongoose.Model<AuthDocument> | undefined) ||
  mongoose.model<AuthDocument>("auth", authSchema);