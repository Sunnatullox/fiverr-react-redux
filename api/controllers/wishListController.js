import asyncHandler from "express-async-handler";
import WishList from "../models/WishListModel.js";
import User from "../models/UserModel.js";

export const addWishListGig = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { gigId } = req.body;
    const findGig = await WishList.findOne({ gig: gigId });

    if (!findGig) {
      const createWishList = await WishList.create({ user: _id, gig: gigId })
      await User.findByIdAndUpdate(
        { _id: _id },
        {
          $push: { wishList: createWishList._id },
        },
        { new: true }
      );
      const newWishList = await WishList.findById({_id:createWishList._id}).populate("gig").lean();

      res.json(newWishList);
    } else if (findGig) {
      await WishList.deleteOne({ _id: findGig._id });
      await User.findByIdAndUpdate(
        { _id: _id },
        {
          $pull: { wishList: findGig._id },
        },
        { new: true }
      );
      res.status(200).json({ msg: "Deleted gig from wishlist successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export const getWishListGig = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id)
      .populate("wishList")
      .populate({ path: "wishList", populate: { path: "gig" } }).lean();

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const wishList = user.wishList.map((item) => item);
    res.json(wishList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export const removeWishListGig = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingWishListIndex = user.wishList.findIndex(
      (item) => item._id.toString() === id
    );

    if (existingWishListIndex === -1) {
      return res.status(404).json({ message: "WishList not found" });
    }

    const deletedGig = user.wishList.splice(existingWishListIndex, 1)[0].gig;
    await user.save();

    res.json(deletedGig);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
