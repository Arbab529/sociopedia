const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const postRoute = require("./postRoute");

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/posts", postRoute);

module.exports = router;
