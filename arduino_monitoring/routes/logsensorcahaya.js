const express = require("express");
const router = express.Router();
const db = require("../db");
const { sensorEvent } = require("./sensorcahaya"); // Import the event emitter

sensorEvent.on("ldrValue", (ldrValue) => {
  if (ldrValue > 900) {
    const query = "INSERT INTO sensor_cahaya (LDR_value, readdata_at) VALUES (?, NOW())";
    db.query(query, [ldrValue], (err, results) => {
      if (err) throw err;
      console.log("Data inserted:", results.insertId);
    });
  }
});

router.get("/logsensorcahaya", (req, res) => {
  db.query("SELECT * FROM sensor_cahaya ORDER BY readdata_at DESC", (err, results) => {
    if (err) throw err;
    4;
    res.json(results);
  });
});

module.exports = router;
