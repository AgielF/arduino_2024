const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch all records from histori_keseluruhan
router.get("/histori", (req, res) => {
  db.query("SELECT * FROM histori_keseluruhan ORDER BY readdata_at DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Insert a new record into histori_keseluruhan
router.post("/histori", (req, res) => {
  const { id_sensor_cahaya, id_sensor_gerak } = req.body;

  if (!id_sensor_cahaya || !id_sensor_gerak) {
    return res.status(400).json({ error: "id_sensor_cahaya and id_sensor_gerak are required" });
  }

  const query = "INSERT INTO histori_keseluruhan (id_sensor_cahaya, id_sensor_gerak, readdata_at) VALUES (?, ?, NOW())";
  db.query(query, [id_sensor_cahaya, id_sensor_gerak], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Record inserted successfully", insertId: results.insertId });
  });
});

// Delete a record from histori_keseluruhan by ID
router.delete("/histori/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM histori_keseluruhan WHERE id_histori_keseluruhan = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "No record found with the given ID" });
    }
    res.json({ message: "Record deleted successfully" });
  });
});

module.exports = router;
