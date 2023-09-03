const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
// require("./connection/mongodb");
const mongoose = require("mongoose");

app.use(express.static(path.join(__dirname, "/build")));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;

// Requiring all routes
const userApi = require("./Routes/users");
const courseApi = require("./Routes/courses");
const batchApi = require("./Routes/batches");
const projectApi = require("./Routes/projects");
const studentApi = require("./Routes/students"); // New route for students
const bulkUploadApi = require("./Routes/bulkUpload"); // New route for bulk upload

app.use("/api", userApi);
app.use("/api", courseApi);
app.use("/api", batchApi);
app.use("/api", projectApi);
app.use("/api", studentApi); // Mounting the student route
app.use("/api", bulkUploadApi); // Mounting the bulk upload route

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongodb_url);
    console.log(`MongoDB  Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
});
