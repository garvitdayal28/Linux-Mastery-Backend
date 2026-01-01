import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import {spawnPty} from "./ptylogic.js";

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_URL],
  },
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("terminal-input", (data) => {
    console.log("key strokes", data);
  }),
    
  spawnPty(socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
