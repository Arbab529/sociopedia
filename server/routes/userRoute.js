const express = require("express");
const router = express.Router();
const path = require("path");
const dirname = path.resolve(path.dirname(""));
const { verifyEmail } = require("../controller/userController");

router.get("/verify/:userId/:token", verifyEmail);
router.get("/verified", (req, res) => {
  res.sendFile(path.join(dirname, "./views/build", "index.html"));
});

module.exports = router;
