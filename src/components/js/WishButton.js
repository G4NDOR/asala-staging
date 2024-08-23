import React from 'react';
import '../css/WishButton.css';

const WishButton = ({ wishes }) => {
    const alredyWished = true;
    const wishItem = () => {
        console.log("wish item");
    }
    return (
        <button onClick={wishItem} className={`product-button wish-button ${alredyWished? 'already-wished':''}`} disabled={alredyWished}>
            Wish List ({wishes} Wishes)
        </button>
    );
};

export default WishButton;
