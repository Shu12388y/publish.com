import mongoose from "mongoose";

const webhookLogsSchema = new mongoose.Schema({
    webhookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'webhooks'
    },
    organizationId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    statusCode:{
        type:String
    }
},{
    timestamps:true
});


export const webhookLogs = mongoose.models.webhooklogs || mongoose.model("webhook",webhookLogsSchema);