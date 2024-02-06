import React from "react";
import { useSelector } from "react-redux";
import { breakpoints } from "../utils/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate  } from 'react-router-dom';



function HeaderMenu({ show }) {
  const { categorysAll } = useSelector((state) => state.categorys);

  const navigation = useNavigate();
  


  return (
    <div
      className={`border-t border-[#0003] px-[40px] pt-[12px] mt-2  box-border w-full m-0 outline-0 p-0 whitespace-pre flex top-20 z-[11] transition-[hidden] duration-300 ${
        show ? "fixed bg-white border-gray-200" : "hidden"
      }`}
    >
      <Swiper
        breakpoints={breakpoints}
        spaceBetween={30}
        keyboard={{
          enabled: true,
        }}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper w-full h-full flex"
      >
        {categorysAll.map((category) => (
          <SwiperSlide key={category._id} className="mx-4 w-full">
            <span className="peer group items-center justify-between space-x-5 bg-white px-4 relative group w-max">
              <a
                onClick={() => navigation(`/search?category=${category.slug}`)}
                className="pl-0 menu-hover py-2 text-base font-medium text-gray-500"
              >
                {category?.title}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-green-500 transition-all group-hover:w-full top-8"></span>
              </a>
            </span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeaderMenu;
