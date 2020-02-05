// src/model/Course.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseModel = new Schema({
  school_id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  units: { type: Number, required: true },
  visible: { type: Boolean, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  students: { type: Array, required: true }
});

module.exports = mongoose.model("Course", courseModel);
