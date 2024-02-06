import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector,useDispatch } from "react-redux";
import { inputClassName, labelClassName } from "../utils/data";
import { AddPhotoAlternate } from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { handleSetUserInfo } from "../redux/slice/authSlice";


function Profile() {
  const { userInfo, userUpdateLoading } = useSelector((state) => state.auth);
  const [cookies] = useCookies()
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      userName: "",
      fullName: "",
      description: "",
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      handlerUserApdateInfo(values)
    },
  });

 async function handlerUserApdateInfo (data) {
    dispatch(handleSetUserInfo({...data, image, token:cookies.token}))
  }

  console.log(userUpdateLoading)

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] mt-[22vh]  gap-3">
      <h2 className="text-3xl">Welocme to Fiverr Clone</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center w-full gap-5 py-10"
      >
        <div
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
          className="flex flex-col items-center cursor-pointer"
        >
          <label className={labelClassName} htmlFor="">
            Select a profile Picture
          </label>
          <div className="bg-purple-500 h-36 w-36 flex items-center justify-center rounded-full relative">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                className="rounded-full w-full h-full"
                alt="profileImage"
              />
            ) : (
              <span className="text-6xl text-white">
                {userInfo.email[0].toUpperCase()}
              </span>
            )}
            <div
              className={`absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center   transition-all duration-100 ${
                imageHover ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className={`flex items-center justify-center  relative`}>
                <AddPhotoAlternate
                  style={{ fontSize: "70px" }}
                  className="w-12 h-12 text-white absolute"
                />
                <input
                  type="file"
                  className="opacity-0"
                  name="profileImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/gif, image/jpeg, image/jpg, image/png"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 w-[500px] grid-cols-2">
          <div>
            <label className={labelClassName} htmlFor="username">
              Please select a username
            </label>
            <input
              className={inputClassName}
              type="text"
              name="userName"
              id="userName"
              placeholder="Username"
              value={formik.values.userName}
              onChange={formik.handleChange("userName")}
              onBlur={formik.handleBlur("userName")}
            />
            <span className="text-xs text-red-500">
              {formik.touched.userName && formik.errors.userName}
            </span>
          </div>
          <div>
            <label className={labelClassName} htmlFor="fullName">
              Please enter your full Name
            </label>
            <input
              className={inputClassName}
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange("fullName")}
              onBlur={formik.handleBlur("fullName")}
            />
            <span className="text-xs text-red-500">
              {formik.touched.fullName && formik.errors.fullName}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-[500px]">
          <label className={labelClassName} htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className={inputClassName}
            placeholder="description"
            value={formik.values.description}
            onChange={formik.handleChange("description")}
            onBlur={formik.handleBlur("description")}
          ></textarea>
        </div>
        <button
          className="border   text-lg font-semibold px-5 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
          type="submit"
        >
          Set Profile
        </button>
      </form>
    </div>
  );
}
var profileSchema = yup.object().shape({
  userName: yup.string().required("username is required"),
  fullName: yup.string().required("Email is required"),
  description: yup.string(),
});
export default Profile;
