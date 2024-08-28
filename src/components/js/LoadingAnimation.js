import React from 'react';
import { useSelector } from 'react-redux';
import '../css/LoadingAnimation.css';
import CONSTANTS from '../../constants/appConstants';

const LoadingAnimation = () => {
  const loading = useSelector(state => state.appVars.loading);

  return (
    <div className={`loading-page ${loading?'':'hidden'}`} style={{zIndex:`${CONSTANTS.Z_INDEXES.LOADING_SCREEN}`}}>
      <div className="loading-animation">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
