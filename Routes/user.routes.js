const express = require("express");
const router = express.Router();

const userController = require("../Controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// LOGIN
router.post("/login", userController.loginUser);

// PROTECTED ROUTE
// router.get("/profile", verifyToken, (req, res) => {
//   res.json({
//     email: req.user.email
//   });
// });

module.exports = router;
