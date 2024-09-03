import React from 'react'
import { useSelector } from 'react-redux';
import CONSTANTS from '../../constants/appConstants';
import Paths from '../../constants/navigationPages';
import { calculateTotalListPriceWithAppliedDiscountsAndUsedCredit, calculateTotalListPriceWithoutDiscounts, formatPhoneNumberStyle2 } from '../../utils/appUtils';
import '../css/ConfirmationInfo.css'
import CheckoutContactInfo from './CheckoutContactInfo';
import CheckoutItemMini from './CheckoutItemMini';
import CheckoutTotalSection from './CheckoutTotalSection';

export default function ConfirmationInfo({visible=true, parent}) {

  const paymentMethod = useSelector(state => state.orderManager.paymentMethod);
  const customerName = useSelector(state => state.orderManager.name);
  const customerEmail = useSelector(state => state.orderManager.email);
  const customerPhone = useSelector(state => state.orderManager.phone);
  const customerAddress = useSelector(state => state.productPageManager.address);
  const cart = useSelector(state => state.orderManager.cart);
  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts[parent]);
  const usedCredit = useSelector(state => state.orderManager.usedCredit);
  const productPageCart = useSelector(state => state.orderManager.oneItemCheckout);
  const currentPage = useSelector(state => state.appVars.currentPage);
  const isCartPage = currentPage == Paths.CART;
  const itemsList = isCartPage? cart : productPageCart;

  

    const getPaymentMethod = (paymentMethod) =>{
        const paymentMethods = CONSTANTS.PAYMENT_METHODS;
        switch(paymentMethod){
            case paymentMethods.ONLINE:
                return "Online";
            case paymentMethods.CASH:
                return "Cash";
            default:
                return "Unknown";
        }
    }

    //general information
    const _paymentMethod = getPaymentMethod(paymentMethod);
    /*
    const items = [
    { name: "Item 1", quantity: 2, price: 10.00, discount: 2.00 },
    { name: "Item 2", quantity: 1, price: 15.00, discount: 3.00 },
    { name: "Item 3", quantity: 3, price: 7.50, discount: 1.50 },
    ];
    */
    //merchants, producers, vendors bought from
    const merchants = itemsList.reduce((merchants, item) => {
      const merchant = item.producer.name;
      if (!merchants.includes(merchant)) {
        merchants.push(merchant);
      }
      return merchants;
    }, []);
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
    const merchantPhone = "123-456-7890";//TO DO: replace with actual merchant phone
    contactInfo.push(merchantPhone);
    const merchantEmail = "info@asala.com";//TO DO: replace with actual merchant email
    contactInfo.push(merchantEmail);
    const merchantWebsite = "www.asala.com";//TO DO: replace with actual merchant website
    contactInfo.push(merchantWebsite);
    const returnPolicy = "No returns allowed!";//TO DO: replace with actual return policy

    const contact = {
      merchants: merchants,// array of merchant names
      date: date,
      address: customerAddress,
      customerContacts: customerContact,// array of strings representing customer contact info
      returnPolicy: returnPolicy,
      contactInfo: contactInfo,// array of strings representing merchant contact info
    }

    const subtotal = calculateTotalListPriceWithoutDiscounts(itemsList);
    const total_without_xtra_fees = calculateTotalListPriceWithAppliedDiscountsAndUsedCredit(itemsList, selectedDiscounts, usedCredit);
    const discount = Math.abs(total_without_xtra_fees - subtotal);
    const delivery = 5;// TODO: replace with actual delivery cost
    const tax = 0;// TODO: replace with actual tax rate
    const Total = total_without_xtra_fees + delivery + tax;

    //charges
    const CHARGE_INFO_TYPES = CONSTANTS.CHARGE_INFO_TYPES;
    const charges = [
      { type: CHARGE_INFO_TYPES.SUBTOTAL, value: subtotal },
      { type: CHARGE_INFO_TYPES.DISCOUNT, value: discount },
      { type: CHARGE_INFO_TYPES.DELIVERY, value: delivery },
      { type: CHARGE_INFO_TYPES.TAX, value: tax },
      { type: CHARGE_INFO_TYPES.TOTAL, value: Total },
      { type: CHARGE_INFO_TYPES.SAVINGS, value: discount },
    ];

    // strings to be displayed in html elements
    const titleString = `Order Summary (${itemsList.length} Items)`;
    const paymentMethodString = `Payment Method: ${_paymentMethod}`;
  

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
