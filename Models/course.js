const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },
});
const courseData = mongoose.model("course", courseSchema);
module.exports = courseData;
