const { Server } = require("socket.io");

// Create a new Socket.IO server instance
const io = new Server(8090, {
  cors: "*", // Allow CORS from all origins for demo purposes
});

// Map to store email to socket ID mapping
const emailToSocketIdMap = new Map();
// Map to store socket ID to email mapping
const socketidToEmailMap = new Map();

// Event handler for new socket connections
io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  // Event handler for when a user joins a room
  socket.on("room:join", (data) => {
    const { email, room } = data;
    // Store the email to socket ID mapping
    emailToSocketIdMap.set(email, socket.id);
    // Store the socket ID to email mapping
    socketidToEmailMap.set(socket.id, email);
    // Emit user:joined event to all clients in the room
    io.to(room).emit("user:joined", { email, id: socket.id });
    // Join the specified room
    socket.join(room);
    // Emit room:join event to the connecting client
    io.to(socket.id).emit("room:join", data);
  });

  // Event handler for initiating a call to another user
  socket.on("user:call", ({ to, offer }) => {
    // Emit incomming:call event to the specified user
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  // Event handler for accepting a call
  socket.on("call:accepted", ({ to, ans }) => {
    // Emit call:accepted event to the specified user
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  // Event handler for signaling the need for negotiation
  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    // Emit peer:nego:needed event to the specified user
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  // Event handler for signaling that negotiation is done
  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    // Emit peer:nego:final event to the specified user
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // Event handler for socket disconnection
  socket.on("disconnect", () => {
    console.log(`Socket Disconnected`, socket.id);
    // Remove mappings when a socket disconnects
    const email = socketidToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
    }
  });
});
