import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FiverrLogo from "./FiverrLogo";
import SearchIcon from "@mui/icons-material/Search";

function Navbar() {
  const [navFixed, setNavFixed] = useState(false);

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
    
  }
  
  const handleSignup = () => {

  }

const link =[
    {
        linkName:"Fiverr Business",
        handler:"#",
        type:"link"
    },
    {
        linkName:"Explore",
        handler:"#",
        type:"link"
    },
    {
        linkName:"English",
        handler:"#",
        type:"link"
    },
    {
        linkName:"Become a Seller",
        handler:"#",
        type:"link"
    },
    {
        linkName:"Sign In",
        handler:handleLogin,
        type:"button"
    },
    {
        linkName:"Join",
        handler:handleSignup,
        type:"button2"
    },
]

  return (
    <div>
      <div
        className={`w-full gap-10 px-10 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
          navFixed
            ? "fixed bg-white border-b border-gray-200"
            : "absolute bg-transparent  border-transparent"
        }`}
      >
        <Link to="/">
          <FiverrLogo fillColar={"#003912"} />
        </Link>
        <div
          className={`flex relative w-full ${
            navFixed ? "opacity-10" : "opacity-0"
          }`}
        >
          <input
            type="search"
            id="search-dropdown"
            className="w-full max-w-[30rem] block py-2.5 px-4 p-2.5 z-20 text-sm bg-gray-50 rounded-r-lg border-l-gray-100 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="What service are you looking for today?"
            required
          />
          <button className="top-0 right-0 p-2.5 text-sm font-medium text-white bg-gray-900 rounded-r-lg border">
            <SearchIcon className="fill-white text-white h-5 w-6" />
          </button>
        </div>
        <nav>
          <ul className="flex list-none list-image-none min-w-min">
            {link.map(({ linkName, handler, type }) => {
              return (
                <li
                  key={linkName}
                  className={`${
                    navFixed ? "text-gray" : "text-white"
                  } font-medium pr-6`}
                >
                  {type === "link" && (
                    <Link to={handler}>{linkName}</Link>
                  )}
                  {type === "button" && (
                    <button onClick={handler}>{linkName}</button>
                  )}
                  {type === "button2" && (
                    <button onClick={handler} className={`border text-md font-semibold py-1 px-3 rounded-sm ${
                      navFixed ? "border-[#1DBF73] text-[#1DBF73]":"border-white text-white"
                    }
                    hover:bg-[#1DBF73] hover:text-white hover:border-[#1DBF73] transition-all duration-500
                    `}>{linkName}</button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
