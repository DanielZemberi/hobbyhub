import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { AppDataSource } from "./data-source";
import bodyParser from "body-parser";

AppDataSource.initialize().then(() => {
  const app = express();
  app.use([cors(), bodyParser.json()]);

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const CHAT_BOT = "ChatBot"; // Add this
  let chatRoom = ""; // E.g. javascript, node,...
  const allUsers: any = []; // All users in current chat room

  // Add this
  // Listen for when the client connects via socket.io-client
  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    // We can write our socket event listeners in here...
    socket.on("join_room", (data) => {
      const { username, room } = data; // Data sent from client when join_room event emitted
      socket.join(room); // Join the user to a socket room

      let __createdtime__ = Date.now(); // Current timestamp
      // Send message to all users currently in the room, apart from the user that just joined
      socket.to(room).emit("receive_message", {
        message: `${username} has joined the chat room`,
        username: CHAT_BOT,
        __createdtime__,
      });

      socket.emit("receive_message", {
        message: `Welcome ${username}`,
        username: CHAT_BOT,
        __createdtime__,
      });

      socket.on("send_message", (data) => {
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit("receive_message", data); // Send to all users in room, including sender
      });

      chatRoom = room;
      allUsers.push({ id: socket.id, username, room });
      const chatRoomUsers = allUsers.filter((user: any) => user.room === room);
      socket.to(room).emit("chatroom_users", chatRoomUsers);
      socket.emit("chatroom_users", chatRoomUsers);
    });
  });

  app.get("/", (req, res) => {
    console.log("req", req);
    res.send("Hello world");
  });

  app.post("/interests/:userId/add", (req, res) => {
    const userId = req.params.userId;
    const newInterests = req.body.interests;

    res.status(200).json({
      message: `Interest '${newInterests.join(
        ", "
      )}' added for user '${userId}'.`,
    });
  });

  server.listen(4000, () => "Server is running on port 4000");
});
