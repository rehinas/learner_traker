const mongoose = require("mongoose");
const users = require("./user");

const addressSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
});

const studentSchema = mongoose.Schema({
  student_name: {
    type: String,
    required: true,
  },
  email_id: {
    type: String,
    unique: true,
    required: true,
  },
  student_address: {
    type: addressSchema,
  },
  phone: {
    type: Number,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  course_status: {
    type: String,
    required: true,
  },
  placement_status: {
    type: String,
    required: true,
  },
  training_head: {
    type: String,
    ref: users,
    required: true,
  },
  placement_officer: {
    type: String,
    ref: users,
  },
});

const studentData = mongoose.model("student", studentSchema);
module.exports = studentData;
