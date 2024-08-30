// GoHomeBtn.js
import React, { useState } from 'react';
import { FaHome, FaArrowDown, FaArrowUp  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import '../css/GoHomeBtn.css'; // Create this CSS file for styling
import CONSTANTS from '../../constants/appConstants';
import { setCurrentPage } from '../../redux/ducks/appVars';
import { useDispatch, useSelector } from 'react-redux';

const GoHomeBtn = () => {
  const dispatch = useDispatch();  // access to redux dispatch function
  const navigate = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const currentPage = useSelector(state => state.appVars.currentPage);  // access to current page
  const isCartPage = currentPage == Paths.CART;  // check if current page is cart page
  const visible = isCartPage? false: true;

  const handleArrowClick = () => {
    setIsAtBottom(!isAtBottom);
  };

  //navigate function to change pages
  const navigateToPage = (path) => {
    dispatch(setCurrentPage(path));
    navigate(path);
  }  

  const goHome = ()=>{
    navigateToPage(Paths.HOME);
  }

  return (
    <div className={`go-home-container ${visible? '':'invisible'}`}//{`go-home-container ${isAtBottom ? 'bottom' : 'top'}`} 
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
