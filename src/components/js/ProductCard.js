import React from "react";
import "../css/ProductCard.css";
import AddToCartButton from "./AddToCartButton";
import BuyItemButton from "./BuyItemButton";
import ImageSlider from "./ImageSlider";
import WishButton from "./WishButton";

const ProductCard = ({product}) => {
  const { image, images, name, price, description, status, wishes, available, producer, availableTime } = product;

  return (
    <div className="product-card-1">
      <div className="product-image">
        <ImageSlider images={images} />
      </div>
      <div className="product-info">
        <h2 className="product-name">{name}</h2>
        <p className="product-price">${price.toFixed(2)}</p>
        <p className="product-description">{description}</p>
        <p className="product-availablity">{availableTime}</p>
        <p className="product-producer">by {producer}</p>
        {status === "present" ? (
          <div className="product-buttons">
            <BuyItemButton product={product} />
            <AddToCartButton product={product} />
          </div>
        ) : (
          <WishButton wishes={wishes} />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
