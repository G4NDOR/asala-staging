import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import { setProductSelectedId } from "../../redux/ducks/homePageManager";
import { getOperatingTime, isOperatingTime } from "../../utils/appUtils";
import "../css/ProductCard.css";
import AddToCartButton from "./AddToCartButton";
import BuyItemButton from "./BuyItemButton";
import ImageSlider from "./ImageSlider";
import WishButton from "./WishButton";

const ProductCard = ({product}) => {
  const dispatch = useDispatch();
  const { id, name, price, description, status, wishes, available, producer } = product;
  const images = product['images-src'];
  const image = product['image-src'];
  const producerName = producer['name'];
  const wishListCount = wishes.length;
  const customerId = useSelector(state => state.appVars.customerId);
  const alreadyWished = wishes.includes(customerId);


  // Get available time for the product
  const days = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS}`];
  const hours = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.HOURS}`];
  const operatingTime = getOperatingTime(days, hours);//['Mo,Tu,We', '8-12'] => 'Mo,Tu,We 8-12'
  
  // check if preorder is set
  const preOrderSet = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREORDER_SET}`];
  const preOderPeriod = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREORDER_PERIOD_IN_HOURS}`];
  const preOrderInfoString = `pre Order (${preOderPeriod}${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREORDER_PERIOD_IN_HOURS})`;
  const availabilityInfoString = preOrderSet? preOrderInfoString : operatingTime;

  // are we in operating time for this product
  const daysSpecificHoursNotSet = !product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS_SPECIFIC_HOURS_SET}`];
  const weAreInOperatingTime = isOperatingTime(days, hours, daysSpecificHoursNotSet);

  //prepare time
  const prepTime = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES}`];
  const prepTimeInfoString = `${prepTime}${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREP_TIME_IN_MINUTES}`;
  const prepTimeInfo = preOrderSet?'':prepTimeInfoString;
  



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
        <p className="product-price">
          ${price.toFixed(2)} 
          <span className="product-card-prep-time">
          {`  ${prepTimeInfo}`}
          </span>
        </p>
        <p className="product-description">{description}</p>
        <p className="product-availablity">{availabilityInfoString}</p>
        <p className="product-producer">by {producerName}</p>
        {status === "present" ? (
          <div className="product-buttons">
            {
              weAreInOperatingTime?
              <BuyItemButton product={product} />:
              null
            }
            <AddToCartButton weAreInOperatingTime={weAreInOperatingTime} product={product} />
          </div>
        ) : (
          <WishButton wishes={wishListCount} isAlreadyWished={alreadyWished} productId={id} />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
