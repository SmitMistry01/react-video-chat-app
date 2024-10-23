const { Server } = require("socket.io");
const io = new Server(8000, {
  cors: {
    origin: "*",
  },
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  // Listen for 'room:join' event
  socket.on("room:join", (data) => {
    const { email,room } = data; //destructure

    // Map email to socket ID
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    // Emit an event to the specific socket
    // to all clients in room1 except the sender
    io.to(room).emit("user:joined", {email,id:socket.id});
    socket.join(room);

    //ok we got the details of the user who can join the room
    io.to(socket.id).emit("room:join",data);
    console.log(`User with email ${email} joined with socket ID: ${socket.id}`);
  });
 //user:call event listerner for connection between peers
  socket.on("user:call",({to,offer}) =>
  {
    io.to(to).emit("incoming:call",{from:socket.id,offer});
  })
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

//Use io.to() when you want to send a message to everyone in the room, 
//possibly including the sender

//Use socket.to() when you want to broadcast to everyone else except the sender