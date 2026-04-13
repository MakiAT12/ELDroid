require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// DB
const conn = new sqlite3.Database("db/school.db");

// Middleware
app.use(cors());
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("API working");
});

// GET ALL
app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students";

  conn.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// GET ONE
app.get("/students/:id", (req, res) => {
  const id = req.params.id;

  conn.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row);
  });
});

// ADD
app.post("/students", (req, res) => {
  const { idno, firstname, lastname, course } = req.body;

  const sql = `
    INSERT INTO students (idno, firstname, lastname, course)
    VALUES (?, ?, ?, ?)
  `;

  conn.run(sql, [idno, firstname, lastname, course], function (err) {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Student added",
      id: this.lastID
    });
  });
});

// UPDATE
app.put("/students", (req, res) => {
  const { id, idno, firstname, lastname, course } = req.body;

  const sql = `
    UPDATE students
    SET idno=?, firstname=?, lastname=?, course=?
    WHERE id=?
  `;

  conn.run(sql, [idno, firstname, lastname, course, id], function (err) {
    if (err) return res.status(500).json(err);

    res.json({ message: "Student updated" });
  });
});

// DELETE
app.delete("/students/:id", (req, res) => {
  const id = req.params.id;

  conn.run("DELETE FROM students WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json(err);

    res.json({ message: "Student deleted" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});