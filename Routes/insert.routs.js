const express = require("express");
const router = express.Router();
const insertController = require("../Controllers/insert.controller");

// FORM submit yahin aayega
router.post("/", insertController.insertStudent);

module.exports = router;
