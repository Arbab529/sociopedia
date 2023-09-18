const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minLength: [6, "Password must be at least 6 characters"],
      select: true,
    },
    location: { type: String },
    profileUrl: { type: String },
    profession: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    views: [{ type: String }],
    verified: [{ type: Boolean, default: false }],
  },
  { timestamps: true }
);

//Export the model
const Users = mongoose.model("User", userSchema);
module.exports = Users;
