const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    requestTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestFrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
