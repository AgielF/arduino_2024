const express = require("express");
const router = express.Router();
const EventEmitter = require("events");
const sensorEventGerak = new EventEmitter();

router.get("/sensorgerak", (req, res) => {
  res.send("Use socket.io to get real-time data");
});

module.exports = router;
module.exports.sensorEventGerak = sensorEventGerak; // Export the event emitter
