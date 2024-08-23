import React from "react";
import Slider from "react-slick";
import "../css/DiscoverSection.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Post from "./Post";

const DiscoverSection = () => {

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true, // Center the current slide
    //centerPadding: '20px', // Padding around the centered slide
    responsive: [
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          //fade: true,
          //speed: 1000,
          //cssEase: 'linear'
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          speed: 1000,
          cssEase: 'linear',
        }
      }
    ]
  };

  return (
    <section className="new-interesting-section">
      <div className="content-wrapper">
        <h2 className="section-title">What's New & Interesting</h2>
        <Slider {...settings}>
          <Post 
            imageSrc="https://via.placeholder.com/150" 
            title="New Moroccan Dish" 
            description="Discover our latest addition to the menu! A delightful blend of traditional spices." 
          />
          <Post 
            imageSrc="https://via.placeholder.com/150" 
            title="Special Offer" 
            description="Get 20% off on your first order. Don't miss out!" 
          />
          <Post 
            imageSrc="https://via.placeholder.com/150" 
            title="Featured Article" 
            description="Read about the rich history and culture behind our authentic Moroccan cuisine." 
          />
        </Slider>
      </div>
    </section>
  );
};

export default DiscoverSection;
