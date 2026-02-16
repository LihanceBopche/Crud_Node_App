const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/student.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// STUDENT LIST (TABLE)
router.get("/list", verifyToken, studentController.getStudentList);

// NEXT ROLL NUMBER
router.get("/next-roll", verifyToken, studentController.getNextRollNo);

// ADD STUDENT
router.post("/add", verifyToken, studentController.addStudent);

// Print Student Bill
router.get("/invoice/:id", verifyToken, studentController.getStudentInvoice);

module.exports = router;
