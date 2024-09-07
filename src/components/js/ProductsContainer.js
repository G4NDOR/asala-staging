// src/components/ProductsContainer.js

import React, { useEffect } from 'react';
import ProductCard from './ProductCard'; // Assuming you have the ProductCard component
import '../css/ProductsContainer.css';
import { useDispatch, useSelector } from 'react-redux';
import ProductMiniCard from './ProductMiniCard';
import { setScreenWidthIsLessThan800 } from '../../redux/ducks/appVars';
import DEFAULT_VALUES from '../../constants/defaultValues';

const ProductsContainer = ({}) => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.homePageManager.items);
  const searchItems = useSelector(state => state.homePageManager.searchItems);
  const searching = useSelector(state => state.homePageManager.searching);
  const screenWidthIsLessThan800 = useSelector(state => state.appVars.screenWidthIsLessThan800);
  const selectedPeoductId = useSelector(state => state.homePageManager.productSelectedId);
  const isProductSelected = selectedPeoductId !== DEFAULT_VALUES.PRODUCT.id;
  const itemsList = searching? searchItems : items;

  const handleResize = () => {
    if (window.innerWidth <= 800) {
      dispatch(setScreenWidthIsLessThan800(true));
    } else {
      dispatch(setScreenWidthIsLessThan800(false));
    }    
  }

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })

  useEffect(() => {
    handleResize();
  }, [])
  

  return (
    <div className={`products-container ${screenWidthIsLessThan800?'products-container-mini-card':''}`}>
      {itemsList.map((product, index) => (
        screenWidthIsLessThan800?
        <>
        {
          isProductSelected && selectedPeoductId==product.id?
          <ProductCard
          key={index}
          product={product}
          />          
          :
          <ProductMiniCard key={index} id={product.id} imagesPaths={(product['images'] || DEFAULT_VALUES.IMAGES)['few-images']} name={product.name}/>          
        }    
           
        </>
        
        :
        <ProductCard
        key={index}
        product={product}
        />
      ))}
    </div>
  );
};

export default ProductsContainer;
