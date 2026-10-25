import mongoose from "mongoose";

const domainSchema = new mongoose.Schema({
    organizationId:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    isVerify:{
        type:Boolean,
        default:false
    },
    newsletterMail:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

export const Domain = mongoose.models.domains || mongoose.model("domain",domainSchema);