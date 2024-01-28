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

export const settings = {
  infinite: false,
  initialSlide: 0,
  slidesToShow: 8.5,
  slidesToScroll: 1,
  speed: 500,
  prevArrow: <SlickArrowLeft />,
  nextArrow: <SlickArrowRight />,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 2820,
      settings: {
        initialSlide: 0,
        slidesToShow: 15,
      },
    },
    {
      breakpoint: 1429,
      settings: {
        initialSlide: 0, 
        slidesToShow: 8.5,
      },
    },
    {
      breakpoint: 1224,
      settings: {
        initialSlide: 0,
        slidesToShow: 6.5,
      },
    },
    {
      breakpoint: 900,
      settings: {
        initialSlide: 0,
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 600,
      settings: {
        initialSlide: 0,
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 480,
      settings: {
        initialSlide: 0,
        slidesToShow: 2,
      },
    },
  ],
};
