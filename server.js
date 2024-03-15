const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

const userLocations = {};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "/admin.html"));
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete userLocations[socket.id];
    io.emit("userLocations", userLocations);
  });

  socket.on("location", (data) => {
    console.log("Latitude:", data.latitude, ", Longitude:", data.longitude);
    userLocations[socket.id] = {
      latitude: data.latitude,
      longitude: data.longitude,
      userAgent: data.userAgent,
      timestamp: data.timestamp,
    };
    io.emit("userLocations", userLocations);
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
