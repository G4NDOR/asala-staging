import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import CONSTANTS from '../../constants/appConstants';
import Paths from '../../constants/navigationPages';
import { setDeliveryPricePerMile } from '../../redux/ducks/appVars';
import { setDeliveryFee, setProducers, setTotalPrice } from '../../redux/ducks/orderManager';
import { calculateTotalListPriceWithAppliedDiscountsAndUsedCredit, calculateTotalListPriceWithoutDiscounts, formatPhoneNumberStyle2, getDeliveryFee } from '../../utils/appUtils';
import '../css/ConfirmationInfo.css'
import CheckoutContactInfo from './CheckoutContactInfo';
import CheckoutItemMini from './CheckoutItemMini';
import CheckoutTotalSection from './CheckoutTotalSection';

export default function ConfirmationInfo({visible=true, parent, contact, charges}) {
  const dispatch = useDispatch();
  const paymentMethod = useSelector(state => state.orderManager.paymentMethod);
  const cart = useSelector(state => state.orderManager.cart);
  const productPageCart = useSelector(state => state.orderManager.oneItemCheckout);
  const currentPage = useSelector(state => state.appVars.currentPage);
  const isCartPage = currentPage == Paths.CART;
  const itemsList = isCartPage? cart : productPageCart;
  const paymentMethods = CONSTANTS.PAYMENT_METHODS;
  // strings to be displayed in html elements
  const titleString = `Order Summary (${itemsList.length} Items)`;
  const paymentMethodString = `Payment Method: ${
    paymentMethod === paymentMethods.ONLINE?
    "Online":
    (paymentMethod === paymentMethods.CASH?
    "CASH":
    "Unknown")
  }`;

  

  return (
    <div className={`confirmation-info ${visible?'':'invisible'}`}>
        <CheckoutContactInfo info={contact} />

      <div className="confirmation-info-order-summary">
        <span className='confirmation-info-title'>{titleString}</span>
        <ul>
          {itemsList.map((item, index) => <CheckoutItemMini parent={parent} key={index} item={item}/>)}
        </ul>
      </div>
      <CheckoutTotalSection charges={charges}/>

      <div className="confirmation-info-payment-method">
        <p>{paymentMethodString}</p>
      </div>
    </div>
  );
}
