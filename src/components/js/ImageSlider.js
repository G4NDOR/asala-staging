// src/components/ImageSlider.js

import React, { useState, useEffect } from "react";
import "../css/ImageSlider.css";
import DEFAULT_VALUES from "../../constants/defaultValues";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset the index to 0 when the images array changes
    setCurrentIndex(0);
  
    // Set up the interval to change the image
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (images) {
          const newIndex = (prevIndex + 1) % images.length;
          return newIndex;
        } else{
          return 0; // If no images, reset to 0
        }
        
      });
    }, 5000); // Change image every 5 seconds

    //console.log("currentIndex: ", currentIndex); // prints 0
  
    // Clear the interval on cleanup
    return () => clearInterval(interval);
  }, [images]); // Re-run the effect whenever `images` changes


  return (
    <div className="slider-container">
      <div
        className="slider"
        style={{
          backgroundImage: `url(${images ? `${images[currentIndex]}`:`${DEFAULT_VALUES.IMAGES[0]}`})` 
        }}
      ></div>
    </div>
  );
};

export default ImageSlider;
