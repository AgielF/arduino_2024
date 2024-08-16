const express = require("express");
const router = express.Router();
const EventEmitter = require("events");
const sensorEvent = new EventEmitter();

router.get("/sensorcahaya", (req, res) => {
  // Handle request to show real-time data (this part will be handled by socket.io)
  res.send("Use socket.io to get real-time data");
});

module.exports = router;
module.exports.sensorEvent = sensorEvent; // Export the event emitter
