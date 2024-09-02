import React from 'react'
import { useSelector } from 'react-redux';
import { calculatePriceForItem, findAppliedDiscount } from '../../utils/appUtils';
import '../css/CheckoutItemMini.css'

export default function CheckoutItemMini({item, parent}) {
  const { id, quantity, name, price } = item;
  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts[parent]);
  
  const thisProductSelectedDiscounts = selectedDiscounts.filter(discount => {
    const delimiter = '_';
    const noVariantProductId = id.split(delimiter)[0];
    const discountBelongsToThisProduct = discount.product === noVariantProductId;
    return discountBelongsToThisProduct;
  });  
  const discounts = thisProductSelectedDiscounts;
  const appliedDiscount = findAppliedDiscount(discounts, quantity);
  const totalBeforeDiscounts = price * quantity;
  const FinalTotal = calculatePriceForItem(appliedDiscount, price, quantity);
  const optionalAdditions = item['optional-additions'] || [];
  const itemHasOptionalAdditions = optionalAdditions.length > 0;
  const nameString = `${name} $${price.toFixed(2)} (x${quantity})${itemHasOptionalAdditions? ' +': ''}`;
  const crossedPriceString = `${appliedDiscount? `$${totalBeforeDiscounts.toFixed(2)}`: ''}`;
  const priceString = `$${FinalTotal.toFixed(2)}`;
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
