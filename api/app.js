import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import compression from "compression";

const app = express();
dotenv.config();

// import routes
import authRoute from "./routes/AuthRoute.js";
import gigsRoute from "./routes/GigsRoute.js";
import orderRoute from "./routes/OrderRoute.js";
import messagesRoute from "./routes/MessagesRoute.js";
import dashboardRoute from "./routes/DashboardRoute.js";
import categorysRoute from "./routes/CategorysRoute.js";
import { errorHandler, notFound } from "./middleware/ErrorHandler.js";
import wishListRoute from "./routes/WishListRoute.js";
import mongoDb from './config/db.js'


app.use(morgan("dev"));
app.use(compression())
app.use(
  cors({
    origin: [process.env.PUBLIC_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads/categorys"));

// api routes
app.use("/api/auth", authRoute);
app.use("/api/gigs", gigsRoute);
app.use("/api/orders", orderRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/wishList", wishListRoute);
app.use("/api", categorysRoute);

mongoDb()

// error handlers
app.use(notFound);
app.use(errorHandler);
 
export default app