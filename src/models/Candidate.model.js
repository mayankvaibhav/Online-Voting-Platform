import mongoose, { Schema } from "mongoose";


const candidateSchema = new Schema(
    {
        candidateName: {
            type: String,
            required: true
        },
        nickname: {
            type: String, // Ensure the nickname field is included
            required: false // You can decide if it's required or optional
        },
        profile: {
            type: String,
            required: false,
        },
        bio: {
            type: String,
            required: true
        },
        election: {
            type: Schema.Types.ObjectId,
            ref: "Election",
            required: true
        },
        votesCount: {
            type: Number,
            default: 0
        },
    }, { timestamps: true }
);


export const Candidate = mongoose.model("Candidate", candidateSchema)