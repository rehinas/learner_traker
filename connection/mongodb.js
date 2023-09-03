const mongoose = require("mongoose");
mongoose
  .connect(process.env.mongodb_url)
  .then(() => {
    console.log("Connected to my DB");
  })
  .catch(() => {
    console.log("Error!! connection lost");
  });
