import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export class requestsToApi {
    constructor(
        public IP: string,
        public URL: string,
        public date: Date) {

    }
}

export const requestsToApiSchema = new mongoose.Schema<requestsToApi>({
    IP: {type: String, require: true},
    URL: {type: String, require: true},
    date: {type: Date, require: true},
})
export const RequestsToApiModel = mongoose.model<requestsToApi>('requests', requestsToApiSchema)