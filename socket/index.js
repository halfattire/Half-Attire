const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require("dotenv").config({
  path: "./.env",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world from socket server!");
});

let users = [];
let messages = {}; // Object to track messages sent to each user

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Define a message object with a seen property
const createMessage = ({ senderId, receiverId, text, images }) => ({
  id: Date.now(), // Unique ID for the message
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`A user is connected`);
  }

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });
    const user = getUser(receiverId);

    if (!messages[senderId]) {
      messages[senderId] = [];
    }
    if (!messages[receiverId]) {
      messages[receiverId] = [];
    }

    messages[senderId].push(message);
    messages[receiverId].push(message);

    io.to(user?.socketId).emit("getMessage", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    if (messages[senderId]) {
      const message = messages[senderId].find(
        (message) => message.receiverId === receiverId && message.id === messageId
      );
      if (message) {
        message.seen = true;

        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }
    }
  });

  socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessageId,
    });
  });

  socket.on("disconnect", () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`A user disconnected!`);
    }
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Socket server is running on port ${PORT}`);
});