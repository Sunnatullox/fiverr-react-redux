import { Router } from "express";
import { verfyToken } from "../middleware/AuthMiddleware.js";
import { getSellerData } from "../controllers/DashboardController.js";

const dashboardRoute = Router()

dashboardRoute.get('/seller', verfyToken, getSellerData)

export default dashboardRoute