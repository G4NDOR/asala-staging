import React, { useEffect, useState } from 'react';
import '../css/ProductMiniCard.css';
import ImageSlider from './ImageSlider';
import { useDispatch } from'react-redux'; // Assuming you have a Redux store
import { setProductSelectedId } from '../../redux/ducks/homePageManager';
import DEFAULT_VALUES from '../../constants/defaultValues';
import { getImages } from '../../utils/firestoreUtils';

const ProductMiniCard = ({ imagesPaths, name, id }) => {
  const dispatch = useDispatch(); // Assuming you have a dispatch function in your component
  const [images, setImages] = useState(DEFAULT_VALUES.IMAGES['few-images']);
  const [initialized, setInitialized] = useState(false);
  
  const initialize = async () => {
    const images = await getImages(imagesPaths);
    if(images) setImages(images);
    setInitialized(true);
  }

  useEffect(() => {
    if (!initialized) initialize();
  
    return () => {
      
    }
  }, [])
  

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
