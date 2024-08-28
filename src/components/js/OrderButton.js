// src/components/OrderButton.js

import React, { useEffect } from "react";
import "../css/OrderButton.css";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import { resetIntentToPay, resetIntentToPayConfirmed, triggerIntentToPay, triggerIntentToPayConfirmed } from "../../redux/ducks/orderManager";
import { resetLoading, triggerLoading } from "../../redux/ducks/appVars";
import ButtonsContainer from "./ButtonsContainer";
import SwipeConfirmation from "./SwipeConfirmation";

const OrderButton = ({location, test}) => {
  // Retrieve cart from Redux state
  const dispatch = useDispatch();
  const cart = useSelector(state => state.orderManager.cart);
  const productPageCart = useSelector(state => state.orderManager.oneItemCheckout);
  const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);
  const cartIsNotEmpty = !cartIsEmpty;
  const navigate = useNavigate();
  const adjustedForPhone = useSelector(state => state.appVars.screenWidthIsLessThan480);
  const notAdjustedForPhone =!adjustedForPhone;
  const payClicked = useSelector(state => state.orderManager.intentToPay);
  const payNotClicked = !payClicked;
  const Confirmed = useSelector(state => state.orderManager.intentToPayConfirmed);
  const isCartPage = (location == Paths.CART);
  const orderButtonIsActiveInCartPage = cartIsNotEmpty; // active when cart is not empty
  const orderButtonIsNotActiveInCartPage =!orderButtonIsActiveInCartPage;
  const isProductPage = (location == Paths.PRODUCT);
  const orderButtonIsActiveInProductPage = true;// because product page always has a product, by defenition it is a page for a certain product, do there's a product to buy => there should be an order button
  const orderButtonIsNotActiveInProductPage =!orderButtonIsActiveInProductPage;
  const hidden = isCartPage? orderButtonIsNotActiveInCartPage : orderButtonIsNotActiveInProductPage;
  const visible = !hidden;
  const mobileScreenConfirmation = visible && payClicked && adjustedForPhone;

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
    //return productPageCart.reduce((total, item) => {
    //  const { quantity, price } = item;
    //  const discount = item.discount.percentage; // Assuming discount is a percentage in the item object.
    //  const totalBeforeDiscounts = price * quantity;
    //  const finalTotal = (100 - discount) * totalBeforeDiscounts / 100;
    //  return total + finalTotal;
    //}, 0);
    return 1;
  }

  const calculateTotalPriceCart = () => {
    //return cart.reduce((total, item) => {
    //  const { quantity, price } = item;
    //  const discount = item.discount.percentage; // Assuming discount is a percentage in the item object.
    //  const totalBeforeDiscounts = price * quantity;
    //  const finalTotal = (100 - discount) * totalBeforeDiscounts / 100;
    //  return total + finalTotal;
    //}, 0);
    return 1;
  }

  const load = () => {
    //behind scenes work
    // fetch cart data from the backend
    dispatch(resetIntentToPay());

    //done with behind scenes work
    dispatch(resetLoading());
  }

  /*
  // buttons needed for the order section
  const PayOnlineButtonDetails = {
    active: true,
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "Pay Online",
    generalClassName: "home-page-product-card-pay-online-button",
    activeAction: makePaymentWithSquare,
    params:{}
  }
  const PayCashButtonDetails = {
    active: payClicked,
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "Pay Cash",
    generalClassName: "home-page-product-card-pay-cash-button",
    activeAction: makePaymentWithCash,
    params:{}
  }
  

  const buttonsDetails = [
    PayOnlineButtonDetails,
    PayCashButtonDetails,
  ]  
  */



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

  const onConfirm = () => {
    // The order has been confirmed
    makeCashPayment();
  }

  const onCancel = () => {
    // The order has been canceled
    dispatch(resetIntentToPay());
  }

  const makeOnlinePayment = () => {
    dispatch(triggerLoading());
    dispatch(resetIntentToPay());
    console.log("Make payment with Square");
    navigate(Paths.CONFIRMATION);
  }

  const makeCashPayment = () => {
    //confirmation received from buyer
    //make payment with cash
    dispatch(triggerLoading());
    console.log("Make payment with cash");
    dispatch(resetIntentToPay());
    navigate(Paths.CONFIRMATION);
    
  }

  const triggerIntentToMakeCashPayment = () => {
    dispatch(triggerIntentToPay());
  }

  const onlinePaymentButtonDetails = {
    visible: visible,
    generalContent: `Pay Now $${total.toFixed(2)}`,
    generalClassName: "home-page-and-product-page-online-payment-button",
    activeAction: makeOnlinePayment,
  }

  const inPersonPaymentButtonDetails = {
    visible: visible && payNotClicked,
    generalContent: "Cash",
    generalClassName: "home-page-and-product-page-in-person-payment-button",
    activeAction: triggerIntentToMakeCashPayment,
  }

  const inPersonPaymentConfirmationButtonDetails = {
    visible:  visible && payClicked && notAdjustedForPhone,
    generalContent: `Confirm $${total.toFixed(2)}`,
    generalClassName: "home-page-and-product-page-in-person-payment-confirmation-button",
    activeAction: makeCashPayment,
  }

  const buttonsDetails = [
    onlinePaymentButtonDetails,
    inPersonPaymentButtonDetails,
    inPersonPaymentConfirmationButtonDetails
  ]


  return (
    <>
      <SwipeConfirmation active={mobileScreenConfirmation} onCancel={onCancel} onConfirm={onConfirm} />    
      <ButtonsContainer buttonsDetails={buttonsDetails}/>
    </>
  );
};

export default OrderButton;
