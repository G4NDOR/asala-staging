import React from 'react'
import '../css/CheckoutContactInfo.css'

export default function CheckoutContactInfo({info}) {
    //general information
    const {
        merchantName,
        receiptId,
        date,
        customerName,
        customerContact,
        returnPolicy,
        contactInfo,
    } = info;

    // strings to be displayed in html elements
    const merchantNameString = `${merchantName}`;
    const idString = receiptId? `Receipt ID: ${receiptId}`: null;
    const dateString = `Date: ${date}`;
    const contactInfoString = `Contact: ${contactInfo}`;
    const customerInfoString = `Customer: ${customerName} | ${customerContact}`;
    const returnPolicyString = `Return Policy: ${returnPolicy}`;    

    const infoStrings = [
        merchantNameString,
        idString,
        dateString,
        contactInfoString,
        customerInfoString,
        returnPolicyString,
    ]
    const filtredInfoStrings = infoStrings.filter(info => info !== null);

  return (
    <div className='checkout-contact-info' >
      <h1 className='checkout-contact-info-merchant-name'>{merchantNameString}</h1>
      <div className="checkout-contact-info-content">
        {
            filtredInfoStrings.map((info, index) => <span key={index}>{info}</span>)
        }
      </div>        
    </div>
  )
}
