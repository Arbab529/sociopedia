const Users = require("../model/userModel");
const asyncErrorhandler = require("express-async-handler");
const { hashString, compareString, createJWT } = require("../utils/index");
const Verification = require("../model/emailVerification");

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
            Users.findOneAndDelete({ _id: userId })
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

module.exports = {
  verifyEmail,
};
