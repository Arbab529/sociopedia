const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashString = async (value) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value, salt);
  return hashedPassword;
};

const compareString = async (userPassword, Password) => {
  const isMatch = await bcrypt.compare(userPassword, Password);
  return isMatch;
};

const createJWT = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

module.exports = {
  createJWT,
  compareString,
  hashString,
};
