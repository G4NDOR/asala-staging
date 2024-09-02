// Start QuantityControl.js
import React, { useState } from 'react';
import '../css/QuantityControl.css';
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import {useSelector, useDispatch} from 'react-redux';
import { decreaseOneItemQuantity, decreaseQuantity, increaseOneItemQuantity, increaseQuantity } from '../../redux/ducks/orderManager';
import { CART, ONE_ITEM_CHECKOUT } from '../../constants/stateKeys';
import Paths from '../../constants/navigationPages';

const QuantityControl = ({ id, quantity, parent }) => {
  const dispatch = useDispatch();
  const isProductPage = parent === Paths.PRODUCT;
  const isCart = parent == Paths.CART;

  const onDecrease = () => {
    if (isCart)
      dispatch(decreaseQuantity(id));
    if (isProductPage)
      dispatch(decreaseOneItemQuantity(id));
  }
  const onIncrease = () => {
    if (isCart)
      dispatch(increaseQuantity(id));
    if (isProductPage)
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
