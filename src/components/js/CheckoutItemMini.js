import React from 'react'
import '../css/CheckoutItemMini.css'

export default function CheckoutItemMini({item}) {
    const nameString = `${item.name} (x${item.quantity})`;
    const crossedPriceString = `$${(item.price + item.discount).toFixed(2)}`;
    const priceString = `$${item.price.toFixed(2)}`;
    return (
        <li className="checkout-item-mini">
          <span className="checkout-item-mini-name">{nameString}</span>
          <span className="checkout-item-mini-price">
            <span className="checkout-item-mini-crossed-price">{crossedPriceString}</span> 
            {priceString}
          </span>
        </li>
      );
}
