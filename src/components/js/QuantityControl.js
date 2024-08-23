// Start QuantityControl.js
import React, { useState } from 'react';
import '../css/QuantityControl.css';
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import {useSelector, useDispatch} from 'react-redux';
import { decreaseOneItemQuantity, decreaseQuantity, increaseOneItemQuantity, increaseQuantity } from '../../redux/ducks/orderManager';
import { CART, ONE_ITEM_CHECKOUT } from '../../constants/stateKeys';

const QuantityControl = ({ id, quantity, listIdentifier }) => {
  const dispatch = useDispatch();

  const onDecrease = () => {
    if (listIdentifier == CART)
      dispatch(decreaseQuantity(id));
    if (listIdentifier == ONE_ITEM_CHECKOUT)
      dispatch(decreaseOneItemQuantity(id));
  }
  const onIncrease = () => {
    if (listIdentifier == CART)
      dispatch(increaseQuantity(id));
    if (listIdentifier == ONE_ITEM_CHECKOUT)
      dispatch(increaseOneItemQuantity(id));
  }
  return (
    <div className="quantity-control">
      <AiOutlineMinus className='quantity-button'  onClick={onDecrease}/>
      <span className="quantity-display">{quantity}</span>
      <AiOutlinePlus className='quantity-button' onClick={onIncrease}/>
    </div>
  );
};

export default QuantityControl;
// End QuantityControl.js
