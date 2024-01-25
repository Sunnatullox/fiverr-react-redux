import React, { useEffect, useState } from "react";
import { Close, Facebook, Google } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  handleLogin,
  handleShowLogin,
  handleShowRegister,
} from "../redux/slice/authSlice";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const authSchema = yup.object().shape({
  email: yup
    .string()
    .email("Emil should be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

function AuthWrapper({ type }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const { showLogin, showRegister, isSuccess, message, isError } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const html = document.querySelector("html");

    const authModal = document.querySelector("#auth-modal");
    const blureDiv = document.querySelector("#blur-div");
    html.style.overflowY = "hidden";

    const handlerBlureDiv = () => {
      if (type === "login") {
        dispatch(handleShowLogin(false));
      } else {
        dispatch(handleShowRegister(false));
      }
    };

    const handlerAuthModal = (e) => {
      // e.stopPropagation()
    };

    authModal.addEventListener("click", handlerAuthModal);
    blureDiv.addEventListener("click", handlerBlureDiv);
    return () => {
      blureDiv.removeEventListener("click", handlerBlureDiv);
      authModal.removeEventListener("click", handlerAuthModal);
      html.style.overflowY = "initial";
    };
  }, [showLogin, showRegister]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: authSchema,
    onSubmit: (values) => {
      handleAuth(values);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
      formik.setFieldValue("email", "");
      formik.setFieldValue("password", "");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if(isError) {
      setErrorMessage(message);
      toast.error(message);
    }
  }, [message, isError]);

  function handleAuth(data) {
    if (data.email.trim() !== "" && data.password.trim() !== "")
      dispatch(handleLogin({ values: data, type }));
  }

  const authModalHidden = () => {
    type === "login"
      ? dispatch(handleShowLogin(false))
      : dispatch(handleShowRegister(false));
  };

  return (
    <div className="fixed top-0 z-[100]">
      <div
        className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0"
        id="blur-div"
      />
      {/* auth */}
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div
          className="rounded-md fixed z-[101] h-max w-max bg-white flex flex-col justify-center items-center"
          id="auth-modal"
        >
          <Close
            onClick={authModalHidden}
            className="cursor-pointer self-end mr-2 mt-1"
            fontSize="medium"
          />
          <div className="flex flex-col justify-center items-center p-2 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              {type === "login" ? "Sign in" : "Sign up"} to Fiverr
            </h3>
            <div className="flex flex-col gap-5">
              <button className="rounded-md text-white bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center relative">
                <Facebook className="absolute left-4" fontSize="medium" />
                Continue with Facebook
              </button>
              <button className="rounded-md border border-slate-300 bg-red-400  p-3 font-semibold w-80 flex items-center justify-center relative">
                <Google
                  className="absolute left-4 text-white"
                  fontSize="medium"
                />
                Continue with Google
              </button>
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col justify-center items-center p-8 gap-7"
          >
            <div className="relative w-full text-center">
              <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                <span className="bg-white relative z-10 px-2">OR</span>
              </span>
            </div>
            {errorMessage && (
              <div className="w-80">
                <span className="text-orange-600 text-sm">{errorMessage}</span>
              </div>
            )}
            <div className="flex flex-col gap-5">
              <div className="grid">
                <input
                  type="email"
                  name="email"
                  className="border border-slate-300 p-3 w-80"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
                <span className="text-xs text-red-500">
                  {formik.touched.email && formik.errors.email}
                </span>
              </div>
              <div className="grid">
                <input
                  type="password"
                  name="password"
                  className="border border-slate-300 p-3 w-80"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                />
                <span className="text-xs text-red-500">
                  {formik.touched.password && formik.errors.password}
                </span>
              </div>
              <button
                type="submit"
                className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80"
              >
                Continue
              </button>
            </div>
          </form>
          <div className="py-5 w-full flex items-center justify-center border-r border-slate-400">
            <span className="text-sm text-slate-700">
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span
                    onClick={() => {
                      dispatch(handleShowLogin(false));
                      dispatch(handleShowRegister(true));
                    }}
                    className="text-[#1DBF73] cursor-pointer"
                  >
                    Join Now
                  </span>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span
                    onClick={() => {
                      dispatch(handleShowRegister(false));
                      dispatch(handleShowLogin(true));
                    }}
                    className="text-[#1DBF73] cursor-pointer"
                  >
                    Login Now
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
