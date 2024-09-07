import React from "react";
import Slider from "react-slick";
import "../css/DiscoverSection.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Post from "./Post";
import { useSelector } from "react-redux";
import DEFAULT_VALUES from "../../constants/defaultValues";

const DiscoverSection = () => {
  const announcements = useSelector((state) => state.homePageManager.announcements);

const settings = DEFAULT_VALUES.SLIDER_SETTINGS;

  return (
    <section className="new-interesting-section">
      <div className="content-wrapper">
        <h2 className="section-title">What's New & Interesting</h2>
        <Slider {...settings}>
        {
          announcements.map((announcement) => 
            <Post 
            key={announcement['id']}  // Key is needed for React to identify and update the elements when necessary.
            imageRef={announcement['image-ref']}
            title={announcement['title']}
            description={announcement['description']}
            />
          )
        }
        </Slider>
      </div>
    </section>
  );
};

export default DiscoverSection;
