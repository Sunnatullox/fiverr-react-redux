import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { config } from "dotenv";
config();

export const verfyToken = async (req, res, next) => {
  let token = null;
  try {
    if (!req.cookies.jwt && !req.headers.authorization) {
      return res.status(401).json({ message: "You must specify authorization" });
    }

    if (typeof req.cookies.jwt === "string") {
      token = JSON.parse(req.cookies.jwt);
    } else if (typeof req.cookies.jwt === "object") {
      token = req.cookies.jwt;
    } else if (req.cookies.jwt === undefined) {
      token = { jwt: req.headers?.authorization?.split(" ")[1] };
    }

    if (!token.jwt) {
      return res.status(500).json({ message: "Not Authorized token expired, Please Login again" });
    }

    const payload = jwt.verify(token.jwt, process.env.JWT_SECRET_KEY);
    if (!payload) {
      return res.status(401).json({ message: "Token is not Valid" });
    }
    const user = await User.findById({ _id: payload?.id }).lean();

    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while verifying token" });
  }
};

export const adminVerify = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role == "ADMIN") {
      next();
    } else {
      res.status(400).json({ message: "You are not granted Admin rights" });
    }
  } catch (error) {
    res.status(500).json({ message: "while verifying" });
  }
};
