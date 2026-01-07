import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getMessages, getUsersForSidebar, sendMessage, markMessageAsSeen } from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.put("/send/:id", protectRoute, sendMessage); 
router.put("/mark/:id", protectRoute, markMessageAsSeen);

export default router;
