const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const db = require("./db"); // Import database connection
const { sensorEvent } = require("./routes/sensorcahaya"); // Import the event emitter
const { sensorEventGerak } = require("./routes/sensorgerak");

// Initialize express and socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the view directory
app.use(express.json());
app.use(express.static(__dirname + "/view"));

// Import routes
const sensorRoutes = require("./routes/sensorcahaya");
const logRoutes = require("./routes/logsensorcahaya");
const sensorgerak = require("./routes/sensorgerak");
const logSensorGerak = require("./routes/logsensorgerak");
const histori = require("./routes/histori");
// Use routes
app.use(sensorRoutes);
app.use(logRoutes);
app.use(sensorgerak);
app.use(logSensorGerak);
app.use(histori);

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("terhubung...");
  socket.on("disconnect", () => {
    console.log("terputus....");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("server on...");
});

// Configure the serial port
const port = new SerialPort({
  path: "COM4",
  baudRate: 9600,
});

// Error handling for serial port
port.on("error", (err) => {
  console.error("Error opening serial port:", err.message);
  if (err.message.includes("Access denied")) {
    console.error("Akses ke port COM4 ditolak. Pastikan tidak ada aplikasi lain yang menggunakan port ini.");
  }
  // Additional handling like retry logic or notifying the user can be added here
});

// Parse incoming data from the Arduino
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// Handle data received from Arduino
parser.on("data", (result) => {
  // console.log("data dari arduino ->", result);
  io.emit("data", { data: result });

  if (result.startsWith("LDR:")) {
    const ldrValue = parseInt(result.split(":")[1], 10);
    sensorEvent.emit("ldrValue", ldrValue); // Emit the event with ldrValue
  } else if (result.startsWith("DIST:")) {
    const distance = parseInt(result.split(":")[1], 10);
    sensorEventGerak.emit("distance", distance); // Emit the event with distance
  }
});
