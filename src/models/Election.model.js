// mongodb automatically generate objectid when user is registered

import mongoose, {Schema} from "mongoose";

const electionSchema = new Schema(
    {
        electionName: {
            type: String,
            required: true,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            default: Date.now(),
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        isPrivate: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: Boolean,
            default: false
        }

    },{timestamps: true}
)


export const Election = mongoose.model("Election", electionSchema)