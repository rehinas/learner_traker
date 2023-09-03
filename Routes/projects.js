const router = require("express").Router();

const projectData = require("../Models/project");
const auth = require("../middleware/Auth");

// get course
router.get("/project", auth, async (req, res) => {
  try {
    let projects = await projectData.find();
    res.json(projects);
  } catch (error) {
    res.json({ message: "Unable to load", err: error.message });
  }
});

//add new course
router.post("/project", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      // console.log(req.body);
      const newProject = projectData(req.body);
      await newProject.save();
      res.json({ message: "Project added successfully" });
    } else {
      res.json({ message: "Access denied" });
    }
  } catch (error) {
    res.json({ message: "Unable to post" });
  }
});

// Delete course

router.delete("/project/:id", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      const { id } = req.params;
      await projectData.findByIdAndDelete(id);
      res.json({ message: "Project deleted successfully" });
    } else {
      res.json({ message: "Access denied" });
    }
  } catch (error) {
    res.json({ message: "unable to delete", err: error.message });
  }
});

module.exports = router;
