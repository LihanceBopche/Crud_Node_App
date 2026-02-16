const express = require("express");
const router = express.Router();
const updateController = require("../Controllers/update.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// GET student details (for edit popup)
router.get("/:id", verifyToken, updateController.getStudentForEdit);

// UPDATE student
router.put("/:id", verifyToken, updateController.updateStudent);

module.exports = router;
