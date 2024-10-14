import mongoose, {Schema} from "mongoose";


const voteSchema = new Schema(
    {
        voter: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        election:{
            type: Schema.Types.ObjectId,
            ref: "Election"
        },
        candidate: {
            type: Schema.Types.ObjectId,
            ref: "Candidate"
        },
        isValid: {
            type: Boolean,
            default: true
        }

    },{timestamps: true}
)



export const Vote = mongoose.model("Vote", voteSchema)