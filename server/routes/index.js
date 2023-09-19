const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");

router.use("/auth", authRoute);
router.use("/users", userRoute);

module.exports = router;
