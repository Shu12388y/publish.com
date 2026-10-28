import mongoose from "mongoose";

export interface WebhookDocument {
    backendUrl: string;
    isWebEnable: boolean;
    webhookSecret: string;
    organizationId: string;
}

const webhookSchema = new mongoose.Schema<WebhookDocument>({
    backendUrl:{
        type:String,
        required:true,
        trim:true,
    },
    isWebEnable:{
        type:Boolean,
        required:true,
        default:false
    },
    webhookSecret:{
        type:String,
        required:true
    },
    organizationId:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

webhookSchema.index({organizationId:1, backendUrl:1}, {unique:true});

export const Webhook =
    (mongoose.models.webhook as mongoose.Model<WebhookDocument> | undefined) ||
    mongoose.model<WebhookDocument>("webhook",webhookSchema);