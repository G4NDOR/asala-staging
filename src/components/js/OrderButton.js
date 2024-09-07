// src/components/OrderButton.js

import React, { useEffect, useState } from "react";
import "../css/OrderButton.css";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import { resetIntentToPay, resetIntentToPayConfirmed, setDeliveryFee, setPaymentMethod, setProducers, triggerIntentToPay, triggerIntentToPayConfirmed } from "../../redux/ducks/orderManager";
import { addMessage, resetLoading, setCurrentPage, triggerLoading } from "../../redux/ducks/appVars";
import ButtonsContainer from "./ButtonsContainer";
import SwipeConfirmation from "./SwipeConfirmation";
import CONSTANTS from "../../constants/appConstants";
import { calculatePriceForItem, calculateTotalListPriceWithAppliedDiscountsAndUsedCredit, calculateTotalListPriceWithoutDiscounts, findAppliedDiscount, formatPhoneNumberStyle2, getDeliveryFee, getPriceWithDiscountApplied } from "../../utils/appUtils";
import { FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import PaymentForm from "./PaymentForm";
import ConfirmationInfo from "./ConfirmationInfo";
import { tryPlacingOrder } from "../../utils/firestoreUtils";

const OrderButton = ({test, parent}) => {
  // Retrieve cart from Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [charges, setCharges] = useState([]);
  const [order, setOrder] = useState({})
  const customerName = useSelector(state => state.orderManager.name);
  const customerEmail = useSelector(state => state.orderManager.email);
  const customerPhone = useSelector(state => state.orderManager.phone);
  const address = useSelector(state => state.productPageManager.address);
  // const addresses = useSelector(state => state.productPageManager.addresses);
  const cart = useSelector(state => state.orderManager.cart);
  const productPageCart = useSelector(state => state.orderManager.oneItemCheckout);
  const usedCredit = useSelector(state => state.orderManager.usedCredit);
  const paymentMethod = useSelector(state => state.orderManager.paymentMethod);
  const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);
  const cartIsNotEmpty = !cartIsEmpty;
  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts[parent]);
  const adjustedForPhone = useSelector(state => state.appVars.screenWidthIsLessThan480);
  const isMobileScreen = adjustedForPhone;
  const isNotMobileScreen =!isMobileScreen;
  const payClicked = useSelector(state => state.orderManager.intentToPay);
  const payNotClicked = !payClicked;
  const Confirmed = useSelector(state => state.orderManager.intentToPayConfirmed);
  const currentPage = useSelector(state => state.appVars.currentPage);
  const isHomePage = currentPage == Paths.HOME;
  const isCartPage = currentPage == Paths.CART;
  const baseDeliveryDistance = useSelector(state => state.appVars.baseDeliveryDistance);
  const baseDeliveryFee = useSelector(state => state.appVars.baseDeliveryFee);
  const deliveryPricePerMile = useSelector(state => state.appVars.deliveryPricePerMile);
  const taxFee = useSelector(state => state.appVars.taxFee);  

  const customerId = useSelector(state => state.appVars.customerId);
  const notes = useSelector(state => state.productPageManager.notes);
  // const totalPrice = useSelector(state => state.orderManager.totalPrice);
  // const deliveryFee = useSelector(state => state.orderManager.deliveryFee);
  // const producers = useSelector(state => state.orderManager.producers);
  const geopoint = useSelector(state => state.productPageManager.geopoint); 
  const merchantPhoneNumber = useSelector(state => state.appVars.phoneNumber);
  const merchantWebsite = useSelector(state => state.appVars.website);
  const merchantEmail = useSelector(state => state.appVars.email); 
  const returnPolicy = useSelector(state => state.appVars.returnPolicy);

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


  // order button is always active in the product page
  // because product page always has a product,
  // by defenition it is a page for a certain product,
  // so there's a product to buy => there should be an order button
  const orderButtonIsActiveInProductPage = true;
  const visible = isCartPage? orderButtonIsActiveInCartPage : orderButtonIsActiveInProductPage;
  const mobileScreenConfirmation = visible && payClicked && isMobileScreen;
  const itemsList = isCartPage? cart : productPageCart;


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

  const total = calculateTotalListPriceWithAppliedDiscountsAndUsedCredit(itemsList,selectedDiscounts, usedCredit);

  const onConfirm = async () => {
    // The order has been confirmed
    console.log('************************************************************************************=======')
    const result = await tryPlacingOrder(order);
    console.log('================================================================')
    console.log('result',result);
    const isOnlinePayment = paymentMethod == CONSTANTS.PAYMENT_METHODS.ONLINE;
    const isCashPayment = paymentMethod == CONSTANTS.PAYMENT_METHODS.CASH;
    if (isOnlinePayment) {
      makeOnlinePayment()
    }else if (isCashPayment) {
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

  const validateIntentToPay = ({paymentMethod}) => {
    if (address === '') {
      const message = { content: 'Please select an address!', severity: CONSTANTS.SEVERITIES.ERROR }
      dispatch(addMessage(message))
      return false;
    }
    if (customerName === '') {
      const message = { content: 'Name is required!', severity: CONSTANTS.SEVERITIES.ERROR }
      dispatch(addMessage(message))
      return false;
    } 
    if (customerEmail === '') {
      const message = { content: 'Email is required!', severity: CONSTANTS.SEVERITIES.ERROR }
      dispatch(addMessage(message))
      return false;
    }
    if (customerPhone === '') {
      const message = { content: 'Phone Number is required!', severity: CONSTANTS.SEVERITIES.ERROR }
      dispatch(addMessage(message))
      return false;
    }
    //merchants, producers, vendors bought from
    const merchantsIds = [];
    const locations = [geopoint];
    const merchants = itemsList.reduce((merchants, item) => {
      const merchantId = item.producer.id;
      console.log('producer object:', item.producer);
      const loaction = item.producer.location;
      if (!merchantsIds.includes(merchantId)) {
        merchantsIds.push(merchantId)
        locations.push(loaction)
      };
      const merchant = item.producer.name;
      if (!merchants.includes(merchant)) {
        merchants.push(merchant);
      }
      return merchants;
    }, []);
    locations.push(geopoint);
    // dispatch(setProducers(merchantsIds));   
    //date for the order
    const today = new Date();
    const date = today.toISOString().split('T')[0];       
    //customer contact information
    const customerContact = [];
    customerContact.push(customerName);
    const formattedCustomerPhone = formatPhoneNumberStyle2(customerPhone);
    customerContact.push(formattedCustomerPhone);
    customerContact.push(customerEmail);    
    const contactInfo = [];
    contactInfo.push(merchantPhoneNumber);
    contactInfo.push(merchantEmail);
    contactInfo.push(merchantWebsite);    
    const contact = {
      merchants: merchants,// array of merchant names
      date: date,
      address: address,
      customerContacts: customerContact,// array of strings representing customer contact info
      returnPolicy: returnPolicy,
      contactInfo: contactInfo,// array of strings representing merchant contact info
    }   
    setContact(contact);
    //Charges information
    const subtotal = calculateTotalListPriceWithoutDiscounts(itemsList);
    const total_without_xtra_fees = calculateTotalListPriceWithAppliedDiscountsAndUsedCredit(itemsList, selectedDiscounts, usedCredit);
    const discount = Math.abs(total_without_xtra_fees - subtotal);
    console.log('locations: ', locations)
    const deliveryFee = getDeliveryFee(locations, baseDeliveryDistance, baseDeliveryFee, deliveryPricePerMile);
    // dispatch(setDeliveryFee(deliveryFee));
    const tax = taxFee;// TODO: replace with actual tax rate
    const Total = total_without_xtra_fees + deliveryFee + tax;
    // dispatch(setTotalPrice(Total));
    const CHARGE_INFO_TYPES = CONSTANTS.CHARGE_INFO_TYPES;
    const charges = [
      { type: CHARGE_INFO_TYPES.SUBTOTAL, value: subtotal },
      { type: CHARGE_INFO_TYPES.DISCOUNT, value: discount },
      { type: CHARGE_INFO_TYPES.DELIVERY, value: deliveryFee },
      { type: CHARGE_INFO_TYPES.TAX, value: tax },
      { type: CHARGE_INFO_TYPES.TOTAL, value: Total },
      { type: CHARGE_INFO_TYPES.SAVINGS, value: discount },
    ]
    setCharges(charges);
    setOrder({
      status: 'pending',
      cancelations: [],
      notes: notes,
      phone: customerPhone,
      destination: geopoint,
      customerId: customerId,
      'payment-method': paymentMethod,
      'total-price': Total,
      'delivery-price': deliveryFee,
      discounts: selectedDiscounts,
      'payment-successful': false,
      items: itemsList,
      //deliverySpeed,
      usedCredit,
      merchantsIds
    })    
    dispatch(triggerIntentToPay());
    dispatch(setPaymentMethod(paymentMethod))
    return;
  }

  const onlinePaymentButtonDetails = {
    visible: visible && payNotClicked,
    generalContent: `Pay Now $${total.toFixed(2)}`,
    generalClassName: "home-page-and-product-page-online-payment-button",
    activeAction: validateIntentToPay,
    params:{
      paymentMethod: CONSTANTS.PAYMENT_METHODS.ONLINE,
    }
  }

  const inPersonPaymentButtonDetails = {
    visible: visible && payNotClicked,
    generalContent: "Cash",
    generalClassName: "home-page-and-product-page-in-person-payment-button",
    activeAction: validateIntentToPay,
    params:{
      paymentMethod: CONSTANTS.PAYMENT_METHODS.CASH,
    }
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
      <ConfirmationInfo contact={contact} charges={charges} parent={parent} visible={visible && payClicked && isNotMobileScreen} />
      {
        //<Receipt parent={parent} visible={visible && payClicked && isNotMobileScreen}/>
      }
      <PaymentForm visible={visible && payNotClicked}/>
      <SwipeConfirmation contact={contact} charges={charges} parent={parent} active={mobileScreenConfirmation} onCancel={onCancel} onConfirm={onConfirm} />    
      <ButtonsContainer buttonsDetails={buttonsDetails}/>
    </>
  );
};

export default OrderButton;
