// src/model/School.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolModel = new Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model("School", schoolModel);
