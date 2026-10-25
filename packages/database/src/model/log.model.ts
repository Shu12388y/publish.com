import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'PROCESSING'
    },
    timeStamp:{
        type:String,
        required:true
    },
    retries:{
        type:String,
        default:"0"
    },
    organizationId:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

export const Logs = mongoose.models.logs || mongoose.model("log",logsSchema);