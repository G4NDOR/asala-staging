import React from 'react';
import '../css/LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-page">
      <div className="animation-container">
        <div className="character">
          <div className="character-body"></div>
          <div className="character-eyes"></div>
          <div className="character-mouth"></div>
        </div>
        <p className="loading-text">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
