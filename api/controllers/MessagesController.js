import asyncHandler from "express-async-handler";
import Message from "../models/MessagesModel.js";
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";

export const addMessage = asyncHandler(async (req, res) => {
  try {
    if (!req.body.recipentId || !req.body.message || !req.params.id) {
      return next(new ErrorHandler("Missing required fields.",400));
    }

    const message = new Message({
      sender: req.user._id,
      recipient: req.body.recipentId,
      order: req.params.id,
      text: req.body.message,
    });

    await message.save();
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: { messagesReceived: message._id },
      }
    );
    await Order.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { messages: message._id },
      },
      { new: true }
    );
    return res.json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id) {
      return next(new ErrorHandler("Missing required fields.",400));
    }

    const messages = await Message.find({ order: req.params.id })
      .sort({ createdAt: -1 })
      .exec();

    await Message.updateMany(
      { order: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    ).exec();

    const order = await Order.findById(req.params.id)
      .populate("gig")
      .populate({ path: "gig", populate: { path: "createdBy" } })
      .lean();

    let recipient;
    if (order.buyer.toHexString() === req.user._id.toHexString()) {
      recipient = order.gig.createdBy._id;
    } else if (
      order.gig.createdBy._id.toHexString() === req.user._id.toHexString()
    ) {
      recipient = order.buyer;
    }
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: { messagesRecieved: recipient },
      }
    );

    return res.json({ messages: messages || [], recipient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export const getUnreadMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      recipient: req.user._id,
      isRead: false,
    })
      .populate("sender")
      .exec();

    return res.json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export const markAsRead = asyncHandler(async (req, res) => {
  try {
    if (!req.params.messageId) {
      res.status(400);
      return next(new ErrorHandler("Message ID is required",400));
    }

    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return next(new ErrorHandler("Message not found",400));
    }

    return res.json({ message: "Message marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const usermessageNotif = asyncHandler(async (req, res) => {
try {
  const unreadMessages = await Message.find({
    recipient: req.user._id,
    isRead: false,
  }).populate("sender order").lean();
  res.json(unreadMessages);
} catch (error) {
  return next(new ErrorHandler("Internal server error",400));
}
})
