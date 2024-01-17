import { Router } from "express";
import { adminVerify, verfyToken } from "../middleware/AuthMiddleware.js";
import {

  createCategories,
  createManyCategories,
  createManySubCategoryHeaders,
  createMenySubCategory,
  createSubCategory,
  createSubCategoryHeader,
  getCategorys,
  getPopularCategorys,
  getSingleCategory,
  getSubCategorys,
} from "../controllers/CategorysController.js";
import multer from "multer";

const categorysRoute = Router();
const upload = multer({ dest: "uploads/categorys/" });

categorysRoute.post("/admin/category/create",verfyToken, adminVerify,
upload.single("images"), createCategories);
categorysRoute.get("/admin/category/creates", createManyCategories);
categorysRoute.post("/admin/sub-categ-header/create",verfyToken, adminVerify, createSubCategoryHeader);
categorysRoute.get("/admin/sub-categ-header/creates", createManySubCategoryHeaders);
categorysRoute.post(
  "/admin/sub-categ/create",
  upload.single("images")
  ,verfyToken, adminVerify,
  createSubCategory
);
categorysRoute.get(
  "/admin/sub-categ/creates",
  createMenySubCategory
);
categorysRoute.get("/get-categorys", getCategorys);
categorysRoute.get("/get-sub-category", getSingleCategory);
categorysRoute.get("/get-pupular-sub-categorys", getPopularCategorys);
categorysRoute.get("/get-sub-categorys", getSubCategorys);

export default categorysRoute;
