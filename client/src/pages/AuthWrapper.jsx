import React, { useState } from "react";
import { Close, Facebook, Google } from "@mui/icons-material/";

function AuthWrapper({ type }) {
  const [errorMessage, setErrorMessage] = useState(null);

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
            className="cursor-pointer self-end mr-2 mt-1"
            fontSize="medium"
          />
          <div className="flex flex-col justify-center items-center p-2 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              {type === "login" ? "Login" : "Sign"} in to Fiverr
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
          <form className="flex flex-col justify-center items-center p-8 gap-7">
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
                />
              </div>
              <div className="grid">
                <input
                  type="password"
                  name="password"
                  className="border border-slate-300 p-3 w-80"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
