const db = require("../config/db");

/* =========================
   GET STUDENT FOR EDIT
========================= */
exports.getStudentForEdit = (req, res) => {
  const studentId = req.params.id;

  const sql = `
    SELECT 
      s.student_id,
      s.name,
      s.rollno,
      c.course_id
    FROM students s
    JOIN student_courses sc ON s.student_id = sc.student_id
    JOIN course_master c ON sc.course_id = c.course_id
    WHERE s.student_id = ?
  `;

  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).send("Fetch error");

    res.json({
      student_id: studentId,
      name: result[0].name,
      rollno: result[0].rollno,
      courseIds: result.map(r => r.course_id)
    });
  });
};

/* =========================
   UPDATE STUDENT
========================= */
exports.updateStudent = (req, res) => {
  const studentId = req.params.id;
  const { name, courseIds } = req.body;

  if (!name || !courseIds || courseIds.length === 0) {
    return res.status(400).send("All fields required");
  }

  // 1️⃣ Update name
  db.query(
    "UPDATE students SET name=? WHERE student_id=?",
    [name, studentId],
    (err) => {
      if (err) return res.status(500).send("Update error");

      // 2️⃣ Delete old courses
      db.query(
        "DELETE FROM student_courses WHERE student_id=?",
        [studentId],
        (err) => {
          if (err) return res.status(500).send("Delete mapping error");

          // 3️⃣ Insert new courses
          const values = courseIds.map(cid => [studentId, cid]);

          db.query(
            "INSERT INTO student_courses (student_id, course_id) VALUES ?",
            [values],
            (err) => {
              if (err) return res.status(500).send("Insert mapping error");

              res.json({ message: "Student updated successfully ✅" });
            }
          );
        }
      );
    }
  );
};
