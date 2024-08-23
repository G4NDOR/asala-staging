import React from 'react';
import '../css/L3.css';
import teapotImage from '../assets/teapot.png'; // Path to teapot image
import teacupImage from '../assets/teacup.png'; // Path to teacup image

const L3 = () => {
  return (
    <div className="loading-page">
      <div className="animation-container">
        <img src={teapotImage} alt="Teapot" className="teapot-image" />
        <div className="pouring-tea"></div>
        <img src={teacupImage} alt="Teacup" className="teacup-image" />
        <p className="loading-text">Pouring some Moroccan tea...</p>
      </div>
    </div>
  );
};

export default L3;
