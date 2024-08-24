import React from 'react';
import '../css/ProductMiniCard.css';
import ImageSlider from './ImageSlider';
import { useDispatch } from'react-redux'; // Assuming you have a Redux store
import { setProductSelectedId } from '../../redux/ducks/homePageManager';

const ProductMiniCard = ({ images, name, id }) => {
    const dispatch = useDispatch(); // Assuming you have a dispatch function in your component

    const selectProduct = () => {
        dispatch(setProductSelectedId(id))
    };

  return (
    <div onClick={selectProduct} className="product-mini-card">
        <div className="product-image-mini-card">
            <ImageSlider images={images} />
        </div>
      <p className="product-name-mini-card">{name}</p>
    </div>
  );
};

export default ProductMiniCard;
