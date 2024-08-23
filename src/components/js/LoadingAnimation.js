import React from 'react';
import { useSelector } from 'react-redux';
import '../css/LoadingAnimation.css';

const LoadingAnimation = () => {
  const loading = useSelector(state => state.appVars.loading);

  return (
    <div className={`loading-page ${loading?'':'hidden'}`}>
      <div className="loading-animation">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
