const mongoose = require("mongoose");

const batchSchema = mongoose.Schema({
  batch_name: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
});
const batchData = mongoose.model("batch", batchSchema);
module.exports = batchData;
