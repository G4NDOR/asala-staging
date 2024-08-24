import React from 'react';
import '../css/BuyButton.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import { setProduct } from '../../redux/ducks/productPageManager';
import { triggerLoading } from '../../redux/ducks/appVars';

const BuyItemButton = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const available = product.available;

    const handleBuyBtnClick = ()=>{
        dispatch(triggerLoading());
        dispatch(setProduct(product));
        navigate(Paths.PRODUCT);
    }

    return (
        <button className="product-button buy-button" onClick={handleBuyBtnClick} disabled={!available}>
            {available ? "Buy Now" : "Unavailable"}
        </button>
    );
};

export default BuyItemButton;
