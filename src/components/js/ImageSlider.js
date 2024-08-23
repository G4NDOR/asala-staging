// src/components/ImageSlider.js

import React, { useState, useEffect } from "react";
import "../css/ImageSlider.css";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div
        className="slider"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      ></div>
    </div>
  );
};

export default ImageSlider;
