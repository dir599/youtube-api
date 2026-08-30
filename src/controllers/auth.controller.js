import {
  generateRefreshAndAccessTokenService,
  loginUser,
  logOutService,
  registerService,
} from "../services/auth.service.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Email and password are required.`,
      });
    }
    const result = await loginUser({ email, password });

    // cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", result.refreshToken, options)
      .cookie("accessToken", result.accessToken, options)
      .json({
        success: true,
        message: `Successfully login.`,
        data: result,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error.`,
    });
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists:username and email
  // check for images, check for avatar
  // upload then to cloudinary, avatar
  // create user object - create entry in db
  // remove password adn refresh token field from response
  // check for user creation
  // return res
  const { id, username, email, password, fullName, role } = req.body;
  console.log(req.body);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console
  console.log(avatarLocalPath);
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required.");
  }

  // if(fullName === ""){
  //   throw new ApiError(400, "fullname is requires")
  // }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const register = await registerService({
    id,
    username,
    email,
    password,
    fullName,
    avatarLocalPath,
    coverImageLocalPath,
    role,
  });
  return res.status(200).json({
    success: true,
    message: "User register successfully",
    data: register,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  await logOutService({ userId: req.user.id });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
      success: true,
      message: "successfully logout",
    });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log("COOKIES:", req.cookies);
  const refreshToken = req.cookies?.refreshToken;
  console.log(refreshToken)

  const accessToken = await generateRefreshAndAccessTokenService({ refreshToken });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200).cookie("accessToken", accessToken, options).json({
    success: true,
    accessToken: accessToken,
  });
});







