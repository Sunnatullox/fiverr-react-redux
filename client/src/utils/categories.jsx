import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => {

  return (
    <button
      {...props}
      className={`slick-prev slick-arrow ${
        currentSlide === 0 ? "slick-disabled" : ""
      }`}
      // style={ currentSlide === 0 ? { display:"none"}: {}}
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
       <ChevronLeft fontSize="medium"/> 
    </button>
  );
};

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => {

    return (
        <button 
        {...props}
        className={`slick-next slick-arrow ${currentSlide === slideCount -1 ? "slick-disabled" : ""}`}
        aria-hidden="true"
        // style={currentSlide === slideCount -1 ? { display:"none"} : {}}
        aria-disabled={currentSlide === slideCount -1 ? true : false}
        type="button"
        >
        <ChevronRight fontSize="medium" />
        </button>
    )
};

// export const settings = {
//   infinite: false,
//   initialSlide: 0,
//   slidesToShow: 8.5,
//   slidesToScroll: 1,
//   speed: 500,
//   prevArrow: <SlickArrowLeft />,
//   nextArrow: <SlickArrowRight />,
//   swipeToSlide: true,
//   responsive: [
//     {
//       breakpoint: 2820,
//       settings: {
//         initialSlide: 0,
//         slidesToShow: 15,
//       },
//     },
//     {
//       breakpoint: 1429,
//       settings: {
//         initialSlide: 0, 
//         slidesToShow: 8.5,
//       },
//     },
//     {
//       breakpoint: 1224,
//       settings: {
//         initialSlide: 0,
//         slidesToShow: 6.5,
//       },
//     },
//     {
//       breakpoint: 900,
//       settings: {
//         initialSlide: 0,
//         slidesToShow: 5,
//       },
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         initialSlide: 0,
//         slidesToShow: 3,
//       },
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         initialSlide: 0,
//         slidesToShow: 2,
//       },
//     },
//   ],
// };


export  const breakpoints = {
  320: {
    slidesPerView: 4.5,
  },
  480: {
    slidesPerView: 4.5,
  },
  640: {
    slidesPerView: 4.5,
  },
  700: {
    slidesPerView: 4.5,
  },
  730: {
    slidesPerView: 4.7,
  },
  780: {
    slidesPerView: 5,
  },
  825: {
    slidesPerView: 5.3,
  },
  860: {
    slidesPerView: 5.5,
  },
  895: {
    slidesPerView: 5.8,
  },
  927:{
    slidesPerView: 6,
  },
  970:{
    slidesPerView: 6.3,
  },
  1000: {
    slidesPerView: 6.5,
  },
  1030: {
    slidesPerView: 6.7,
  },
  1080: {
    slidesPerView: 7,
  },
  1125: {
    slidesPerView: 7.3,
  },
  1150: {
    slidesPerView: 7.5,
  },
  1180: {
    slidesPerView: 7.7,
  },
  1225: {
    slidesPerView: 8,
  },
  1270: {
    slidesPerView: 8.3,
  },
  1300: {
    slidesPerView: 8.5,
  },
  1330: {
    slidesPerView: 8.7,
  },
  1370:{
    slidesPerView: 9,
  },
  1400:{
    slidesPerView: 9.2,
  },
  1440:{
    slidesPerView: 9.5,
  },
  1465:{
    slidesPerView: 9.7,
  },
  1536: {
    slidesPerView: 10,
  },
};