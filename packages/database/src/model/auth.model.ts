import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      reqiured: true,
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

export const Auth = mongoose.models.auths || mongoose.model("auth", authSchema);