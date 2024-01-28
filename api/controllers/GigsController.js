import asyncHandler from "express-async-handler";
import { existsSync, renameSync, unlinkSync } from "fs";
import Gig from "../models/GigsModel.js";
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Review from "../models/ReviewsModel.js";
import Message from "../models/MessagesModel.js";
import Category from "../models/CategorysModel.js";
import SubCategory from "../models/SubCategorysModel.js";
import { deleteFileFromFirebaseStorage, uploadFileToFirebaseStorage } from "../utils/firebase.js";
import ErrorHandler from "../middleware/ErrorHandler.js";

export const createGigs = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files || !req.body) {
      return next(new ErrorHandler("All properties should be required"), 400);
    }

    const fileNames = [];

    for (let image of req.files) {
      const imageUrl = await uploadFileToFirebaseStorage(image);
      fileNames.push(imageUrl);
    }
    const {
      title,
      description,
      category,
      features,
      price,
      revisions,
      time,
      shortDesc,
      subCategory,
    } = req.body;

    const { _id } = req.user;
    const user = await User.findById({ _id: _id });

    const gig = new Gig({
      title,
      description,
      deliveryTime: parseInt(time),
      category,
      subCategory,
      features: features.split(","),
      price: parseInt(price),
      shortDesc,
      revisions: parseInt(revisions),
      createdBy: _id,
      images: fileNames,
    });

    await gig.save();
    user.gigs.push(gig._id);
    await user.save();
    return res.status(201).json("Successfully created the Gig");
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const getUserAuthGigs = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("gigs")
      .populate({
        path: "gigs",
        populate: {
          path: "createdBy",
        },
      });
    return res.status(200).json({ gigs: user.gigs ?? [] });
  } catch (error) {
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const getSingleGigDate = asyncHandler(async (req, res, next) => {
  try {
    if (!req.params.gigId) {
      res.status(400);
      return next(
        new ErrorHandler("Gig ID must be provided in the request"),
        400
      );
    }

    const gig = await Gig.findById(req.params.gigId)
      .populate("createdBy reviews")
      .populate({
        path: "reviews",
        populate: { path: "reviewer", options: { strictPopulate: false } },
      });

    const userWithGigs = await User.findById(gig.createdBy._id)
      .populate("gigs")
      .populate({
        path: "gigs",
        populate: { path: "reviews" },
      })
      .populate({ path: "reviews", populate: { path: "reviewer" } });

    const gigs = Array.isArray(userWithGigs.gigs) ? userWithGigs.gigs : [];

    const totalReviews = gigs.reduce((acc, gig) => acc + gig.reviews.length, 0);
    const averageRating =
      totalReviews > 0
        ? (
            gigs.reduce(
              (acc, gig) =>
                acc +
                gig.reviews.reduce((sum, review) => {
                  return sum + parseInt(review.rating);
                }, 0),
              0
            ) / totalReviews
          ).toFixed(1)
        : 0;

    return res.json({
      gig: {
        ...gig.toObject(),
        totalReviews,
        averageRating: averageRating !== "NaN" ? averageRating : 0,
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const updateGig = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files)
      return next(new ErrorHandler("All properties should be required"), 400);

    const imageOld = JSON.parse(req.body?.oldImages)
    const fileNames = imageOld.length > 0 ?  [...imageOld] : [];

    for (let file of req.files) {
      const images = await uploadFileToFirebaseStorage(file);
      fileNames.push(images);
    }
    const {
      title,
      description,
      category,
      features,
      price,
      revisions,
      time,
      shortDesc,
      subCategory
    } = req.body;

    if (!req.body)
      return next(new ErrorHandler("Gigs require a query parameter"), 400);
    const { _id } = req.user;

    const oldGig = await Gig.findById(req.params.gigId);

    await Gig.findByIdAndUpdate(
      req.params.gigId,
      {
        title: title || oldGig.title,
        description: description || oldGig.description,
        deliveryTime: parseInt(time) || oldGig.deliveryTime,
        category: category || oldGig.category,
        subCategory: subCategory || oldGig.subCategory, 
        features: features.split(',') || oldGig.features,
        price: parseInt(price) || oldGig.price,
        shortDesc: shortDesc || oldGig.shortDesc,
        revisions: parseInt(revisions) || oldGig.revisions,
        createdBy: _id,
        images: fileNames,
      },
      { new: true }
    );

     const removeImage =  await compareArrays(imageOld, oldGig.images)
     for(let item of removeImage){
      await deleteFileFromFirebaseStorage(item.public_id)
     }

    return res.status(200).json("Successfully updated the Gig");
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const searchGigs = asyncHandler(async (req, res, next) => {
  const {
    searchTerm,
    category,
    subCategory,
    minPrice,
    maxPrice,
    rating,
    page,
    limitGig,
  } = req.query;
  const limit = limitGig || 9;
  const currentPage = page || 1;
  if (!searchTerm && !category && !subCategory) {
    return next(
      new ErrorHandler(
        "Search term must be specified for the Gig search term."
      ),
      400
    );
  }

  try {
    let searchQuery = {};

    if (category && !subCategory) {
      const searchCateg = await Category.findOne({ slug: category })
        .populate("subCategorys")
        .lean();

      searchQuery = searchQueryService(
        searchTerm,
        category,
        minPrice,
        maxPrice,
        rating,
        subCategory
      );

      const count = await Gig.aggregate([
        ...aggregateQueryCount(
          searchTerm,
          category,
          minPrice,
          maxPrice,
          rating,
          subCategory
        ),
      ]);
      const totalGigs = count.length > 0 ? count[0].totalGigs : 0;
      const totalPages = Math.ceil(totalGigs / limit);
      const offset = (currentPage - 1) * limit;

      const searchGig = await Gig.aggregate([
        ...searchQuery,
        { $skip: offset },
        { $limit: limit },
      ]);

      return res.json({
        gigs: searchGig,
        category: searchCateg,
        totalGigs,
        totalPages,
      });
    } else if (subCategory && !category) {
      const searchSubCateg = await SubCategory.findOne({ slug: subCategory })
        .populate({
          path: "category",
          populate: {
            path: "subCategorys",
          },
        })
        .lean();

      searchQuery = searchQueryService(
        searchTerm,
        category,
        minPrice,
        maxPrice,
        rating,
        subCategory
      );

      const count = await Gig.aggregate([
        ...aggregateQueryCount(
          searchTerm,
          category,
          minPrice,
          maxPrice,
          rating,
          subCategory
        ),
      ]);
      const totalGigs = count.length > 0 ? count[0].totalGigs : 0;
      const totalPages = Math.ceil(totalGigs / limit);
      const offset = (currentPage - 1) * limit;

      const searchGig = await Gig.aggregate([
        ...searchQuery,
        { $skip: offset },
        { $limit: limit },
      ]);

      return res.json({
        gigs: searchGig,
        subCategory: {
          ...searchSubCateg.category,
          itemSubCateg: searchSubCateg,
        },
        totalGigs,
        totalPages,
      });
    } else {
      searchQuery = searchQueryService(
        searchTerm,
        category,
        minPrice,
        maxPrice,
        rating,
        subCategory
      );

      const count = await Gig.aggregate([
        ...aggregateQueryCount(
          searchTerm,
          category,
          minPrice,
          maxPrice,
          rating,
          subCategory
        ),
      ]);
      const totalGigs = count.length > 0 ? count[0].totalGigs : 0;
      const totalPages = Math.ceil(totalGigs / limit);
      const offset = (currentPage - 1) * limit;

      const searchGig = await Gig.aggregate([
        ...searchQuery,
        { $skip: offset },
        { $limit: limit },
      ]);

      res.json({ gigs: searchGig, totalGigs, totalPages });
    }
  } catch (error) {
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const checkGigOrder = asyncHandler(async (req, res) => {
  try {
    if (!req.params.gigId) {
      return res.status(400).json({ error: "You must specify a valid gig ID" });
    }

    const hasUserOrderedGig = await Order.findOne({
      buyer: req.user._id,
      gig: req.params.gigId,
      isCompleted: true,
    });
    return res.json({ hasUserOrderedGig: hasUserOrderedGig ? true : false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export const addReview = asyncHandler(async (req, res) => {
  try {
    if (!req.params.gigId) {
      return res.status(400).json({ error: "You must specify a valid gig ID" });
    }

    const hasUserOrderedGig = await Order.findOne({
      buyer: req.user._id,
      gig: req.params.gigId,
      isCompleted: true,
    });

    if (!hasUserOrderedGig) {
      return res
        .status(401)
        .json({ error: "You must have already ordered this gig" });
    }

    if (!req.body.reviewText || !req.body.rating) {
      return res
        .status(401)
        .json({ error: "You must specify a review text and rating" });
    }

    const { reviewText, rating } = req.body;

    const createReview = await Review.create({
      rating,
      reviewText,
      reviewer: req.user._id,
      gig: req.params.gigId,
    });
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: { reviews: createReview._id },
      }
    );
    await Gig.findByIdAndUpdate(
      { _id: req.params.gigId },
      {
        $push: { reviews: createReview._id },
      }
    );
    const newReview = await Review.findById({ _id: createReview._id })
      .populate("reviewer")
      .lean();

    return res.json({ newReview });
  } catch (error) {
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const getPopularGigs = asyncHandler(async (req, res) => {
  try {
    const { categs } = req.body;

    const matchStage = {};
    if (categs?.length > 0) {
      matchStage.category = { $in: categs };
    }

    const gigsCount = await Gig.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $unwind: "$reviews",
      },
      {
        $match: {
          "reviews.rating": { $gte: 4, $lte: 5 },
          ...matchStage,
        },
      },
      {
        $count: "gigsCount",
      },
    ]);

    const skip = Math.floor(Math.random() * gigsCount[0]?.gigsCount);

    const gigs = await Gig.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $match: {
          "reviews.rating": { $gte: 4, $lte: 5 },
          ...matchStage,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: 15,
      },
    ]);

    return res.json(gigs);
  } catch (error) {
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const removeGigReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (deletedReview) {
      res.json({ msg: "Review deleted successfully" });
    } else {
      res.status(404).json({ msg: "Review not found" });
    }
  } catch (error) {
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

export const deleteUserGig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = req.user.role;
  try {
    if (role !== "ADMIN") {
      return next(
        new ErrorHandler("You must have admin privileges to delete a gig"),
        400
      );
    }
    if (!id) {
      return next(new ErrorHandler("Gig ID not specified"), 400);
    }

    const gig = await Gig.findById(id).populate("orders");

    if (!gig) {
      return next(new ErrorHandler("No such gig found, please try again"), 400);
    }

    const orderIds = gig.orders.map((order) => order._id);

    await Message.deleteMany({ order: { $in: orderIds } });
    await Order.deleteMany({ _id: { $in: orderIds } });
    await Review.deleteMany({ gig: id });
    await Gig.findByIdAndDelete(id);

    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    return next(new ErrorHandler("Internal server error."), 500);
  }
});

const searchQueryService = (
  searchTerm,
  category,
  minPrice,
  maxPrice,
  rating,
  subCategory
) => {
  const query = [];

  if (searchTerm) {
    query.push({ title: { $regex: searchTerm, $options: "i" } });
  }
  if (category) {
    query.push({ category: { $regex: category, $options: "i" } });
  }
  if (subCategory) {
    query.push({ subCategory: { $regex: subCategory, $options: "i" } });
  }
  if (minPrice && !maxPrice) {
    query.push({ price: { $gte: parseInt(minPrice) } });
  }
  if (maxPrice && !minPrice) {
    query.push({ price: { $gte: 1, $lte: parseInt(maxPrice) } });
  }
  if (minPrice && maxPrice) {
    query.push({
      price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) },
    });
  }
  if (rating) {
    query.push({ "reviews.rating": parseInt(rating) });
  }

  const matchQuery = { $and: query };

  const aggregateQuery = [
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: "$createdBy",
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
      },
    },
    { $match: matchQuery },
  ];

  return aggregateQuery;
};

const aggregateQueryCount = (
  searchTerm,
  category,
  minPrice,
  maxPrice,
  rating,
  subCategory
) => {
  const query = [];

  if (searchTerm) {
    query.push({ title: { $regex: searchTerm, $options: "i" } });
  }
  if (category) {
    query.push({ category: { $regex: category, $options: "i" } });
  }
  if (subCategory) {
    query.push({ subCategory: { $regex: subCategory, $options: "i" } });
  }
  if (minPrice && !maxPrice) {
    query.push({ price: { $gte: parseInt(minPrice) } });
  }
  if (maxPrice && !minPrice) {
    query.push({ price: { $gte: 1, $lte: parseInt(maxPrice) } });
  }
  if (minPrice && maxPrice) {
    query.push({
      price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) },
    });
  }
  if (rating) {
    query.push({ "reviews.rating": parseInt(rating) });
  }

  const matchQuery = { $or: query };
  const aggregateQuery = [
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
      },
    },
    { $match: matchQuery },
    {
      $count: "totalGigs",
    },
  ];
  return aggregateQuery;
};


async function compareArrays(array1, array2) {
  const uniqueObjects = (arr1, arr2) => arr1.filter(obj1 => !arr2.some(obj2 => obj1.url === obj2.url && obj1.public_id === obj2.public_id));

  const differentObjects = [...uniqueObjects(array1, array2), ...uniqueObjects(array2, array1)];
  return differentObjects;
}