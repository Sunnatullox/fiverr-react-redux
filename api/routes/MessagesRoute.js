import { Router } from "express";
import { verfyToken } from "../middleware/AuthMiddleware.js";
import { addMessage, getMessages, getUnreadMessages, markAsRead, usermessageNotif } from "../controllers/MessagesController.js";


const messagesRoute = Router()

messagesRoute.post("/add-message/:id", verfyToken, addMessage)
messagesRoute.get("/get-messages/:id", verfyToken, getMessages)
messagesRoute.get("/unread-messages", verfyToken, getUnreadMessages)
messagesRoute.put("/mark-as-read/:messageId", verfyToken, markAsRead)
messagesRoute.get("/user-message-notif", verfyToken, usermessageNotif)

export default messagesRoute