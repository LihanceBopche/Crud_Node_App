const express = require("express");
const router = express.Router();
const deleteController = require("../Controllers/delete.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.delete("/:id", verifyToken, deleteController.deleteStudent);

module.exports = router;
