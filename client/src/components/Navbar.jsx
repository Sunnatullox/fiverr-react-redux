import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FiverrLogo from "./FiverrLogo";
import SearchIcon from "@mui/icons-material/Search";
import HeaderMenu from "./HeaderMenu";
import { useDispatch } from "react-redux";
import { handleShowLogin, handleShowRegister } from "../redux/slice/authSlice";
import { useSelector } from "react-redux";
import { FavoriteBorder } from "@mui/icons-material";

function Navbar() {
  const [navFixed, setNavFixed] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    const positionNavbar = () => {
      window.scrollY > 50 ? setNavFixed(true) : setNavFixed(false);
    };

    if (window.location.pathname === "/") {
      window.addEventListener("scroll", positionNavbar);
      return () => window.removeEventListener("scroll", positionNavbar);
    } else {
      setNavFixed(true);
    }
  }, [window.location.pathname]);

  const handleLogin = () => {
    dispatch(handleShowLogin(true));
  };

  const handleSignup = () => {
    dispatch(handleShowRegister(true));
  };

  const link = [
    {
      linkName: "Fiverr Business",
      handler: "#",
      type: "link",
    },
    {
      linkName: "Explore",
      handler: "#",
      type: "link",
    },
    {
      linkName: "English",
      handler: "#",
      type: "link",
    },
    {
      linkName: "Become a Seller",
      handler: "#",
      type: "link",
    },
    {
      linkName: "Sign In",
      handler: handleLogin,
      type: "button",
    },
    {
      linkName: "Join",
      handler: handleSignup,
      type: "button2",
    },
  ];

  return (
    <div>
      <div
        className={`w-full gap-10 px-10 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
          navFixed || userInfo
            ? "fixed bg-white border-b border-gray-200"
            : "absolute bg-transparent  border-transparent"
        }`}
      >
        <Link to="/">
          <FiverrLogo fillColar={"#003912"} />
        </Link>
        <div
          className={`flex relative w-full ${
            navFixed || userInfo ? "opacity-100" : "opacity-0"
          }`}
        >
          <input
            type="search"
            id="search-dropdown"
            className="w-full max-w-[30rem] block py-2.5 px-4 p-2.5 z-20 text-sm bg-gray-50 border outline-none rounded-l-lg border-r-gray-100 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="What service are you looking for today?"
            required
          />
          <button className="top-0 right-0 p-2.5 text-sm font-medium text-white bg-gray-900 rounded-r-lg border">
            <SearchIcon className="fill-white text-white h-5 w-6" />
          </button>
        </div>
        <nav>
          {!userInfo ? (
            <ul className="flex list-none gap-3 list-image-none min-w-max">
              {link.map(({ linkName, handler, type }) => {
                return (
                  <li
                    key={linkName}
                    className={`${
                      navFixed || userInfo ? "text-gray" : "text-white"
                    } font-medium pr-6`}
                  >
                    {type === "link" && <Link to={handler}>{linkName}</Link>}
                    {type === "button" && (
                      <button onClick={handler}>{linkName}</button>
                    )}
                    {type === "button2" && (
                      <button
                        onClick={handler}
                        className={`border text-md font-semibold py-1 px-3 rounded-sm ${
                          navFixed || userInfo
                            ? "border-[#1DBF73] text-[#1DBF73]"
                            : "border-white text-white"
                        }
                    hover:bg-[#1DBF73] hover:text-white hover:border-[#1DBF73] transition-all duration-500
                    `}
                      >
                        {linkName}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="flex list-none gap-3 list-image-none min-w-max items-center" >
              <li className="cursor-pointer text-[#3631c9] font-medium">
                <Link to="https://pro.fiverr.com/?utm_source=google&utm_medium=cpc-brand&utm_campaign=G_ROW-EN_Brand&utm_term=fiverr_business_exact&utm_content=AdID^654908055096^Keyword^fiverr%20business^Placement^^Device^c&caid=406997588&agid=124913637053&ad_id=654908055096&kw=fiverr%20business&lpcat=br_general&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc-brand&utm_campaign=G_ROW-EN_Brand&utm_term=fiverr%2dbusiness%5fexact&utm_content=AdID^654908055096^Keyword^fiverr%20business^Placement^^Device^c&caid=406997588&agid=124913637053&ad_id=654908055096&kw=fiverr%20business&lpcat=br_general&show_join=true&gad_source=1&gclid=CjwKCAiAtt2tBhBDEiwALZuhAKfwd4QSiYttgp0tZPwpz0Keuwrm5nkxcXKrSIsgfld_8rYhUfaDOBoCG0oQAvD_BwE">
                  Fiverr businis
                </Link>
              </li>
              <li
                onClick={() => navigation("/wishlist")}
                className="cursor-pointer text-[#646464] font-medium"
              >
                <FavoriteBorder fontSize="medium" />
              </li>
              <li
                onClick={() => navigation("/buyer/orders")}
                className="cursor-pointer text-[#646464] font-medium"
              >
                Orders
              </li>
              <li title="Profile" className="cursor-pointer">
                {userInfo?.image ? (
                  <img
                    src={userInfo.image.url}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative">
                    <span className="text-xl text-white">
                      {userInfo && userInfo?.email && (
                        userInfo.email.split("")[0].toUpperCase()
                      ) }
                    </span>
                  </div>
                )}
              </li>
            </ul>
          )}
        </nav>
      </div>
      <HeaderMenu show={navFixed} />
    </div>
  );
}

export default Navbar;
