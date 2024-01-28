import { Router } from "express";
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
import multer from "multer";

const gigsRoute = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

gigsRoute.post("/add", verfyToken,upload.array("images"), createGigs);
gigsRoute.get("/get-user-gigs", verfyToken, getUserAuthGigs);
gigsRoute.put("/get-popular-gigs", verfyToken, getPopularGigs);
gigsRoute.get("/get-gig-data/:gigId", getSingleGigDate);
gigsRoute.put("/edit-gig/:gigId", verfyToken,upload.array("images"), updateGig);
gigsRoute.get("/search-gigs", searchGigs);
gigsRoute.get("/check-gig-order/:gigId", verfyToken, checkGigOrder);
gigsRoute.post("/add-review/:gigId", verfyToken, addReview);
gigsRoute.delete("/remove-review/:id", verfyToken, removeGigReview);
gigsRoute.delete("/remove-user-gig/:id", verfyToken, adminVerify, deleteUserGig);

export default gigsRoute;
