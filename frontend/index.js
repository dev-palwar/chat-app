const socket = io();
const username = prompt("Enter your name");

// Emit registration event
socket.emit("register", username);

let currentRoom = null;

// Connect to another user (create a chat room)
document.getElementById("connectToUser").addEventListener("click", () => {
  const userToConnect = document.getElementById("userToConnect").value.trim();
  if (userToConnect) {
    socket.emit("room", userToConnect);
  }
});

// Handle notifications from the server
socket.on("notification", (message) => {
  const noNameDiv = document.getElementById("noName");
  noNameDiv.textContent = message;
});

// Handle incoming messages
socket.on("message", (message) => {
  const messagesDiv = document.querySelector(".messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.textContent = message;
  messagesDiv.appendChild(messageElement);
});

// Send message to the current room
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the form from submitting normally
  const input = document.getElementById("input");
  const message = input.value.trim();
  input.value = ""; // Clear the input field

  if (message && currentRoom) {
    socket.emit("message", currentRoom, message);
  }
});

// Update room name when connected
socket.on("roomCreated", (roomName) => {
  currentRoom = roomName;
});
