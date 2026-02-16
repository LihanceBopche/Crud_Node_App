const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/auth.middleware");

// GET ALL COURSES
router.get("/", verifyToken, (req, res) => {
  db.query("SELECT * FROM course_master", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Course fetch error");
    }
    res.json(result);
  });
});

module.exports = router;
