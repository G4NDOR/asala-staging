// src/components/OrderButton.js

import React, { useEffect } from "react";
import "../css/OrderButton.css";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import { resetIntentToPay, resetIntentToPayConfirmed, triggerIntentToPay, triggerIntentToPayConfirmed } from "../../redux/ducks/orderManager";
import { resetLoading, triggerLoading } from "../../redux/ducks/appVars";

const OrderButton = ({location, test}) => {
  // Retrieve cart from Redux state
  const dispatch = useDispatch();
  const cart = useSelector(state => state.orderManager.cart);
  const productPageCart = useSelector(state => state.orderManager.oneItemCheckout);
  const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);
  const navigate = useNavigate();
  const payClicked = useSelector(state => state.orderManager.intentToPay);
  const Confirmed = useSelector(state => state.orderManager.intentToPayConfirmed);
  const disabled = (location == Paths.CART)? cartIsEmpty : false;

  useEffect(() => {
    
    load();
  
    return () => {
      if(Confirmed) dispatch(triggerLoading());
      dispatch(resetIntentToPay());
    }
  }, [])
  

  const handleCartBtnClick = () => {
    //if(!payClicked) {
    //  console.log("finalize order");
    //  dispatch(resetIntentToPayConfirmed());
    //  dispatch(triggerIntentToPay());
    //  if (location == Paths.HOME)
    //    navigate(Paths.CART); // Programmatically navigate to the /cart route
    //} else {
    //  console.log("call server to make order");
    //  dispatch(triggerIntentToPayConfirmed());
    //  dispatch(resetIntentToPay());
    //}
    console.log("call server to make order");

  }

  const makePaymentWithSquare = () => {
    dispatch(triggerLoading());
    dispatch(resetIntentToPay());
    console.log("Make payment with Square");
    navigate(Paths.CONFIRMATION);
  }

  const makePaymentWithCash = () => {
    if(payClicked) {
      //confirmation received from buyer
      //make payment with cash
      dispatch(triggerLoading());
      console.log("Make payment with cash");
      dispatch(resetIntentToPay());
      navigate(Paths.CONFIRMATION);
    }else{
      //confirmation not received from buyer
      dispatch(triggerIntentToPay());
    }
    
  }

  const calculateTotalPriceProductPageCart = () =>   {
    return productPageCart.reduce((total, item) => {
      const { quantity, price } = item;
      const discount = item.discount.percentage; // Assuming discount is a percentage in the item object.
      const totalBeforeDiscounts = price * quantity;
      const finalTotal = (100 - discount) * totalBeforeDiscounts / 100;
      return total + finalTotal;
    }, 0);
  }

  const calculateTotalPriceCart = () => {
    return cart.reduce((total, item) => {
      const { quantity, price } = item;
      const discount = item.discount.percentage; // Assuming discount is a percentage in the item object.
      const totalBeforeDiscounts = price * quantity;
      const finalTotal = (100 - discount) * totalBeforeDiscounts / 100;
      return total + finalTotal;
    }, 0);
  }

  const load = () => {
    //behind scenes work
    // fetch cart data from the backend
    dispatch(resetIntentToPay());

    //done with behind scenes work
    dispatch(resetLoading());
  }



  // Calculate total price
  const calculateTotalPrice = () => {
    switch (location) {
      case Paths.PRODUCT:
        return calculateTotalPriceProductPageCart();
      case Paths.CART:
        return calculateTotalPriceCart();
      default:
        return 0; // Return 0 if the location is neither product page nor cart.
    }
  };
  

  const total = calculateTotalPrice();


  return (
    <>
    <button className={`order-button square ${disabled?'disabled':''}`} onClick={makePaymentWithSquare}>
      {
        false?
        <span style={{fontWeight: "600", fontSize:"1.5rem"}} >
        Confirm ${total.toFixed(2)}
        </span>:
        <span>
        Pay Now ${total.toFixed(2)}
        </span>
      }
    </button>    
    <button className={`order-button cash ${payClicked?'confirm-stage':''} ${disabled?'disabled':''}`} onClick={makePaymentWithCash}>
      {
        payClicked?
        <span style={{fontWeight: "600", fontSize:"1.5rem"}} >
        Confirm ${total.toFixed(2)}
        </span>:
        <span>
        Cash 
        </span>
      }
    </button>    
    </>
  );
};

export default OrderButton;
