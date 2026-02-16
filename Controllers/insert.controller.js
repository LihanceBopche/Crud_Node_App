const db = require("../config/db");

exports.insertStudent = (req, res) => {
  // ✅ safe destructuring
  const { rollno, name, email, course } = req.body || {};

  // ✅ validation
  if (!rollno || !name || !email || !course) {
    console.log("REQ BODY 👉", req.body);
    return res.status(400).send("All fields are required");
  }

  const sql =
    "INSERT INTO master (rollno, name, email, course) VALUES (?, ?, ?, ?)";

  db.query(sql, [rollno, name, email, course], (err) => {
    if (err) {
      console.error("DB ERROR 👉", err);
      return res.status(500).send("Database Error");
    }

    // ✅ success
    res.status(201).send("Student inserted successfully ✅");
  });
};
