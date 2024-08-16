const express = require("express");
const router = express.Router();
const db = require("../db");
const { sensorEventGerak } = require("./sensorgerak"); // Import the event emitter

sensorEventGerak.on("distance", (distValue) => {
  console.log("Received distValue:", distValue); // Log received value
  let isLampOn = "tidak_menyala";
  let isBuzzerOn = "tidak_menyala";

  if (distValue == 0) {
    return;
  }
  if (distValue < 10) {
    isLampOn = "menyala";
    const query = "INSERT INTO sensor_gerak (distance, readdata_at, status_lampu, status_buzzer) VALUES (?, NOW(), ?, ?)";
    console.log("Executing query for distValue < 10");
    db.query(query, [distValue, isLampOn, isBuzzerOn], (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return;
      }
      console.log("Data inserted for distValue < 10:", results.insertId);
    });
  }

  if (distValue <= 5) {
    isLampOn = "menyala";
    isBuzzerOn = "menyala";
    const query = "INSERT INTO sensor_gerak (distance, status_lampu, status_buzzer,readdata_at) VALUES (?, ?, ?,NOW())";
    console.log("Executing query for distValue <= 5");
    db.query(query, [distValue, isLampOn, isBuzzerOn], (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return;
      }
      console.log("Data inserted for distValue <= 5:", results.insertId);
    });
  }
});

router.get("/logsensorgerak", (req, res) => {
  db.query("SELECT * FROM sensor_gerak ORDER BY readdata_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(results);
  });
});

module.exports = router;
