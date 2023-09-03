const router = require("express").Router();

const batchData = require("../Models/batch");
const auth = require("../middleware/Auth");

// get batch
router.get("/batch", auth, async (req, res) => {
  try {
    let courses = await batchData.find();
    res.json(courses);
  } catch (error) {
    res.json({ message: "Unable to load", err: error.message });
  }
});

//add new batch
router.post("/batch", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      // console.log(req.body);
      const newBatch = batchData(req.body);
      await newBatch.save();
      res.json({ message: "Batch added successfully" });
    } else {
      res.json({ message: "Access denied" });
    }
  } catch (error) {
    res.json({ message: "Unable to post" });
  }
});

// update batch
// router.put("/batch/:id", async (req, res) => {
//   try {
//     console.log(req.body);
//     const { id } = req.params;
//     await batchData.findByIdAndUpdate(id, req.body);
//     res.json({ message: "batch info updated Successfully" });
//   } catch (error) {
//     res.json({ message: "unable to update", err: error.message });
//   }
// });

// Delete course

router.delete("/batch/:id", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      const { id } = req.params;
      await batchData.findByIdAndDelete(id);
      res.json({ message: "Batch deleted successfully" });
    } else {
      res.json({ message: "Access denied" });
    }
  } catch (error) {
    res.json({ message: "unable to delete", err: error.message });
  }
});

module.exports = router;
