const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Varad5757",
  database: "ev_swap"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected!");
});

// API route
app.post('/api/search-stations', (req, res) => {
  const { city, pincode } = req.body;
  const query = `SELECT * FROM stations WHERE city = ? AND pincode = ?`;
  db.query(query, [city, pincode], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User registered successfully" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ message: "Login successful", user: results[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// app.get("/stations", (req, res) => {
//   const { city, pincode } = req.query;
//   let sql = "SELECT * FROM stations WHERE 1=1";
//   const values = [];

//   if (city) {
//     sql += " AND city LIKE ?";
//     values.push(`%${city}%`);
//   }
//   if (pincode) {
//     sql += " AND pincode = ?";
//     values.push(pincode);
//   }

//   db.query(sql, values, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


app.post("/api/search-stations", (req, res) => {
  const { city, pincode } = req.body;

  if (!city || !pincode) {
    return res.status(400).json({ message: "City and pincode required" });
  }

  const query = `
    SELECT * FROM stations 
    WHERE city = ? AND pincode = ?
  `;

  db.query(query, [city, pincode], (err, results) => {
    if (err) {
      console.error("Error fetching stations:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
});

// Start server
const PORT=3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});