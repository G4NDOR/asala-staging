import React from 'react'
import { useSelector } from 'react-redux';
import CONSTANTS from '../../constants/appConstants';
import '../css/ConfirmationInfo.css'
import CheckoutContactInfo from './CheckoutContactInfo';
import CheckoutItemMini from './CheckoutItemMini';
import CheckoutTotalSection from './CheckoutTotalSection';

export default function ConfirmationInfo() {

  const paymentMethod = useSelector(state => state.orderManager.paymentMethod);

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
    const items = [
    { name: "Item 1", quantity: 2, price: 10.00, discount: 2.00 },
    { name: "Item 2", quantity: 1, price: 15.00, discount: 3.00 },
    { name: "Item 3", quantity: 3, price: 7.50, discount: 1.50 },
    ];

    const contactInfo = {
        merchantName: "Asala",
        date: "2024-08-27",
        customerName: "John Doe",
        customerContact: "+1 234-567-890",
        returnPolicy: "No returns allowed!",
        contactInfo: "123-456-7890 | info@asala.com | www.asala.com",
    }

    //charges
    const CHARGE_INFO_TYPES = CONSTANTS.CHARGE_INFO_TYPES;
    const charges = [
        { type: CHARGE_INFO_TYPES.SUBTOTAL, value: 50.50 },
        { type: CHARGE_INFO_TYPES.DISCOUNT, value: 5.00 },
        { type: CHARGE_INFO_TYPES.DELIVERY, value: 3.00 },
        { type: CHARGE_INFO_TYPES.TAX, value: 2.50 },
        { type: CHARGE_INFO_TYPES.TOTAL, value: 57.00 },
        { type: CHARGE_INFO_TYPES.SAVINGS, value: 2.50 },
    ];

    // strings to be displayed in html elements
    const titleString = `Order Summary (${items.length} Items)`;
    const paymentMethodString = `Payment Method: ${_paymentMethod}`;
  

  return (
    <div className="confirmation-info">
        <CheckoutContactInfo info={contactInfo} />

      <div className="confirmation-info-order-summary">
        <span className='confirmation-info-title'>{titleString}</span>
        <ul>
          {items.map((item, index) => <CheckoutItemMini key={index} item={item}/>)}
        </ul>
      </div>
      <CheckoutTotalSection charges={charges}/>

      <div className="confirmation-info-payment-method">
        <p>{paymentMethodString}</p>
      </div>
    </div>
  );
}
