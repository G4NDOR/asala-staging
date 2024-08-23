import React, { useEffect, useState } from "react";
import "../styles/CartPage.css";
import CheckOutItemsList from "../components/js/CheckOutItemsList";

import { useDispatch, useSelector } from 'react-redux';
import { CART } from "../constants/stateKeys";
import GoHomeBtn from "../components/js/GoHomeBtn";
import OrderButton from "../components/js/OrderButton";
import { resetLoading, triggerLoading } from "../redux/ducks/appVars";
import LoadingAnimation from "../components/js/LoadingAnimation";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartIsEmpty = useSelector((state) => state.orderManager.cartIsEmpty);

  useEffect(() => {
    dispatch(resetLoading());
  
    return () => {
      dispatch(triggerLoading());
    }
  }, [])

  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 10.0,
      status: "present",
      description: " little short description...",
      image:
        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
      wishes: 500,
      available: true,
      producer: "Asala",
      availableTime: "Mo,Tu,We,Th,Fr 8-5",
      quantity: 3,
      discount: 10,
    },
    {
      id: 2,
      name: "Product 2",
      price: 20.0,
      status: "future",
      description: " little short description...",
      image:
        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
      wishes: 700,
      available: true,
      producer: "Asala",
      availableTime: "Mo,Tu,We,Th,Fr 8-5",
      quantity: 5,
      discount: 0,
    },
    {
      id: 3,
      name: "Product 3",
      price: 30.0,
      status: "future",
      description: " little short description...",
      image:
        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
      wishes: 50,
      available: true,
      producer: "Asala",
      availableTime: "Mo,Tu,We,Th,Fr 8-5",
      quantity: 15,
      discount: 50,
    },
  ];

  return (
    <div className="container" style={{}}>
      <LoadingAnimation/>
      <GoHomeBtn/>
      
      <div className="cart-items-wrapper" style={{
      
      }}>
        {
          !cartIsEmpty ? (
            <CheckOutItemsList listIdentifier={CART}/>
          ) : (
            <p className="cart-empty-text">Your cart is empty</p>
          )
        }
      </div>
      <OrderButton />
      {
        //<Payment/> when payment is integrated into the website
      }
    </div>
  );
};

export default CartPage;
