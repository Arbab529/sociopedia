const express = require("express");
const router = express.Router();
const path = require("path");
const dirname = path.resolve(path.dirname(""));
const {
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
} = require("../controller/userController");
const userAuth = require("../middleware/userAuth");

router.get("/verify/:userId/:token", verifyEmail);

// request password reset
router.post("/request-passwordreset", requestPasswordReset);

// verify password reset link
router.get("/reset-password/:userId/:token", resetPassword);

// Change Password
router.post("/reset-password", changePassword);

// User Routes Protected

router.post("/get-user/:id?", userAuth, getUser);
// router.get("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

// Friend Request
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);
router.post("/accept-request", userAuth, acceptRequest);

router.get("/verified", (req, res) => {
  res.sendFile(path.join(dirname, "./views/build", "index.html"));
});

router.get("/resetpasswordfail", (req, res) => {
  res.sendFile(path.join(dirname, "./views/build", "index.html"));
});

router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(dirname, "./views/build", "resetForm.html"));
});

module.exports = router;
