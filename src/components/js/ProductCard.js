import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import Paths from "../../constants/navigationPages";
import { addToWishList, setCurrentPage, triggerLoading } from "../../redux/ducks/appVars";
import { setProductSelectedId } from "../../redux/ducks/homePageManager";
import { addItemToCart, resetAnimation, triggerAnimation, triggerUnseenChanges } from "../../redux/ducks/orderManager";
import { setProduct } from "../../redux/ducks/productPageManager";
import { getOperatingTime, isOperatingTime } from "../../utils/appUtils";
import { wishItem } from "../../utils/firestoreUtils";
import "../css/ProductCard.css";
import AddToCartButton from "./AddToCartButton";
import Button from "./Button";
import ButtonsContainer from "./ButtonsContainer";
import BuyItemButton from "./BuyItemButton";
import ImageSlider from "./ImageSlider";
import WishButton from "./WishButton";

const ProductCard = ({product}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, name, price, description, status, wishes, available, producer } = product;
  const images = product['images-src'];
  const image = product['image-src'];
  const producerName = producer[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.NAME}`];
  const productIsRealeasedToPublic = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE}`];
  const wishListCount = wishes.length;
  const wishList = useSelector(state => state.appVars.wishList);
  const calculatedWishes = wishListCount + (wishList.includes(id)? 1 : 0);
  const cartIsOpen = useSelector(state => state.orderManager.cartIsOpen);
  const customerId = useSelector(state => state.appVars.customerId);
  const alreadyWished = wishes.includes(customerId);
  const alreadyWishedInLocal = alreadyWished? alreadyWished: wishList.includes(id);
  const notWished =!alreadyWishedInLocal;
  const productInStock = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.IN_STOCK}`];
  const productNotInStock = !productInStock;
  const productExists = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STATUS}`] == FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.present;
  const productDoesNotExistYet = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STATUS}`] == FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.future;


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
  const weAreNotInOperatingTime =!weAreInOperatingTime;

  //prepare time
  const prepTime = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES}`];
  const prepTimeInfoString = `${prepTime}${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREP_TIME_IN_MINUTES}`;
  const prepTimeInfo = preOrderSet?'':prepTimeInfoString;
  

  //navigate function to change pages
  const navigateToPage = (path) => {
    dispatch(setCurrentPage(path));
    navigate(path);
  }



  const deselect = () => {
    dispatch(setProductSelectedId(DEFAULT_VALUES.PRODUCT.id));
  }

    //util functions for button actions
    const goToProductPage = ({product}) => {
      dispatch(triggerLoading());
      dispatch(setProduct(product));
      navigateToPage(Paths.PRODUCT);   
    }

  // buttons needed for the product card
  const BuyItemButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "Buy Now",
    generalClassName: "home-page-product-card-buy-item-button",
    activeAction: goToProductPage,
    params:{
      product
    }
  }
  const AddToCartButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "Add to Cart",
    generalClassName: "home-page-product-card-add-to-cart-button",
    activeAction: ({product}) => {
      const cartIsClosed = !cartIsOpen;
      dispatch(addItemToCart(product));
      dispatch(triggerAnimation());
      if(cartIsClosed){
          dispatch(triggerUnseenChanges());
      }
      setTimeout(() => {
          dispatch(resetAnimation());
        }, 300); // Match this duration to your CSS animation duration
    },
    params:{
      product
    }
  }
  const notInStockButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productNotInStock,
    generalContent: "Sold out",
    generalClassName: "home-page-product-card-not-in-stock-button",
    activeAction: goToProductPage,
    params:{
      product
    }
  }
  const ItemUnavailableButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreNotInOperatingTime,
    activeContent: "Unavailable",
    generalClassName: "home-page-product-card-item-unavailable-button",
    activeAction: goToProductPage,
    params:{
      product
    }
  }
  const WishButtonDetails = {
    active: notWished,
    visible: productIsRealeasedToPublic && productDoesNotExistYet,
    generalContent: `Wish (${calculatedWishes})`,
    generalClassName: "home-page-product-card-wish-button",
    activeClassName: "home-page-product-card-wish-button-active",
    notActiveClassName: "home-page-product-card-wish-button-not-active",
    activeAction: ({customerId, id}) => {
      wishItem(customerId, id);
      //console.log("wish item");
      dispatch(addToWishList(id));
    },
    params:{
      customerId: customerId,
      id: id,
    }
  }


  

  const buttonsDetails = [
    BuyItemButtonDetails,
    AddToCartButtonDetails,
    notInStockButtonDetails,
    ItemUnavailableButtonDetails,
    WishButtonDetails 
  ]

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
        <ButtonsContainer buttonsDetails={buttonsDetails}/>
      </div>
    </div>
  );
};

export default ProductCard;
