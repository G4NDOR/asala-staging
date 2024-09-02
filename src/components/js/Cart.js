// src/components/Cart.js

import React, { useEffect, useState } from "react";
//import CSS
import "../css/Cart.css";
//import Components
import CheckOutItemsList from "./CheckOutItemsList";
//import Redux
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from'react-router-dom';
import { resetUnseenChanges, setCartIsOpen } from "../../redux/ducks/orderManager";
//import Navigation

import { CART } from "../../constants/stateKeys";
import Paths from "../../constants/navigationPages";
import GoToCartPageBtn from "./GoToCartPageBtn";
import { setCurrentPage, setScreenWidthIsLessThan480 } from "../../redux/ducks/appVars";
import ButtonsContainer from "./ButtonsContainer";
import CONSTANTS from "../../constants/appConstants";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adjustedForPhone = useSelector(state => state.appVars.screenWidthIsLessThan480);
  const notAdjustedForPhone =!adjustedForPhone;
  const isOpen = useSelector((state) => state.orderManager.cartIsOpen); // Accessing the count from the Redux store
  const cartIsEmpty = useSelector((state) => state.orderManager.cartIsEmpty);
  const cartIsNotEmpty =!cartIsEmpty;
  const unseenChanges = useSelector(state => state.orderManager.unseenChanges);
  const isAnimated = useSelector(state => state.orderManager.isAnimated);


  const toggleCart = () => {
    const isClosed = !isOpen;
    if(isClosed){
      //opening cart
      dispatch(resetUnseenChanges());
      if (adjustedForPhone) goToCartPage();
    }
    dispatch(setCartIsOpen(!isOpen));
  };

  const handleResize = () => {
    if (window.innerWidth <= 480) {
      dispatch(setScreenWidthIsLessThan480(true));
    } else {
      dispatch(setScreenWidthIsLessThan480(false));
    }    
  }

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })

  useEffect(() => {
    handleResize();
    return () => {
      dispatch(setCartIsOpen(false));
    }
  }, [])

  //navigate function to change pages
  const navigateToPage = (path) => {
    dispatch(setCurrentPage(path));
    navigate(path);
  }

  const goToCartPage = () => {
    dispatch(setCartIsOpen(false));
    navigateToPage(Paths.CART); // Programmatically navigate to the /cart route
  }

  //buttons needed for cart
  const GoToCartPageBtnDetails = {
    visible: notAdjustedForPhone && cartIsNotEmpty,
    generalContent: "Finish",
    generalClassName: "home-page-cart-go-to-cart-page-button",
    activeAction: goToCartPage,
  }

  const buttonsDetails = [
    GoToCartPageBtnDetails
  ]
  



  return (
    <div className={`cart-container ${isOpen ? "open" : ""}`} style={{zIndex:`${CONSTANTS.Z_INDEXES.CART}`}}>
      <div 
        className={`cart-icon ${isAnimated ? ' animated ' : ''} ${unseenChanges ? ' show-dot ' : ''}`}
        onClick={toggleCart}
      >
        🛒
        <span className="cart-changed"></span>
      </div>
      {isOpen && (
        <div className="cart-content">
          <div className="cart-component-header-wrapper" >
            <h3 style={{padding:'8px'}}>Your Cart</h3>            
            <span className="cart-component-close-btn" onClick={toggleCart}>X</span>
          </div>
          <CheckOutItemsList parent={Paths.CART}/>
          {
            cartIsEmpty?
            <p className="cart-empty-text">Your cart is empty</p>:
            null
          }
          <ButtonsContainer buttonsDetails={buttonsDetails}/>        
        </div>
      )}
    </div>
  );
};

export default Cart;
