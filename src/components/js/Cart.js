// src/components/Cart.js

import React, { useEffect, useState } from "react";
//import CSS
import "../css/Cart.css";
//import Components
import CartItem from "./CartItem";
import OrderButton from "./OrderButton";
import CheckOutItemsList from "./CheckOutItemsList";
//import Redux
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from'react-router-dom';
import { resetUnseenChanges, setCartIsOpen } from "../../redux/ducks/orderManager";
//import Navigation

import { CART } from "../../constants/stateKeys";
import Paths from "../../constants/navigationPages";
import GoToCartPageBtn from "./GoToCartPageBtn";
import { setScreenWidthIsLessThan480 } from "../../redux/ducks/appVars";
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
      dispatch(resetUnseenChanges());
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

  //buttons needed for cart
  const GoToCartPageBtnDetails = {
    visible: notAdjustedForPhone && cartIsNotEmpty,
    generalContent: "Finish",
    generalClassName: "home-page-cart-go-to-cart-page-button",
    activeAction: () => {
      dispatch(setCartIsOpen(false));
      navigate(Paths.CART); // Programmatically navigate to the /cart route
    },
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
          <span className="close-btn" onClick={toggleCart}>X</span>
          <h3 style={{padding:'8px'}}>Your Cart</h3>
          {
            cartIsNotEmpty ? (
              <CheckOutItemsList listIdentifier={CART}/>
            ) : (
              <p className="cart-empty-text">Your cart is empty</p>
            )
          }
          {
            adjustedForPhone && cartIsNotEmpty?
            <OrderButton location={Paths.CART}/>:
            <ButtonsContainer buttonsDetails={buttonsDetails}/>
          }
        </div>
      )}
    </div>
  );
};

export default Cart;
