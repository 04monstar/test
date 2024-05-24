// Libraries and modules
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

// import files
const db = require("./database/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const Room = require("./models/room");
const roomToken = require("./helpers/tokenAndCookie");
require("dotenv").config();

// Create Express app instance
const app = express();

// Set server PORT
const PORT = process.env.PORT || 5000;

// Socket setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Middleware / Routes
app.use("/auth", authRoutes);

// Socket.io event handling
io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ roomId, participants }) => {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }
      // generate token for room
      socket.emit("roomToken", roomToken);

      // room entry
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userName = participants;
      console.log(`${socket.userName} joined room number ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error.message);
      socket.emit("error", "Please try again later");
    }
  });

  // Handle sending messages
  socket.on("sendMessage", (data) => {
    const { roomId, message } = data;
    try {
      io.to(roomId).emit("message", {
        user: socket.userName,
        text: message,
      });
      console.log(`Message sent by ${socket.userName}: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error.message);
      socket.emit("error", "Failed to send message. Please try again later");
    }
  });

  // send code
  socket.on("code", (data) => {
    const { roomId, codeMsg } = data;
    try {
      io.to(roomId).emit("codeMsg", {
        user: socket.userName,
        text: codeMsg,
      });
      roomId.get(roomId).code = newCode;
      console.log(`Message sent by ${socket.userName}: ${codeMsg}`);
    } catch (error) {
      console.error("Error sending code:", error.message);
      socket.emit("error", "Failed to send code. Please try again later");
    }
  });

  // Video call signaling
  socket.on("offer", (data) => {
    try {
      io.to(socket.roomId).emit("offer", data);
      console.log(`Offer sent by ${socket.userName}`);
    } catch (error) {
      console.error("Error sending offer:", error.message);
      socket.emit("error", "Failed to send offer. Please try again later");
    }
  });

  socket.on("answer", (data) => {
    try {
      io.to(socket.roomId).emit("answer", data);
      console.log(`Answer sent by ${socket.userName}`);
    } catch (error) {
      console.error("Error sending answer:", error.message);
      socket.emit("error", "Failed to send answer. Please try again later");
    }
  });

  socket.on("ice-candidate", (data) => {
    try {
      io.to(socket.roomId).emit("ice-candidate", data);
      console.log(`ICE candidate sent by ${socket.userName}`);
    } catch (error) {
      console.error("Error sending ICE candidate:", error.message);
      socket.emit(
        "error",
        "Failed to send ICE candidate. Please try again later"
      );
    }
  });

  // leave room
  socket.on("leaveRoom", async () => {
    try {
      const roomId = socket.roomId;
      socket.leave(roomId);
      console.log(`${socket.userName} has left the room`);
    } catch (err) {
      console.error("Error leaving room:", err.message);
      socket.emit("error", "Failed to leave room. Please try again later");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    try {
      const roomId = socket.roomId;
      socket.leave(roomId);
      console.log(`${socket.userName} has left the room`);
    } catch (error) {
      console.error("Error disconnecting user:", error.message);
    }
  });
});

// Start server and connect to the database
(async () => {
  try {
    await db();
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();
