import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    // example using Gmail SMTP, replace with your config
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
  const { email, fullName, password, role } = req.body;

  // Check required fields
  if (!email || !fullName || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  // Role validation
  const allowedRoles = ["user", "facilityowner", "admin"];
  console.log(role)
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // Check if email already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "Email already exists");
  }

  // Get local paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload to Cloudinary
  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUpload = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatarUpload?.url) {
    throw new ApiError(500, "Avatar upload to Cloudinary failed");
  }

  // Generate OTP and expiry
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // Create user in DB
  const user = await User.create({
    email,
    fullName,
    password,
    avatar: avatarUpload.url,
    coverImage: coverImageUpload?.url || null,
    role,
    otp,
    otpExpiry,
    isVerified: false
  });

  // Send OTP email
  await transporter.sendMail({
    from: `QuickCourt <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "QuickCourt Email Verification",
    text: `Your OTP for verification is: ${otp}. It will expire in 10 minutes.`,
  });

  // Response
  return res
    .status(201)
    .json(new ApiResponse(201, { email: user.email }, "OTP sent to your email"));
});

 const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  if (!user.otp || !user.otpExpiry) {
    throw new ApiError(400, "OTP not found");
  }

  if (new Date() > user.otpExpiry) {
    throw new ApiError(400, "OTP has expired");
  }

  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Registration verified successfully"));
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})
const me = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "User info fetched")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email)
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Email is required"));

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User with this email not found"));

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.passwordResetOTP = otp;
    user.passwordResetOTPExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "Your Password Reset OTP",
  text: `Your OTP for password reset is: ${otp}. It will expire in 15 minutes.`,
};

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json(
            new ApiResponse(200, null, "OTP sent to your email address")
        );
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to send OTP email"));
    }
});

 const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Email, OTP and new password are required"));

    const user = await User.findOne({
        email: email.toLowerCase().trim(),
        passwordResetOTP: otp,
        passwordResetOTPExpires: { $gt: Date.now() },
    });

    if (!user)
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Invalid or expired OTP"));

    user.password = newPassword; // pre-save hook will hash
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;

    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

export {
    registerUser, loginUser,
    logoutUser,
    refreshAccessToken, me, forgotPassword, resetPassword,verifyRegistrationOtp
}