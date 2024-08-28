// GoHomeBtn.js
import React, { useState } from 'react';
import { FaHome, FaArrowDown, FaArrowUp  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import '../css/GoHomeBtn.css'; // Create this CSS file for styling
import CONSTANTS from '../../constants/appConstants';

const GoHomeBtn = () => {
  const navigate = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleArrowClick = () => {
    setIsAtBottom(!isAtBottom);
  };

  const goHome = ()=>{
    navigate(Paths.HOME);
  }

  return (
    <div className="go-home-container"//{`go-home-container ${isAtBottom ? 'bottom' : 'top'}`} 
    style={{
        top: `${isAtBottom ? `${window.innerHeight - 90}px` : '10px'}`,
        flexDirection:  `${isAtBottom ? "column-reverse" : "column"}`,
    }}
    >
      <div className="go-home-btn" onClick={goHome} style={{zIndex:`${CONSTANTS.Z_INDEXES.HOME_BUTTON}`}}>
        <FaHome />
      </div>
      <div className="arrow" onClick={handleArrowClick}>
        {isAtBottom ? <FaArrowUp /> : <FaArrowDown />}
      </div>
    </div>
  );
};

export default GoHomeBtn;
