import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists:username and email
    // check for images, check for avatar
    // upload then to cloudinary, avatar
    // create user object - create entry in db
    // remove password adn refresh token field from response
    // check for user creation
    // return res
})