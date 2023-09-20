const Users = require("../model/userModel");
const asyncErrorhandler = require("express-async-handler");
const { hashString, compareString, createJWT } = require("../utils/index");
const Verification = require("../model/emailVerification");
const expressAsyncHandler = require("express-async-handler");
const PasswordReset = require("../model/passwordReset");
const { resetPasswordLink } = require("../utils/sendEmail");
const Request = require("../model/friendRequestModel");

const verifyEmail = asyncErrorhandler(async (req, res, next) => {
  const { userId, token } = req.params;
  try {
    const result = await Verification.findOne({ userId });
    if (result) {
      const { expiresAt, token: hashedToken } = result;

      // Check if token is expired
      if (expiresAt < Date.now()) {
        // If token expired remove token from DB
        await Verification.findOneAndDelete({ userId })
          .then(() => {
            // If token expired and removed from DB then remove user also from DB
            Users.findByIdAndDelete({ userId })
              .then(() => {
                const message = "verification token has been expired";
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((error) => {
                console.log(error);
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        // If Token is note expired check token is correct or not
        compareString(token, hashedToken)
          .then((isMatch) => {
            // If token is correct updated verified:true
            if (isMatch) {
              Users.findOneAndUpdate(
                { _id: userId },
                { verified: true },
                { new: true }
              )
                .then(() => {
                  // User Verified
                  const message = "Email verified successfully";
                  res.redirect(
                    `/users/verified?status=success&message=${message}`
                  );
                })
                .catch((error) => {
                  // User not verified => error
                  console.log(error);
                  const message = "Verification failed or link is invalid";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              // If token not matched means link is invalid
              const message = "Verification failed or link is invalid";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid Verification link. Please try again";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/users/verified?message=`);
  }
});

const requestPasswordReset = asyncErrorhandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "Email address not found",
      });
    }
    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(404).json({
          status: "PENDING",
          message: "Password reset link has already been sent to your email",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
    });
  }
});

const resetPassword = asyncErrorhandler(async (req, res, next) => {
  const { userId, token } = req.params;
  const user = await Users.findById(userId);

  if (!user) {
    const message = "Invalid password reset link. Try again";
    res.redirect(`/users/resetpasswordfail?status=error&message=${message}`);
  }

  const resetPassword = await PasswordReset.findOne({ userId });
  if (!resetPassword) {
    const message = "Password Link has been expired. Try again";
    res.redirect(`/users/resetpasswordfail?status=error&message=${message}`);
  }

  const { expiresAt, token: resetToken } = resetPassword;
  if (expiresAt < Date.now()) {
    const message = "Reset Password link has been expired. Try again";
    res.redirect(`/users/resetpasswordfail?status=error&message=${message}`);
  } else {
    const isMatch = await compareString(token, resetToken);
    if (!isMatch) {
      const message = "Reset Password link has been expired. Try again";
      res.redirect(`/users/resetpasswordfail?status=error&message=${message}`);
    } else {
      res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
    }
  }
  try {
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
    });
  }
});

const changePassword = asyncErrorhandler(async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    const hashedPassword = await hashString(password);
    const user = await Users.findOneAndUpdate(
      { _id: userId },
      {
        password: hashedPassword,
      }
    );
    if (user) {
      await PasswordReset.findOneAndDelete({ userId: userId });
      // return res.status(200).json({
      //   success: true,
      //   message: "Password reset successfully",
      // });
      const message = "Password successfully reset";
      res.redirect(`/users/verified?status=success&message=${message}`);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
    });
  }
});

const getUser = asyncErrorhandler(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.password = undefined;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth Error",
    });
  }
});

const updateUser = asyncErrorhandler(async (req, res, next) => {
  try {
    const { firstname, lastname, location, profileUrl, profession } = req.body;

    if (!(firstname || lastname || location || profileUrl || profession)) {
      next("Please provide all required fields");
      return;
    }
    const { userId } = req.body.user;
    const updateUser = {
      firstname,
      lastname,
      location,
      profileUrl,
      profession,
      _id: userId,
    };
    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });
    await user.populate({ path: "friends", select: "-password" });
    const token = createJWT(user._id);
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "Profile Updated successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

const friendRequest = asyncErrorhandler(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { requestTo } = req.body;
    const requestExist = await Request.findOne({
      requestFrom: userId,
      requestTo,
    });
    if (requestExist) {
      next("Friend request already exists");
      return;
    }
    const newReq = await Request.create({
      requestTo,
      requestFrom: userId,
    });
    res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth Error",
      error: error.message,
    });
  }
});
const getFriendRequest = asyncErrorhandler(async (req, res, next) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth Error",
      error: error.message,
    });
  }
});
const acceptRequest = asyncErrorhandler(async (req, res, next) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth Error",
      error: error.message,
    });
  }
});
// const name = asyncErrorhandler(async (req, res, next) => {});

module.exports = {
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
};
