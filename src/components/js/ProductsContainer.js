// src/components/ProductsContainer.js

import React from 'react';
import ProductCard from './ProductCard'; // Assuming you have the ProductCard component
import '../css/ProductsContainer.css';
import { useDispatch, useSelector } from 'react-redux';

const ProductsContainer = ({}) => {
  const items = useSelector(state => state.homePageManager.items);

  return (
    <div className="products-container">
      {items.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductsContainer;
