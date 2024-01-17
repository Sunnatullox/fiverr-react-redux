import { Router } from "express";
import multer from "multer";
import { adminVerify, verfyToken } from "../middleware/AuthMiddleware.js";
import {
  addReview,
  checkGigOrder,
  createGigs,
  deleteUserGig,
  getPopularGigs,
  getSingleGigDate,
  getUserAuthGigs,
  removeGigReview,
  searchGigs,
  updateGig,
} from "../controllers/GigsController.js";

const gigsRoute = Router();
const uploads = multer({ dest: "uploads/" });

gigsRoute.post("/add", verfyToken, uploads.array("images"), createGigs);
gigsRoute.get("/get-user-gigs", verfyToken, getUserAuthGigs);
gigsRoute.put("/get-popular-gigs", verfyToken, getPopularGigs);
gigsRoute.get("/get-gig-data/:gigId", getSingleGigDate);
gigsRoute.put("/edit-gig/:gigId", verfyToken,uploads.array("images"), updateGig);
gigsRoute.get("/search-gigs", searchGigs);
gigsRoute.get("/check-gig-order/:gigId", verfyToken, checkGigOrder);
gigsRoute.post("/add-review/:gigId", verfyToken, addReview);
gigsRoute.delete("/remove-review/:id", verfyToken, removeGigReview);
gigsRoute.delete("/remove-user-gig/:id", verfyToken, adminVerify, deleteUserGig);

export default gigsRoute;
