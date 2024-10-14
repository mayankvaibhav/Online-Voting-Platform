import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrpt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true // could be easily searched across database if index is true 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        profile: {
            type: String,     // will be using cloudinary URL
            required: true,
            default:"String"
        },
        role: {
            type: String,
            enum: ["admin", "voter"],
            default: "voter"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        votedInElection: [
            {
                type: Schema.Types.ObjectId,
                ref: "Election"
            }
        ],
        password: {
            type: String,
            required: [true, "password is required"]
        }

    },{timestamps: true}
)


// middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrpt.hash(this.password, 10);
    console.log('Hashed Password:', this.password); // Log the hashed password
    next();
});



// userSchema.methods.generateAccessToken = function (){
//     return jwt.sign (
//         {
//             _id: this._id,
//             email: this.email,
//             username: this.username,
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }
// userSchema.methods.generateRefreshToken = function(){
//     return jwt.sign (
//         {
//             _id: this._id,
           
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrpt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)