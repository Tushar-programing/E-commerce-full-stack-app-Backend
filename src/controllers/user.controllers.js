import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
// import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken"

// console.log("its working 2")

const generateAccessAndRefreshTokens = async(userid) => {
    try {
        // console.log( "userid in", userid);
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        // console.log("tokens", accessToken);
        // console.log("tokens in", refreshToken);

        return {accessToken, refreshToken}
    } catch (error) {
        
    }
}

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body; // 'email' is used for mobile input

    console.log(fullName, email, password);

    // Validate required fields
    if (!fullName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the input is a valid mobile number (10 digits)
    const isMobile = /^[0-9]{10}$/.test(email);

    console.log("workin3 ");

    if (!isMobile) {
        throw new ApiError(400, "Invalid mobile number format");
    }

    console.log("workin4");
    
    const existedUser = await User.findOne({
        mobile: email,
    });
    console.log("workin5");
    console.log(existedUser);
    
    if (existedUser) {
        throw new ApiError(400, "User with this mobile number already exists");
    }
    console.log("workin6", email);

    // Create the new user
    const user = await User.create({
        fullName,
        mobile: parseInt(email),
        password,
    });

    console.log("workin7");

    if (!user) {
        throw new ApiError(400, "Unable to create user");
    }

    console.log("workin8");

    // Return the response
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Successfully created the user"));
});


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body; // Using 'email' for both email or mobile

    console.log(email, password);

    if (!email || !password) {
        throw new ApiError(400, "Email/Mobile and Password are required");
    }

    const isMobile = /^[0-9]{10}$/.test(email); // Check for a 10-digit mobile number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Check for valid email format

    if (!isMobile && !isEmail) {
        throw new ApiError(400, "Invalid Email or Mobile format");
    }

    // Find the user by mobile or email based on input type
    const user = await User.findOne(
        isEmail ? { email } : { mobile: email }
    );

    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect Password");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Remove sensitive fields from the response
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };

    // Return response with cookies and user data
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.userId,
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
        secure: true,
        sameSite: 'none',
    }
    // console.log("working");

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthorized request");
    }

    // console.log("incomingrefreshToken", incomingRefreshToken);

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // console.log("decodedToken", decodedToken);

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(400, "Invalid access Token")
        }
        // console.log(user?.refreshToken);

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }
        console.log(user?._id);

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);
        console.log("refreshToken", refreshToken);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid Access token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "all feilds are required");
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "old password is incorrect")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "password update successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched succesfully"))
})

const updateName = asyncHandler(async(req, res) => {
    const {newName} = req.body

    if (!newName) {
        throw new ApiError(400, "new name is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: newName,
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(400, "Failed to update the name")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, user, "name updated succesfully"))
})

const getAllUserData = asyncHandler(async(req, res) => {
    if (req?.user?.email === "ttushar476@gmail.com") {
        try {
            const { startDate, endDate } = req.body;

            console.log(startDate, endDate);
            
            // Validate that startDate and endDate are provided
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required." });
            }
        
            // Convert to ISO dates
            const start = new Date(startDate);
            const end = new Date(endDate);
        
            // Ensure the end date includes the entire day
            end.setHours(23, 59, 59, 999);
        
            // Fetch users within the date range
            const users = await User.find({
                createdAt: {
                  $gte: start, // Greater than or equal to start date
                  $lte: end,   // Less than or equal to end date
                },
            }).sort({ createdAt: -1 }); // Optional: Sort by creation date descending
        
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
})


export {
    register,
    login,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateName,
    getAllUserData,
}