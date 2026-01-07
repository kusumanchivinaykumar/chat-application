import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" })); 
app.use(cookieParser());
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://chat-application-client1.netlify.app" // Add your new frontend URL here
    ],
    credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Add a default route for the root URL
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

server.listen(PORT, () => {
  console.log("server running on port " + PORT);
  connectDB();
});