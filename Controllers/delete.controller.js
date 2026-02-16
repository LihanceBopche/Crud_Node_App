const db = require("../config/db");

exports.deleteStudent = (req, res) => {
  const studentId = req.params.id;

  // CASCADE will delete mappings automatically
  db.query(
    "DELETE FROM students WHERE student_id=?",
    [studentId],
    (err, result) => {
      if (err) return res.status(500).send("Delete error");

      if (result.affectedRows === 0) {
        return res.status(404).send("Student not found");
      }

      res.json({ message: "Student deleted successfully ❌" });
    }
  );
};
