// src/components/OrderButton.js

import React, { useEffect } from "react";
import "../css/OrderButton.css";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import { resetIntentToPay, resetIntentToPayConfirmed, setPaymentMethod, triggerIntentToPay, triggerIntentToPayConfirmed } from "../../redux/ducks/orderManager";
import { resetLoading, setCurrentPage, triggerLoading } from "../../redux/ducks/appVars";
import ButtonsContainer from "./ButtonsContainer";
import SwipeConfirmation from "./SwipeConfirmation";
import CONSTANTS from "../../constants/appConstants";
import { calculatePriceForItem, calculateTotalPrice, findAppliedDiscount, getPriceWithDiscountApplied } from "../../utils/appUtils";
import { FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import PaymentForm from "./PaymentForm";

const OrderButton = ({test}) => {
  // Retrieve cart from Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.orderManager.cart);
  const productPageCart = useSelector(state => state.orderManager.oneItemCheckout);
  const usedCredit = useSelector(state => state.orderManager.usedCredit);
  const paymentMethod = useSelector(state => state.orderManager.paymentMethod);
  const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);
  const cartIsNotEmpty = !cartIsEmpty;
  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts);
  const adjustedForPhone = useSelector(state => state.appVars.screenWidthIsLessThan480);
  const isMobileScreen = adjustedForPhone;
  const isNotMobileScreen =!isMobileScreen;
  const payClicked = useSelector(state => state.orderManager.intentToPay);
  const payNotClicked = !payClicked;
  const Confirmed = useSelector(state => state.orderManager.intentToPayConfirmed);
  const currentPage = useSelector(state => state.appVars.currentPage);
  const isHomePage = currentPage == Paths.HOME;
  const isCartPage = currentPage == Paths.CART;

  //it's the cart component in the home page if the current page is the home page
  //because order btn is called in cart component in home page, cart page and product page
  //when in cart page => current page is cart page
  //when in product page => current page is product page
  //when in cart component in the home page => current page is home page
  const isCartComponentInHomePage = isHomePage;

  // if in cart page, order button is active when cart is not empty
  // active when cart is not empty
  const orderButtonIsActiveInCartPage = cartIsNotEmpty; 

  // if in cart component in the home page, order button is active: 
    // when the cart component in the home page is not empty AND it's a mobile screen
  // because if it's a mobile screen,:
    // the cart component in the home page is expanded to cover the whole screen,
    // so it acts as a cart page
    // people can checkout and make payment in cart component in the home page,
    // without going to the cart page
  // if it's not a mobile screen => it's a large screen,
    //the cart component is only taking a small window in the screen
    //peope have to go to the cart page to make payment
  //new update: order button is no longer active in the cart component in the home page
  const orderButtonIsActiveInCartComponentInHomePage = false;//isMobileScreen && cartIsNotEmpty;

  //  the order btn is in cart (isCart), if it's either the cart component in the home page or the cart page
  //otherwise, it's in the product page with the one item checkout, (not including cart items when placing order, just items shown in product page)
  //since those are the only places where order button is visible
  const isCart = isCartComponentInHomePage || isCartPage;

  const orderButtonIsActiveInCart = isCartComponentInHomePage? orderButtonIsActiveInCartComponentInHomePage: orderButtonIsActiveInCartPage;


  // order button is always active in the product page
  // because product page always has a product,
  // by defenition it is a page for a certain product,
  // so there's a product to buy => there should be an order button
  const orderButtonIsActiveInProductPage = true;
  const visible = isCart? orderButtonIsActiveInCart : orderButtonIsActiveInProductPage;
  const mobileScreenConfirmation = visible && payClicked && isMobileScreen;
  const itemsList = isCart? cart : productPageCart;

  useEffect(() => {
    
    load();
  
    return () => {
      if(Confirmed) dispatch(triggerLoading());
      dispatch(resetIntentToPay());
    }
  }, [])

  //navigate function to change pages
  const navigateToPage = (path) => {
    dispatch(setCurrentPage(path));
    navigate(path);
  }  
  

  const handleCartBtnClick = () => {
    //if(!payClicked) {
    //  console.log("finalize order");
    //  dispatch(resetIntentToPayConfirmed());
    //  dispatch(triggerIntentToPay());
    //  if (currentPage == Paths.HOME)
    //    navigateToPage(Paths.CART); // Programmatically navigate to the /cart route
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
    navigateToPage(Paths.CONFIRMATION);
  }

  const makePaymentWithCash = () => {
    if(payClicked) {
      //confirmation received from buyer
      //make payment with cash
      dispatch(triggerLoading());
      console.log("Make payment with cash");
      dispatch(resetIntentToPay());
      navigateToPage(Paths.CONFIRMATION);
    }else{
      //confirmation not received from buyer
      dispatch(triggerIntentToPay());
    }
    
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

  const total = calculateTotalPrice(itemsList,selectedDiscounts, usedCredit);

  const onConfirm = () => {
    // The order has been confirmed
    const isOnlinePayment = paymentMethod == CONSTANTS.PAYMENT_METHODS.ONLINE;
    if (isOnlinePayment) {
      makeOnlinePayment()
    }else{
      makeCashPayment()
    }
    return;
  }

  const onCancel = () => {
    // The order has been canceled
    dispatch(resetIntentToPay());
  }

  const makeOnlinePayment = () => {
    dispatch(triggerLoading());
    
    dispatch(resetIntentToPay());
    console.log("Make payment with Square");
    navigateToPage(Paths.CONFIRMATION);
  }

  const makeCashPayment = () => {
    //confirmation received from buyer
    //make payment with cash
    dispatch(triggerLoading());


    
    dispatch(resetIntentToPay());
    console.log("Make payment with cash");
    navigateToPage(Paths.CONFIRMATION);
    
  }

  const proceedWithPayment = () => {
    // The order has been confirmed
    const isOnlinePayment = paymentMethod == CONSTANTS.PAYMENT_METHODS.ONLINE;
    if (isOnlinePayment) {
      makeOnlinePayment()
    }else{
      makeCashPayment()
    }
    return;
  }

  const triggerIntentToMakeCashPayment = () => {
    
    const paymentMethod = CONSTANTS.PAYMENT_METHODS.CASH;
    dispatch(triggerIntentToPay());
    
    dispatch(setPaymentMethod(paymentMethod))
  }

  const triggetIntentToMakeOnlinePayment = () => {
    const paymentMethod = CONSTANTS.PAYMENT_METHODS.ONLINE;
    //if (isNotMobileScreen) {
    //  makeOnlinePayment();
    //  return;
    //}
    dispatch(triggerIntentToPay());
    dispatch(setPaymentMethod(paymentMethod))
  }

  const onlinePaymentButtonDetails = {
    visible: visible && payNotClicked,
    generalContent: `Pay Now $${total.toFixed(2)}`,
    generalClassName: "home-page-and-product-page-online-payment-button",
    activeAction: triggetIntentToMakeOnlinePayment,
  }

  const inPersonPaymentButtonDetails = {
    visible: visible && payNotClicked,
    generalContent: "Cash",
    generalClassName: "home-page-and-product-page-in-person-payment-button",
    activeAction: triggerIntentToMakeCashPayment,
  }

  const PaymentConfirmationButtonDetails = {
    visible:  visible && payClicked && isNotMobileScreen,
    generalContent: `Confirm $${total.toFixed(2)} ${paymentMethod}`,
    generalClassName: "home-page-and-product-page-in-person-payment-confirmation-button",
    activeAction: proceedWithPayment,
  }

  const cancelPaymentButtonDetails = {
    visible: visible && payClicked && isNotMobileScreen,
    generalContent: "Cancel",
    generalClassName: "home-page-and-product-page-cancel-payment-button",
    activeAction: onCancel,
  }

  const buttonsDetails = [
    onlinePaymentButtonDetails,
    inPersonPaymentButtonDetails,
    PaymentConfirmationButtonDetails,
    cancelPaymentButtonDetails
  ]


  return (
    <>
      <PaymentForm visible={visible}/>
      <SwipeConfirmation active={mobileScreenConfirmation} onCancel={onCancel} onConfirm={onConfirm} />    
      <ButtonsContainer buttonsDetails={buttonsDetails}/>
    </>
  );
};

export default OrderButton;
