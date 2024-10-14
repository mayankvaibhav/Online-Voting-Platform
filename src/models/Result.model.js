import mongoose, {Schema} from "mongoose";


const resultSchema = new Schema(
    {
        election: {
            type: Schema.Types.ObjectId,
            ref: "Election",
            required: true
        },
        winner: {
            type: Schema.Types.ObjectId,
            ref: "Candidate",
            required: true

        },
        totalVotes: {
            type: Number,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },{timestamps: true}
)


export const Result = mongoose.model("Result", resultSchema) 