import React, { useState } from 'react';
import { FaArrowDown, FaCircleNotch } from 'react-icons/fa';
import '../css/LoadMoreBtn.css';

const LoadMoreBtn = ({ loadMoreItems, hasMoreItems }) => {
  const [loading, setLoading] = useState(false);
  

  const handleClick = async () => {
    if (loading || !hasMoreItems) return;
    setLoading(true);
    await loadMoreItems();
    setTimeout(() => {
        setLoading(false);
        
    }, 3000);
  };

  return (
    <div className={`load-more-btn ${hasMoreItems? '': 'no-more-items'}`} onClick={handleClick}>
      {loading ? (
        <FaCircleNotch className="loading-icon" />
      ) : hasMoreItems ? (
        <FaArrowDown className="arrow-icon" />
      ) : (
        <span className="no-more-items">No more items</span>
      )}
    </div>
  );
};

export default LoadMoreBtn;
