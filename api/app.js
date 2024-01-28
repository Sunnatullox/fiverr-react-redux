import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import compression from "compression";

import ErrorHandler from "./middleware/error.js";

dotenv.config();
const app = express();


// import routes
import authRoute from "./routes/AuthRoute.js";
import gigsRoute from "./routes/GigsRoute.js";
import orderRoute from "./routes/OrderRoute.js";
import messagesRoute from "./routes/MessagesRoute.js";
import dashboardRoute from "./routes/DashboardRoute.js";
import categorysRoute from "./routes/CategorysRoute.js";
import wishListRoute from "./routes/WishListRoute.js";
import mongoDb from "./config/db.js";
import bodyParser from "body-parser";
import axios from 'axios'

app.use(morgan("dev"));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.PUBLIC_URL.split(","),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api routes
app.use("/api/auth", authRoute);
app.use("/api/gigs", gigsRoute);
app.use("/api/orders", orderRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/wishList", wishListRoute);
app.use("/api", categorysRoute);


app.use('/images/:filename', async (req, res, next) => {
  try {
    console.log(req.params.filename);
    const response = await axios.get(`https://storage.googleapis.com/fiverr-clone-ff2df.appspot.com/${req.params.filename}`);
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler('Internal Server Error', 403));
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API server responded",
  });
});



mongoDb();

// error handlers
app.use(ErrorHandler);

export default app;
