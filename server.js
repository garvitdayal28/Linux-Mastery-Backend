import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import { spawnPty } from "./ptylogic.js";

const app = express();
const port = process.env.PORT

// 1. Convert the comma-separated string into a clean array
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(url => url.trim().replace(/\/$/, "")) 
  : [];

const server = http.createServer(app);

// 2. Updated Socket.io CORS config to accept the array
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("terminal-input", (data) => {
    console.log("key strokes", data);
  });
    
  spawnPty(socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.engine.on("connection_error", (err) => {
  console.log("Socket Engine Error:", err.req ? `Origin: ${err.req.headers.origin}` : err.message);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Allowed Origins:", allowedOrigins); // Added for easy debugging on AWS
});