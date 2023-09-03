const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
});
const projectData = mongoose.model("project", projectSchema);
module.exports = projectData;
