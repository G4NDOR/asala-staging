import React, { useState } from 'react';
import { useSelector, useDispatch } from'react-redux';
import { FaArrowDown, FaCircleNotch } from 'react-icons/fa';
import { addItems, resetLoadingMore, triggerLoadingMore } from '../../redux/ducks/homePageManager';
import '../css/LoadMoreBtn.css';
import { loadProducts } from '../../utils/firestoreUtils';

const LoadMoreBtn = ({ loadMoreItems, hasMoreItems }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.homePageManager.loadingMore);
  const lastDoc = useSelector(state => state.homePageManager.lastDoc);
  

  const handleClick = async () => {
    if (loading || !hasMoreItems) return;
    dispatch(triggerLoadingMore());
    const data = await loadProducts(lastDoc);
    const products = data.products;
    dispatch(addItems(products));
    dispatch(resetLoadingMore());
  };

  return (
    <div className={`load-more-btn ${hasMoreItems? '': 'no-more-items'}`} onClick={handleClick}>
      {loading ? (
        <FaCircleNotch className="loading-icon" />
      ) :  true? (//hasMoreItems
        <FaArrowDown className="arrow-icon" />
      ) : (
        <span className="no-more-items">No more items</span>
      )}
    </div>
  );
};

export default LoadMoreBtn;
