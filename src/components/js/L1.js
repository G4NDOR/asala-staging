import React from 'react';
import '../css/L1.css';

const L1 = () => {
  return (
    <div className="loading-page">
      <div className="animation-container">
        <div className="teapot">
          <div className="teapot-lid"></div>
          <div className="teapot-body"></div>
          <div className="teapot-spout"></div>
        </div>
        <div className="pouring-tea"></div>
        <div className="teacup"></div>
        <p className="loading-text">Pouring some Moroccan tea...</p>
      </div>
    </div>
  );
};

export default L1;
