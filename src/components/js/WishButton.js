import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList } from '../../redux/ducks/appVars';
import { wishItem } from '../../utils/firestoreUtils';
import '../css/WishButton.css';

const WishButton = ({ wishes, isAlreadyWished, productId }) => {
    const dispatch = useDispatch();
    const wishList = useSelector(state => state.appVars.wishList);
    const alreadyWished = isAlreadyWished ? isAlreadyWished : wishList.includes(productId);
    const customerId = useSelector(state => state.appVars.customerId);
    const calculatedWishes = wishes + (wishList.includes(productId)? 1 : 0);

    const handleClick = () => {
        wishItem(customerId, productId);
        console.log("wish item");
        dispatch(addToWishList(productId));
    }

    useEffect(() => {
      console.log('alreadyWished', alreadyWished)
    }, [alreadyWished, productId])
    


    return (
        <button onClick={handleClick} className={`product-button wish-button ${alreadyWished? 'already-wished':''}`} disabled={alreadyWished}>
            Wish ({calculatedWishes})
        </button>
    );
};

export default WishButton;
