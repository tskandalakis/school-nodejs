// src/model/User.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema({
  name: { type: String, required: true },
  school_id: { type: mongoose.Types.ObjectId, required: false },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

module.exports = mongoose.model("User", userModel);
