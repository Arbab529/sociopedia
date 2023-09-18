const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const hashString = async (value) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value, salt);
  return hashedPassword;
};

export const compareString = async (userPassword, Password) => {
  const isMatch = await bcrypt.compare(userPassword, Password);
  return isMatch;
};

export const createJWT = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};
