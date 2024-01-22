import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => {
  return (
    <button
      {...props}
      className={`slick-prev slick-arrow ${
        currentSlide === 0 ? "slick-disabled" : ""
      }`}
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
        aria-disabled={currentSlide === slideCount -1 ? true : false}
        type="button"
        >
        <ChevronRight fontSize="medium" />
        </button>
    )
};

export const settings = {
  infinite: false,
  initialSlide: 0,
  slidesToShow: 8.5,
  slidesToScroll: 2,
  speed: 500,
  prevArrow: <SlickArrowLeft />,
  nextArrow: <SlickArrowRight />,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 2820,
      settings: {
        slidesToShow: 15,
      },
    },
    {
      breakpoint: 1429,
      settings: {
        slidesToShow: 8.5,
      },
    },
    {
      breakpoint: 1224,
      settings: {
        slidesToShow: 6.5,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
