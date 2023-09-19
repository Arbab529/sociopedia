const { sendVerificationEmail } = require("../utils/sendEmail");
const Users = require("../model/userModel");
const asyncErrorhandler = require("express-async-handler");
const { hashString, compareString, createJWT } = require("../utils/index");

const register = asyncErrorhandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    next("Provide Required Fields");
    return;
  }
  try {
    const userExits = await Users.findOne({ email });
    if (userExits) {
      next("Email already exists");
      return;
    }
    const hashedPassword = await hashString(password);
    const user = await Users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    sendVerificationEmail(user, res);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

const login = asyncErrorhandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      next("Email or password is missing");
      return;
    }
    // Find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstname lastname location profileUrl -password",
    });

    if (!user) {
      next("Invalid email or password");
      return;
    }

    // Check user is verified or not
    if (!user?.verified) {
      next(
        "User email is not verified. Please check your email inbox and verify your email"
      );
      return;
    }

    // Check Password
    const isMatch = await compareString(password, user?.password);
    if (!isMatch) {
      next("Invalid email or password");
      return;
    }
    user.password = undefined;
    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

module.exports = {
  register,
  login,
};
