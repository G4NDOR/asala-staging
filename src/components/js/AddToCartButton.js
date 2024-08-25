import React from 'react';
import '../css/AddToCartButton.css';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItemToCart, resetAnimation, triggerAnimation, triggerUnseenChanges } from "../../redux/ducks/orderManager";
import { triggerLoading } from '../../redux/ducks/appVars';
import { setProduct } from '../../redux/ducks/productPageManager';
import Paths from '../../constants/navigationPages';

const AddToCartButton = ({ product, weAreInOperatingTime }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartIsOpen = useSelector(state => state.orderManager.cartIsOpen);
    const cartIsClosed = !cartIsOpen;
    const operating = weAreInOperatingTime;

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

    const goToProductPage = () => {
        dispatch(triggerLoading());
        dispatch(setProduct(product));
        navigate(Paths.PRODUCT);
    }

    const handleClick = () => {
        if(operating) addItem();
        else goToProductPage(); // Add your logic to navigate to product page when the product is unavailable or out of stock.
    }

    return (
        <button className="product-button cart-button" onClick={handleClick} disabled={false}>
            {operating ? "Add to Cart" : "Unavailable"}
        </button>
    );
};

export default AddToCartButton;
