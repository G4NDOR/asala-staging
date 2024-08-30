import React from 'react'
import '../css/CheckoutTotalSection.css'
import ChargeInfo from './ChargeInfo';

export default function CheckoutTotalSection({charges}) {
  const _charges = charges? charges : [];

  return (
    <div className='checkout-total-section' >
      {
        _charges.map((charge, index) => <ChargeInfo key={index} charge={charge}/>)
      }      
    </div>
  )
}
