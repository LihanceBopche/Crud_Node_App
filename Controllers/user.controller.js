const db = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_secret_key";

exports.loginUser = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).send("Email and password required");
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    // 🔐 JWT create
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token
    });
  });
};
