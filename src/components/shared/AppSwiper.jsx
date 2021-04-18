import React from "react";
import Swiper from "react-id-swiper";

import "swiper/css/swiper.css";
import "../../assets/scss/plugins/extensions/swiper.scss";

const AppSwiper = ({ children }) => {
  const swiperParams = {
    slidesPerView: 3,
    spaceBetween: 10,
    freeMode: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    shouldSwiperUpdate: true,
  };

  return <Swiper {...swiperParams}>{children}</Swiper>;
};

export default AppSwiper;
