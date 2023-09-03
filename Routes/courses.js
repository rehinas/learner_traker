const router = require("express").Router();

const courseData = require("../Models/course");
const auth = require("../middleware/Auth");

// get course
router.get("/course", auth, async (req, res) => {
  try {
    let courses = await courseData.find();
    res.json(courses);
  } catch (error) {
    res.json({ message: "Unable to load", err: error.message });
  }
});

//add new course
router.post("/course", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      // console.log(req.body);
      const newCourse = courseData(req.body);
      await newCourse.save();
      res.json({ message: "Course added successfully" });
    } else {
      res.json({ message: "Access denied" });
    }
  } catch (error) {
    res.json({ message: "Unable to post" });
  }
});

// Delete course

router.delete("/course/:id", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      const { id } = req.params;
      await courseData.findByIdAndDelete(id);
      res.json({ message: "Course deleted successfully" });
    } else {
      res.json({ message: "Access denied" });
    }
  } catch (error) {
    res.json({ message: "unable to delete", err: error.message });
  }
});

module.exports = router;
