import { compare } from "bcrypt";
import asyncHandler from "express-async-handler";
import { generatePassword } from "../utils/hashPass.js";
import { createToken } from "../utils/createToken.js";
import User from "../models/UserModel.js";
import {uploadFileToFirebaseStorage} from '../utils/firebase.js'
import ErrorHandler from "../middleware/ErrorHandler.js";

export const signUp = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return next(new ErrorHandler("Please enter your password",400));
    }

    if (!email) {
      return next(new ErrorHandler("Please enter your email address",400));
    }

    const findUser = await User.findOne({ email });
    
    if (findUser) {
      return next(new ErrorHandler("Sorry, email already exists, please try again",400));
    }

    const user = new User({
      email,
      password: await generatePassword(password),
    });

    const savedUser = await user.save();

    if (savedUser) {
      res.status(201).json({status: true, message:"Sign Up successfully"});
    } else {
      return next(new ErrorHandler("Failed to save user",400));
    }
  } catch (error) {
    return next(new ErrorHandler("Internal server error",500));
  }
});

export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password)return next(new ErrorHandler("Please enter a password",400));
    if (!email) return next(new ErrorHandler("Please enter your email",400));

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Sorry, wrong email or password, please try again",400))
    }

    if(!user.password){
      return next(new ErrorHandler("sorry, you can only login through google",400));
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) return next(new ErrorHandler("Invalid password",400));

    const jwtToken = await createToken(user.email, user._id);
    return res.json({
      user: { id: user.id, email: user.email },
      jwt: jwtToken,
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error",500));
  }
});

export const getUserInfo = asyncHandler(async (req, res, next) => {
  try {
    const findUser = await User.findById(req.user._id)
      .populate("gigs orders reviews wishList")
      .populate({ path: "orders", populate: { path: "gig" } })
      .lean();

    return res.status(200).json({
      user: {
        id: findUser?._id,
        email: findUser?.email,
        image: findUser?.profileImage,
        username: findUser?.username,
        role: findUser?.role,
        fullName: findUser?.fullname,
        description: findUser?.description,
        isProfileInfoSet: findUser?.isProfileInfoSet,
        orders: findUser?.orders,
        OAuth: findUser?.OAuth
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error",500));
  }
});

export const setUserInfo = asyncHandler(async (req, res, next) => {
  try {
    const { userName, fullName, description } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found",400));
    }

    if (userName) {
      const userNameExists = await User.findOne({ username: userName });
      if (
        userNameExists &&
        userNameExists._id.toHexString() !== req.user._id.toHexString()
      ) {
        return res.status(200).json({ userNameError: true });
      }
      user.username = userName;
    }

    if (fullName) {
      user.fullname = fullName;
    }

    if (description) {
      user.description = description;
    }

    user.isProfileInfoSet =
      !userName && !fullName && !description ? false : true;

    await user.save();

    return res.json("Profile data updated successfully");
  } catch (error) {
    return next(new ErrorHandler("Internal server error",500));
  }
});

export const userRoleEdit = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return next(new ErrorHandler("User not found",400))
    }

    if (user.isProfileInfoSet === false) {
      return next(new ErrorHandler("User profile information is not set",400));
    }

    if (user.role === "BUYER") {
      user.role = "SELLER";
      await user.save();
      return res.status(200).json({ role: true });
    } else if (user.role === "SELLER") {
      user.role = "BUYER";
      await user.save();
      return res.status(200).json({ role: false });
    }

    return next(new ErrorHandler("User role could not be updated",400));
  } catch (error) {
    return next(new ErrorHandler("Internal server error",500));
  }
});

export const setUserImage = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorHandler("Image not included",400));
    }
    
    const image = await uploadFileToFirebaseStorage(req.file);
    await User.findByIdAndUpdate(req.user._id, {
      profileImage:image,
    });

    return res.json({ img: image });
  } catch (error) {
    return next(new ErrorHandler("Internal server error",500));
  }
});

export const signInGoogleAuth = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req.body;
   const findUser =  await User.findOne({email:user.email})
   if(findUser){
    findUser.username= user.firstName
    findUser.fullname=user.fullName
    await findUser.save()
    const jwtToken = await createToken(findUser.email, findUser._id);
       if(jwtToken)return  res.status(200).json({
         user: {
           id: findUser._id,
           email: findUser.email,
           username: findUser.username,
           fullname: findUser.fullname,
           isProfileInfoSet: findUser.isProfileInfoSet,
           OAuth: findUser.OAuth
         },
         jwt: jwtToken,
       });
   }else{
     const googleAuth = new User({
       email: user.email,
       username: user.firstName,
       fullname: user.fullName,
       profileImage: "",
       isProfileInfoSet: true,
       OAuth:true
     });
     const savedUser = await googleAuth.save();
     if (savedUser) {
       const jwtToken = await createToken(savedUser.email, savedUser._id);
       if(jwtToken)return  res.status(200).json({
         user: {
           id: savedUser._id,
           email: savedUser.email,
           username: savedUser.username,
           fullname: savedUser.fullname,
           image: savedUser.profileImage,
           isProfileInfoSet: savedUser.isProfileInfoSet,
           OAuth: savedUser.OAuth
         },
         jwt: jwtToken,
       });
     }
   }

  } catch (error) {
    return next(new ErrorHandler("Internal server error",500));
  }
});
