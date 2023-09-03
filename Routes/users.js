const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userData = require("../Models/user");
const auth = require("../middleware/Auth");
const bcrypt = require("bcrypt");
const saltRounds = 10;
userData.collection
  .createIndex({ username: 1 }, { unique: true })
  .then(() => console.log("Unique index created on username field"))
  .catch((err) => console.error("Error creating unique index:", err));

// View Trainer and placement officer
router.get("/user", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      let users = await userData.find();
      res.json(users);
    } else {
      res.json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.json({ message: "Unable to load", err: error.message });
  }
});

// Getting list of trainers/placement officers
router.get("/user/:designation", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin" || req.body.role === "Training_head") {
      let { designation } = req.params;
      // console.log(designation);
      let users = await userData.find({ designation: designation });
      if (users.length !== 0) {
        res.json(users);
      }
    } else {
      res.json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.json({ message: "Unable to load", err: error.message });
  }
});

// view only one
router.get("/userid/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userData.findById(id);
    // console.log(user);
    if (user) res.json(user);
  } catch (error) {
    res.json({ message: "unable to find", err: error.message });
  }
});

// Adding trainer and placement officer
router.post("/user", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      // console.log(req.body);
      // Check if the username already exists
      const existingUser = await userData.findOne({
        username: req.body.username,
      });
      if (existingUser) {
        return res.json({
          message:
            "Username already exists. Please choose a different username.",
        });
      }
      const password = req.body.password;
      bcrypt
        .hash(password, saltRounds)
        .then(function (hash) {
          req.body.password = hash;

          const newUser = userData(req.body);
          newUser.save();
          res.json({ message: "User added successfully" });
        })
        .catch((err) => {
          console.log("Hash not generated");
        });
    } else {
      res.json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.json({ message: "Unable to post" });
  }
});

// Update user info
router.put("/user/:id", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      const { id } = req.params;

      bcrypt
        .hash(req.body.password, saltRounds)
        .then(function (hash) {
          req.body.password = hash;

          userData.findByIdAndUpdate(id, { $set: req.body }).exec();
          res.json({ message: "User info updated Successfully" });
        })
        .catch((err) => {
          console.log("Hash not generated");
        });
    } else {
      res.json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.json({ message: "unable to update", err: error.message });
  }
});

// Updating the course/batch array upon selecting as substitute
router.put("/user/:username/:designation", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      let { username, designation } = req.params;
      if (designation === "Training_head") {
        await userData.updateOne(
          { username: username },
          { $addToSet: { course: req.body } }
        );
        res.json({ message: "User info updated Successfully" });
      } else if (designation === "Placement_officer") {
        await userData.updateOne(
          { username: username },
          { $addToSet: { batch: req.body } }
        );
        res.json({ message: "User info updated Successfully" });
      }
    } else {
      res.json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: "unable to update", err: error.message });
  }
});

//Delete user

router.delete("/user/:id", auth, async (req, res) => {
  try {
    if (req.body.role === "Admin") {
      const { id } = req.params;
      await userData.findByIdAndDelete(id);
      res.json({ message: "User deleted successfully" });
    } else {
      res.json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.json({ message: "unable to delete", err: error.message });
  }
});

// login router

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let user = await userData.findOne({
    username: username,
  });
  // console.log(user);
  if (!user) res.json({ message: "User not found" });
  try {
    bcrypt.compare(password, user.password).then(function (result) {
      // result == true
      if (result) {
        jwt.sign(
          { email: username, id: user._id, role: user.designation },
          "ictklt",
          { expiresIn: "1d" },
          (err, token) => {
            if (err) {
              res.json({ message: "token not generated" });
            } else {
              res.json({
                message: "Login Successfully",
                token: token,
                data: user,
              });
            }
          }
        );
      } else {
        res.json({ message: "Login failed" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
