import { loginService } from "../services/auth.rough.service";
import { asyncHandler } from "../utils/asyncHandler";

export const login = async (req, res) => {
  /* todo
    1)to take email and password from frontend
    2)to validate, it exists or not 
    3)send response
    */

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and Password are required");
    }

    const result = await loginService({ email, password });
    const options = {
      httpOnly: true,
      Credentials: true,
    };
    return res
      .status(200)
      .cookies("refreshToken", result.refreshToken, options)
      .cookies("accessToken", result.accessToken, options)
      .json({
        success: true,
        message: "user login successfully.",
        data: result,
      });
  } catch (error) {
    console.error(error.stack)
    return res.status(500).json({
        success:false,
        message: "invalid email or password",
    })
  }
};
