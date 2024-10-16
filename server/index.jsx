const { Server } = require("socket.io");
const io = new Server(8000, {
  cors: {
    origin: "*", // Update with your allowed origin(s) if necessary
  },
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

// Event listener => (connection)
io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  // Listen for 'room:join' event
  socket.on("room:join", (data) => {
    const { email } = data; // Ensure the data contains the 'email'

    // Map email to socket ID
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    // Emit an event to the specific socket
    io.to(socket.id).emit("room:join", data);

    console.log(`User with email ${email} joined with socket ID: ${socket.id}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket Disconnected: ${socket.id}`);

    const email = socketIdToEmailMap.get(socket.id);

    // Remove entries from the maps
    if (email) {
      emailToSocketIdMap.delete(email);
    }
    socketIdToEmailMap.delete(socket.id);
  });
});

console.log("Socket.IO server is running on port 8000");
