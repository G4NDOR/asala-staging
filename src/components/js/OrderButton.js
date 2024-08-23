// src/components/OrderButton.js

import React from "react";
import "../css/OrderButton.css";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import { resetIntentToPay, resetIntentToPayConfirmed, triggerIntentToPay, triggerIntentToPayConfirmed } from "../../redux/ducks/orderManager";

const OrderButton = ({ location }) => {
  // Retrieve cart from Redux state
  const dispatch = useDispatch();
  const cart = useSelector(state => state.orderManager.cart);
  const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);
  const navigate = useNavigate();
  const payClicked = useSelector(state => state.orderManager.intentToPay);
  const Confirmed = useSelector(state => state.orderManager.intentToPayConfirmed);

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

  // Calculate total price
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      const { quantity, discount, price } = item;
      const totalBeforeDiscounts = price * quantity;
      const finalTotal = (100 - discount) * totalBeforeDiscounts / 100;
      return total + finalTotal;
    }, 0);
  };

  const total = calculateTotalPrice();
  return (
    <button className={`order-button ${cartIsEmpty?'disabled':''}`} onClick={handleCartBtnClick}>
      {
        payClicked?
        <span style={{fontWeight: "600", fontSize:"1.5rem"}} >
        Confirm ${total.toFixed(2)}
        </span>:
        <span>
        Pay Now ${total.toFixed(2)}
        </span>
      }
    </button>
  );
};

export default OrderButton;
