import asyncHandler from "express-async-handler";
import { renameSync } from "fs";
import slugify from "slugify";
import {
  categorysData,
  subCategHeaderData,
  subCategorysDAta,
} from "../Data.js";
import Category from "../models/CategorysModel.js";
import SubCategoryHeader from "../models/SubCategsHeaderModel.js";
import SubCategory from "../models/SubCategorysModel.js";
import { uploadFileToFirebaseStorage } from "../utils/firebase.js";
import ErrorHandler from "../middleware/ErrorHandler.js";

export const createCategories = asyncHandler(async (req, res) => {
  try {
    if (!req.body.title) {
      return next(new ErrorHandler("Title is required.",401));
    }

    const findStringElement = req.body.title.includes("&");
    const slugTitle = findStringElement
      ? req.body.title?.replace(" & ", " ")
      : req.body.title;

    const newCategory = new Category({
      title: req.body.title,
      logo: req.file
        ? await uploadFileToFirebaseStorage(req.file)
        : null,
      slug: slugify(slugTitle),
    });

    const createdCategory = await newCategory.save();

    return res.status(201).json(createdCategory);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const createManyCategories = asyncHandler(async (req, res) => {
  try {
    if (!Array.isArray(categorysData)) {
      return next(new ErrorHandler("Invalid categorysData format",400));
    }

    for (let index = 0; index < categorysData.length; index++) {
      const element = categorysData[index];
      const findStringElement = element.title.includes("&");
      const slugTitle = findStringElement
        ? element.title?.replace(" & ", " ")
        : element.title;

      const newCategory = new Category({
        title: element.title,
        logo: element.logo,
        slug: slugify(slugTitle),
      });

      await newCategory.save();
    }

    return res.status(201).json("Created new Categories successfully");
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const createSubCategoryHeader = asyncHandler(async (req, res) => {
  try {
    if (!req.body.title || !req.body.categoryId) {
      return next(new ErrorHandler("Title is required.",400));
    }
    const findCateg = await Category.findById({ _id: req.body.categoryId });
    const newSubCategoryHeader = new SubCategoryHeader({
      title: req.body.title,
      categorys: req.body.categoryId,
    });

    await newSubCategoryHeader.save();
    findCateg.subCategHeader.push(newSubCategoryHeader._id);
    return res.status(201).json(newSubCategoryHeader);
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const createManySubCategoryHeaders = asyncHandler(async (req, res) => {
  try {
    if (!Array.isArray(subCategHeaderData)) {
      return next(new ErrorHandler("Invalid subCategHeaderData format",400));
    }

    for (let index = 0; index < subCategHeaderData.length; index++) {
      const element = subCategHeaderData[index];
      const findCateg = await Category.findOne({ title: element.categorys });
      if (findCateg) {
        const newSubCategoryHeader = new SubCategoryHeader({
          title: element.title,
          categorys: findCateg._id,
        });

        await newSubCategoryHeader.save();
        findCateg.subCategHeader.push(newSubCategoryHeader._id);
        await findCateg.save();
      }
    }

    return res.status(201).json("Created new SubCategoryHeaders successfully");
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const createSubCategory = asyncHandler(async (req, res) => {
  try {
    const { title, subCategHeaderId, categoryId, description } = req.body;

    if (!title || !subCategHeaderId || !categoryId || !description) {
      return next(new ErrorHandler("All fields must be filled",400));
    }
    const findCateg = await Category.findOne({ _id: categoryId });
    const findSubCategHed = await SubCategoryHeader.findOne({
      _id: subCategHeaderId,
    });
    // const findStringElement = title.includes("&");

    const newSubCategory = new SubCategory({
      title,
      subCategHeader: subCategHeaderId,
      category: categoryId,
      description,
      logo: req.file
        ? await uploadFileToFirebaseStorage(req.file)
        : null,
      isPopular: req.body.isPopular || false,
      slug: slugify(slugTitle),
    });

    await newSubCategory.save();
    findCateg.subCategorys.push(newSubCategory._id);
    findSubCategHed.subCategorys.push(newSubCategory._id);
    await findCateg.save();
    await findSubCategHed.save();
    return res.status(201).json(newSubCategory);
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const createMenySubCategory = asyncHandler(async (req, res) => {
  try {
    for (let index = 0; index < subCategorysDAta.length; index++) {
      const element = subCategorysDAta[index];
      const findCateg = await Category.findOne({ title: element.categorys });
      const findSubCategHed = await SubCategoryHeader.findOne({
        title: element.subCategHeader,
      });

      const findStringElement = element.title.includes("&");
      let slugTitle = findStringElement
        ? element.title.replace(" & ", " ")
        : element.title;

      const newSubCategory = new SubCategory({
        title: element.title,
        subCategHeader: findSubCategHed._id,
        category: findCateg._id,
        description: element.description,
        logo: element.logo,
        isPopular: element.isPopular || false,
        slug: slugify(slugTitle),
      });

      await newSubCategory.save();
      findCateg.subCategorys.push(newSubCategory._id);
      findSubCategHed.subCategorys.push(newSubCategory._id);
      await findCateg.save();
      await findSubCategHed.save();
    }

    return res.status(201).json("Created new SubCategories successfully");
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const getCategorys = asyncHandler(async (req, res) => {
  try {
    const categorys = await Category.find()
      .populate("subCategHeader")
      .populate({
        path: "subCategHeader",
        populate: {
          path: "subCategorys",
        },
      })
      .populate("subCategorys")
      .lean();
    return res.json({ categorys });
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const getSingleCategory = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) {
      return next(new ErrorHandler("Slug is required.",400));
    }

    const category = await Category.findOne({ slug })
      .populate("subCategHeader")
      .populate({
        path: "subCategHeader",
        populate: {
          path: "subCategorys",
        },
      })
      .populate("subCategorys")
      .lean();
    if (!category) {
      return next(new ErrorHandler("Internal server error.",500));
    }

    return res.json(category);
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const getPopularCategorys = asyncHandler(async (req, res) => {
  try {
    const popularCategorys = await SubCategory.find({ isPopular: true }).exec();
    return res.json({ popularCategorys });
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});

export const getSubCategorys = asyncHandler(async (req, res) => {
  try {
    const subCategorys = await SubCategory.find().exec();

    return res.json({ subCategorys });
  } catch (error) {
    return next(new ErrorHandler("Internal server error.",500));
  }
});
