import React from 'react'
import '../css/CheckoutContactInfo.css'

export default function CheckoutContactInfo({info}) {
    //general information
    console.log('info: ', info)
    if (!info) return null;
    const {
        merchants,// array of strings
        receiptId,
        date,
        address,
        customerContacts,//array of strings
        returnPolicy,
        contactInfo,// array of strings
    } = info;

    // strings to be displayed in html elements
    const delimiter = ' | ';
    const merchantNameString = merchants.join(delimiter);;
    const idString = receiptId? `Receipt ID: ${receiptId}`: null;
    const dateString = `Date: ${date}`;
    const contactInfoString = `Contact: ${contactInfo.join(delimiter)}`;
    const customerInfoString = `Customer: ${customerContacts.join(delimiter)}`;
    const returnPolicyString = `Return Policy: ${returnPolicy}`;  
    const addressString = `Delivery to: ${address}`;  

    const infoStrings = [
        merchantNameString,
        idString,
        dateString,
        contactInfoString,
        customerInfoString,
        addressString,
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
