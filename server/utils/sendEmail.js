import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { hashString } from "./index.js";
import Verification from "../model/emailVerification.js";

dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendVerificationEmail = async (user, res) => {
  const { _id, lastname, email } = user;
  const token = _id + uuidv4();
  const link = APP_URL + "/verify/account/" + _id + "/" + token;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Sociopedia Email verification",
    html: `<div style="font-family: Arial, sans-serif;padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
                    <h1 style="color: #333;">Verify Your Email Address</h1>
                    <h3 style="color: #333;">Hello, ${lastname}!</h3>
                    <p style="color: #777;">Thank you for signing up with Sociopedia! To ensure the security of your account, please verify your email address.</p>
                    <p style="color: #777;">Please click on the button below to verify your email address:</p>
                    <a href=${link} style="text-decoration: none; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 4px; margin:10px 0!important; display:inline-block">Verify Email</a>
                    <p style="color: #777;">This verification link will expire after 1 hour.</p>
                </div>
            </div>`,
  };
  try {
    const hashedString = await hashString(token);
    const newVerificationEmail = await Verification.create({
      userId: _id,
      token: hashedString,
      createdAt: Date.now(),
      expiresAt: Date.now() * 3600000,
    });
    if (newVerificationEmail) {
      transporter.sendMail(mailOptions).then(() => {
        res
          .status(200)
          .json({
            success: "PENDING",
            message:
              "Verification email has been sent to your email. Please check your email and verify your account",
          })
          .catch((error) => {
            console.log(error);
            res.status(404).json({
              message: "Something went wrong",
            });
          });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "something went wrong",
    });
  }
};
