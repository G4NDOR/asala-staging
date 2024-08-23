import React from 'react';
import '../css/AddToCartButton.css';

import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, resetAnimation, triggerAnimation, triggerUnseenChanges } from "../../redux/ducks/orderManager";

const AddToCartButton = ({ product }) => {
    const dispatch = useDispatch();
    const cartIsOpen = useSelector(state => state.orderManager.cartIsOpen);
    const cartIsClosed = !cartIsOpen;
    const available = product.available;

    const addItem = ()=>{
        dispatch(addItemToCart(product));
        dispatch(triggerAnimation());
        if(cartIsClosed){
            dispatch(triggerUnseenChanges());
        }
        setTimeout(() => {
            dispatch(resetAnimation());
          }, 300); // Match this duration to your CSS animation duration
    }

    return (
        <button className="product-button cart-button" onClick={addItem} disabled={!available}>
            {available ? "Add to Cart" : "Unavailable"}
        </button>
    );
};

export default AddToCartButton;
