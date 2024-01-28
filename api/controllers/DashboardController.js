import asyncHandler from "express-async-handler";
import Gig from "../models/GigsModel.js";
import Order from "../models/OrderModel.js";
import Message from "../models/MessagesModel.js";

export const getSellerData = asyncHandler(async (req, res, next) => {
  try {
    const gigs = await Gig.countDocuments({
      createdBy: req.user._id,
    });

    const orders = await Order.aggregate([
      {
        $match: {
          isCompleted: true,
        },
      },
      {
        $lookup: {
          from: "gigs",
          localField: "gig",
          foreignField: "_id",
          as: "gigDetails",
        },
      },
      {
        $match: {
          "gigDetails.createdBy": req.user._id,
        },
      },
      {
        $count: "count",
      },
    ]);

    const unreadMessages = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    const revenue = await Order.aggregate([
      {
        $lookup: {
          from: "gigs",
          localField: "gig",
          foreignField: "_id",
          as: "gigDetails",
        },
      },
      {
        $unwind: "$gigDetails",
      },
      {
        $match: {
          "gigDetails.createdBy": req.user._id,
          isCompleted: true,
          createdAt: { $gte: thisYear },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const dailyRevenue = await Order.aggregate([
      {
        $lookup: {
          from: "gigs",
          localField: "gig",
          foreignField: "_id",
          as: "gigDetails",
        },
      },
      {
        $unwind: "$gigDetails",
      },
      {
        $match: {
          "gigDetails.createdBy": req.user._id,
          isCompleted: true,
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);
 
    const monthlyRevenue = await Order.aggregate([
      {
        $lookup: {
          from: "gigs",
          localField: "gig",
          foreignField: "_id",
          as: "gigDetails",
        },
      },
      {
        $unwind: "$gigDetails",
      },
      {
        $match: {
          "gigDetails.createdBy": req.user._id,
          isCompleted: true,
          createdAt: { $gte: thisMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    return res.json({
      dashboardData: {
        orders: orders.length > 0 && orders[0].count,
        gigs,
        unreadMessages,
        dailyRevenue:dailyRevenue.length > 0 && dailyRevenue[0]?.totalRevenue || 0,
        monthlyRevenue:monthlyRevenue.length > 0 && monthlyRevenue[0]?.totalRevenue || 0,
        revenue:revenue.length > 0 && revenue[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});
