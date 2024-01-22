import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


function HeroBaner() {
    const {popularCategorys} = useSelector((state) => state.categorys)

  return (
    <div className="h-[680px] relative bg-cover">
      <div className="absolute top-0 right-0 w-[100vw] h-full transition-opacity z-0">
        <div className="w-full z-10 h-full bg-black bg-opacity-20 absolute" />
        <video
          src="https://firebasestorage.googleapis.com/v0/b/fiverr-clone-ff2df.appspot.com/o/Introducing%20Learn%20from%20Fiverr%20_%20Fiverr.mp4?alt=media&token=ace3ac47-83f0-42dd-a021-e0bda99cac0d"
          poster="https://i.ytimg.com/vi_webp/vhFpHAoPnxE/maxresdefault.webp"
          loop
          muted
          preload="auto"
          className="z-0 min-h-[580px] h-full object-cover w-full aspect-video"
          autoPlay
          // style={{opacity:1}}
        ></video>
      </div>
      <div className="z-10 relative w-[650px] flex justify-center flex-col h-full gap-5 ml-20">
        <h1 className="text-white text-5xl leading-snug">
          Find the perfect&nbsp;
          <i>freelance</i>
          <br />
          services for your busines
        </h1>
        <div className=" align-middle">
          <div className="flex relative items-center ">
            <SearchIcon
              fontSize="large"
              className="absolute text-gray-500 flex align-middle h-full left-2"
            />
            <input
              type="search"
              className="h-14 w-[450px] pl-12 rounded-md rounded-r-none outline-none placeholder:text-lg"
              placeholder={`Try "building mobile app"`}
              required
            />
            <button className="bg-[#1DBF73] h-14 text-white px-12 text-lg font-semibold rounded-md rounded-l-none">
              Search
            </button>
          </div>
          <div className="text-white flex gap-4 mt-3">
            Popular:
            <ul className="flex gap-5">
                {popularCategorys?.slice(0,4)?.map((item) => (
              <li key={item._id}>
                <Link
                  to={`/search?subCategory=${item.slug}`}
                  className="text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                >
                  {item.title}
                </Link>
              </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBaner;
