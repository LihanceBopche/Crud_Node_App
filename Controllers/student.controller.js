const db = require("../config/db");

/* ===========================
   STUDENT LIST WITH COURSES
=========================== */
exports.getStudentList = (req, res) => {
  const sql = `
    SELECT 
      s.student_id,
      s.name,
      s.rollno,
      GROUP_CONCAT(c.course_name) AS courses,
      SUM(c.fees) AS total_fees
    FROM students s
    JOIN student_courses sc ON s.student_id = sc.student_id
    JOIN course_master c ON sc.course_id = c.course_id
    GROUP BY s.student_id
  `;
/*

SELECT student_id, name, rollno FROM students;
SELECT student_id, course_id FROM student_courses;
SELECT course_id, course_name, fees FROM course_master;
SELECT c.course_name, c.fees FROM course_master c JOIN student_courses sc ON c.course_id = sc.course_id WHERE sc.student_id = 1;
*/


  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Student list error");
    }
    res.json(result);
  });
};


 //  NEXT ROLL NUMBER
 
exports.getNextRollNo = (req, res) => {
  const sql =
    "SELECT rollno FROM students ORDER BY student_id DESC LIMIT 1";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Roll error");

    let nextRoll = "ROLL001";

    if (result.length > 0) {
      const last = parseInt(result[0].rollno.replace("ROLL", ""));
      nextRoll = "ROLL" + String(last + 1).padStart(3, "0");
    }

    res.json({ rollno: nextRoll });
  });
};

 //  ADD STUDENT (MAIN LOGIC) //


exports.addStudent = (req, res) => {
  const { name, courseIds } = req.body;

  if (!name || !courseIds || courseIds.length === 0) {
    return res.status(400).send("All fields required");
  }

  // 1️⃣ Generate roll
  const rollSql =
    "SELECT rollno FROM students ORDER BY student_id DESC LIMIT 1";

  db.query(rollSql, (err, rollResult) => {
    if (err) return res.status(500).send("Roll fetch error");

    let rollno = "ROLL001";
    if (rollResult.length > 0) {
      const last = parseInt(rollResult[0].rollno.replace("ROLL", ""));
      rollno = "ROLL" + String(last + 1).padStart(3, "0");
    }

    // 2️⃣ Insert student
    db.query(
      "INSERT INTO students (name, rollno) VALUES (?,?)",
      [name, rollno],
      (err, stuResult) => {
        if (err) return res.status(500).send("Student insert error");

        const studentId = stuResult.insertId;

        // 3️⃣ Insert mapping
        const values = courseIds.map(cid => [studentId, cid]);

        db.query(
          "INSERT INTO student_courses (student_id, course_id) VALUES ?",
          [values],
          (err) => {
            if (err) return res.status(500).send("Mapping error");

            res.json({
              message: "Student added successfully ✅",
              rollno
            });
          }
        );
      }
    );
  });
};

/* =========================
   STUDENT INVOICE DATA
========================= */
exports.getStudentInvoice = (req, res) => {
  const studentId = req.params.id;

  const sql = `
    SELECT 
      s.student_id,
      s.name,
      s.rollno,
      c.course_name,
      c.fees
    FROM students s
    JOIN student_courses sc ON s.student_id = sc.student_id
    JOIN course_master c ON sc.course_id = c.course_id
    WHERE s.student_id = ?
  `;

  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).send("Invoice fetch error");

    res.json(result);
  });
};

