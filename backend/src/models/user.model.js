import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {

        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullName: {
            type: String,
            
            required: true,
            trim: true,
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            // CHANGE: Make the password field optional
            required: false
        },
        refreshToken: {
            type: String
        },
        // ADD: A new field to store the Google user ID
        googleId: {
            type: String,
            required: false // It's optional for a regular user
        },
        role: {
            type: String,
            enum: ["user", "facilityowner", "admin"],
            default: "user",
            required: true
        },

        passwordResetOTP: {
            type: String,
            required: false,
        },
        passwordResetOTPExpires: {
            type: Date,
            required: false,
        },
        otp: { type: String },
        otpExpiry: { type: Date },
        isVerified: { type: Boolean, default: false }

    },
    {
        timestamps: true
    }
)

// This pre-save hook is perfect as it is.
// It will only run when the password field is modified (e.g., during a password-based signup)
// It will be skipped during a Google login because isModified("password") will be false.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            // ADD: Include the avatar in the token payload
            avatar: this.avatar,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)