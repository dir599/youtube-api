import { loginUser } from "../services/auth.service.js";

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


    return res.status(200).json({
      success: true,
      message: `Successfully login.`,
      data: result,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: `Internal Server Error.`,
    });
  }
};
