import { Router } from "express";
import { verfyToken } from "../middleware/AuthMiddleware.js";
import { confirmOrder, createOrder, getBuyerOrders, getSellerOrders, getSillerNotifications, getSillerOrderDetails, sellerUploadFile } from "../controllers/OrderConteroller.js";


const orderRoute = Router()

orderRoute.post('/create', verfyToken, createOrder)
orderRoute.put('/success', verfyToken, confirmOrder)
orderRoute.get('/get-buyer-orders', verfyToken, getBuyerOrders)
orderRoute.get('/get-seller-orders', verfyToken, getSellerOrders)
orderRoute.get('/get-seller-order-notif', verfyToken, getSillerNotifications)
orderRoute.get('/get-seller-order-details/:id', verfyToken, getSillerOrderDetails)
orderRoute.put('/set-order-file-upload/:id', verfyToken, sellerUploadFile)

export default orderRoute