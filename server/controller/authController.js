import { sendVerificationEmail } from "../utils/sendEmail.js";
const Users = require("../model/userModel.js");
const asyncErrorhandler = require("express-async-handler");
const { hashString } = require("../utils/index.js");

export const register = asyncErrorhandler(async (req, res, next) => {
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
