import { Router } from "express";
import multer from 'multer'
import {
  getUserInfo,
  login,
  setUserImage,
  setUserInfo,
  signInGoogleAuth,
  signUp,
  userRoleEdit,
} from "../controllers/AuthController.js";
import { verfyToken } from "../middleware/AuthMiddleware.js";

const authRoute = Router();

const upload =multer({dest:"uploads/profiles/"})

authRoute.post("/signup", signUp);
authRoute.post("/login", login);
authRoute.post("/signin-google-auth", signInGoogleAuth);
authRoute.post("/get-user-info", verfyToken, getUserInfo);
authRoute.post("/set-user-info", verfyToken, setUserInfo);
authRoute.put("/set-user-role", verfyToken, userRoleEdit);
authRoute.post("/set-user-image", verfyToken, upload.single("images"), setUserImage);

export default authRoute;
