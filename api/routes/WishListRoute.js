import { Router } from "express";
import {
  addWishListGig,
  getWishListGig,
  removeWishListGig,
} from "../controllers/wishListController.js";
import { verfyToken } from "../middleware/AuthMiddleware.js";

const wishListRoute = Router();

wishListRoute.post("/user-add-wishList", verfyToken, addWishListGig);
wishListRoute.get("/user-get-wishList", verfyToken, getWishListGig);
wishListRoute.delete("/user-delete-wishList/:id", verfyToken, removeWishListGig);

export default wishListRoute;
