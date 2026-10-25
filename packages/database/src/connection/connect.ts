import mongoose from "mongoose";

export const connectionDB = async(url:string) =>{
    try {
        await mongoose.connect(url);
        console.log('DB connection')
    } catch (error) {
        throw new Error(String(error))
    }
}