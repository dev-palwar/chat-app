const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const usersObj = {};

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

io.on("connection", (socket) => {
  console.log(`User connected with id: ${socket.id}`);

  // Register user with a username
  socket.on("register", (username) => {
    usersObj[username] = socket.id;
    console.log(`User registered: ${username}, ID: ${socket.id}`);
  });

  // Handle room creation and joining
  socket.on("room", (userToConnect) => {
    const currentUser = Object.keys(usersObj).find(
      (username) => usersObj[username] === socket.id
    );

    if (currentUser && usersObj[userToConnect]) {
      const roomName = `${currentUser}_${userToConnect}`;

      // Join both users to the room
      socket.join(roomName);
      io.to(usersObj[userToConnect]).emit("roomCreated", roomName); // Notify the other user
      socket.emit("roomCreated", roomName); // Notify the current user

      console.log(`Room created: ${roomName}`);
      // Notify users that they are now connected
      io.to(roomName).emit(
        "notification",
        `You are now connected with ${userToConnect}`
      );
    } else {
      socket.emit("notification", `User ${userToConnect} not found`);
    }
  });

  // Handle messages in the room
  socket.on("message", (roomName, message) => {
    io.to(roomName).emit("message", message);
    console.log(`Message sent in room ${roomName}: ${message}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(usersObj).find(
      (username) => usersObj[username] === socket.id
    );

    if (disconnectedUser) {
      delete usersObj[disconnectedUser];
      console.log(`User ${disconnectedUser} disconnected and removed`);
    }
  });
});

server.listen(9999, () => {
  console.log("Server running smooth on port 9999");
});
