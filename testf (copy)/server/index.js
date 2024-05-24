const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"], 
  }
});

const PORT = process.env.PORT || 9000;

const rooms = {};

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
    const room = socket.room;
    if (room && rooms[room]) {
      rooms[room].participants = rooms[room].participants.filter((participant) => participant !== socket.id);
      if (rooms[room].participants.length === 0) {
        delete rooms[room];
      }
    }
  });

  // Video call signaling
  socket.on('offer', (data) => {
    socket.to(socket.room).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(socket.room).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(socket.room).emit('ice-candidate', data);
  });

  // Chat messaging
  socket.on('chat message', (msg) => {
    io.to(socket.room).emit('chat message', msg);
  });

  // Join a room
  socket.on('join room', (room) => {
    socket.join(room);
    socket.room = room;
    if (!rooms[room]) {
      rooms[room] = { participants: [] };
    }
    rooms[room].participants.push(socket.id);
    console.log(`${socket.id} joined room ${room}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});