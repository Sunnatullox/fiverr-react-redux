import { model } from "mongoose";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Gig from "../models/GigsModel.js";
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";

const stripe = new Stripe("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.gigId) {
      res.status(400);
      throw new Error("You must provide a valid gigId");
    }

    const { gigId } = req.body;
    const gig = await Gig.findById({ _id: gigId });

    if (!gig) {
      res.status(404);
      throw new Error("Gig not found");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    const order = new Order({
      paymentIntent: paymentIntent.id,
      price: gig.price,
      buyer: req.user._id,
      gig: gigId,
    });

    await order.save();
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export const confirmOrder = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.paymentIntent) {
      res.status(400);
      throw new Error("Payment intent missing from request body object");
    }
    const { paymentIntent } = req.body;
    const order = await Order.findOneAndUpdate(
      { paymentIntent },
      {
        isCompleted: true,
      },
      { new: true }
    );
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { orders: order._id },
      },
      { new: true }
    );
    await Gig.findByIdAndUpdate(
      order.gig,
      { $push: { orders: order._id } },
      { new: true }
    );

    res.status(200).send("Payment intent has been updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export const getBuyerOrders = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.user;

    const orders = await Order.find({
      buyer: _id,
      isCompleted: true,
    }).populate("gig");

    res.json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export const getSellerOrders = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.user;

    const findOrder = await Order.find({ isNotification: true });
    for (let index = 0; index < findOrder.length; index++) {
      const element = findOrder[index];
      const order = await Order.findById(element._id);
      order.isNotification = false;
      await order.save();
    }

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "gigs",
          localField: "gig",
          foreignField: "_id",
          as: "gig",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $match: {
          "gig.createdBy": _id,
          isCompleted: true,
        },
      },
    ]);

    res.json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export const getSillerNotifications = asyncHandler(async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role === "SELLER") {
      const orderNotif = await Order.aggregate([
        {
          $lookup: {
            from: "gigs",
            localField: "gig",
            foreignField: "_id",
            as: "gig",
          },
        },
        {
          $unwind: "$gig",
        },
        {
          $lookup: {
            from: "users",
            localField: "buyer",
            foreignField: "_id",
            as: "buyer",
          },
        },
        {
          $unwind: "$buyer",
        },
        {
          $match: {
            "gig.createdBy": _id,
            isNotification: true,
            isCompleted: true,
          },
        },
      ]);
      res.json(orderNotif);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.log(first);
    throw new Error("Internal Server Error");
  }
});

export const getSillerOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const gigDetails = await Order.findById(id).populate("gig buyer");
    gigDetails.isNotification = false;
    await gigDetails.save();
    res.json(gigDetails);
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error.");
  }
});

export const sellerUploadFile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { file, fileTitle } = req.body;
    const uploadFile = await Order.findByIdAndUpdate(
      id,
      {
        $push: {
          orderFile: { file, fileTitle },
        },
      },
      { new: true }
    );
    res.json(uploadFile);
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error.");
  }
});
