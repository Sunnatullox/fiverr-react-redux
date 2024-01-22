import React from "react";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { settings } from "../utils/categories";
import { Link } from "react-router-dom";

function HeaderMenu({ show }) {
  const { categorysAll } = useSelector((state) => state.categorys);

  console.log(categorysAll);
  return (
    <div
      style={{ padding: "12px 40px", borderTop: "1px solid #0003" }}
      className={`px-8 mt-2  box-border w-full m-0 outline-0 p-0 whitespace-pre flex top-20 z-[11] transition-[hidden] duration-300 ${
        show ? "fixed bg-white border-gray-200" : "hidden"
      }`}
    >
      <Slider className="w-full block" {...settings}>
        {categorysAll.map((category) => (
          <span
            key={category._id}
            className="peer group items-center justify-between space-x-5 bg-white px-4 relative group w-max"
          >
            <Link
            to=""
              className="pl-0 menu-hover py-2 text-base font-medium text-gray-500"
            >
              {category?.title}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-green-500 transition-all group-hover:w-full top-8"/>
            </Link>
          </span>
        ))}
      </Slider>
    </div>
  );
}

export default HeaderMenu;
