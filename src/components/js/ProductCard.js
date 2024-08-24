import React from "react";
import { useDispatch } from "react-redux";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { setProductSelectedId } from "../../redux/ducks/homePageManager";
import "../css/ProductCard.css";
import AddToCartButton from "./AddToCartButton";
import BuyItemButton from "./BuyItemButton";
import ImageSlider from "./ImageSlider";
import WishButton from "./WishButton";

const ProductCard = ({product}) => {
  const dispatch = useDispatch();
  const { name, price, description, status, wishes, available, producer } = product;
  const images = product['images-src'];
  const image = product['image-src'];
  const producerName = producer['name'];

  const days = product['days'].join(',');// ['Mo','Tu','We']=> 'Mo,Tu,We'
  const startTime = product['hours'][0]['start'].split(' ')[0];//08:00 AM to 08:00
  const endTime = product['hours'][0]['end'].split(' ')[0];//12:00 PM to 12:00
  const startTimeFormatted = formatTime(startTime);//08:00 AM to 8
  const endTimeFormatted = formatTime(endTime);//12:00 PM to 12
  const hours = [startTimeFormatted, endTimeFormatted].join('-');//['8', '12' ] => '8-12'
  const availableTime = [days,hours].join(' ');//['Mo,Tu,We', '8-12'] => 'Mo,Tu,We 8-12'

  function formatTime(time) {
    // Split the time into hours and minutes
    const [hours, minutes] = time.split(':');
    
    // Convert hours to a number to remove leading zero
    const formattedHours = parseInt(hours, 10); // Removes leading zero from hours
    
    // If minutes are "00", return only the hours
    if (minutes === '00') {
        return `${formattedHours}`;
    }
    
    // Otherwise, return the full time with hours and minutes
    return `${formattedHours}:${minutes}`;
  }

  const deselect = () => {
    dispatch(setProductSelectedId(DEFAULT_VALUES.PRODUCT.id));
  }

  return (
    <div onClick={deselect} className="product-card-1">
      <div className="product-image">
        <ImageSlider images={images} />
      </div>
      <div className="product-info">
        <h2 className="product-name">{name}</h2>
        <p className="product-price">${price.toFixed(2)}</p>
        <p className="product-description">{description}</p>
        <p className="product-availablity">{availableTime}</p>
        <p className="product-producer">by {producerName}</p>
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
