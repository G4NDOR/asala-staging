import DEFAULT_VALUES from "../constants/defaultValues";
import { v4 as uuidv4 } from 'uuid';
import { DAYS, FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../constants/firebase";
import CONSTANTS from "../constants/appConstants";

/**
 * Generates all possible substrings of a given string.
 * @param {string} str - The input string.
 * @returns {string[]} - An array of all possible substrings.
 * @example
 * // Sample Input:
 * const substrings = getAllSubstrings('abc');
 * console.log(substrings);
 * // Sample Output:
 * // ['a', 'ab', 'abc', 'b', 'bc', 'c']
 */
 export const getAllSubstrings = (str) => {
    const substrings = [];
    
    // Iterate over each starting position
    for (let start = 0; start < str.length; start++) {
      // Iterate over each ending position
      for (let end = start + 1; end <= str.length; end++) {
        substrings.push(str.substring(start, end));
      }
    }
    
    return substrings;
  };
  
  // Example Usage:
  //const substrings = getAllSubstrings('abc');
  //console.log(substrings); // Output: ['a', 'ab', 'abc', 'b', 'bc', 'c']


  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  


  /**
 * Checks if the current time falls within the operating hours for the given days.
 * @param {string[]} days - Array of days of the week.
 * @param {Object[]} hours - Array of objects representing operating hours.
 * @returns {boolean} - True if current time is within operating hours, false otherwise.
 */
export const isOperatingTime = (schedule) => {
  // Get the current date and time
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // E.g., 'monday'
  const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // E.g., '08:00 AM'
  /* sample schedule format:
  schedule = {
    monday: "08:00 AM - 12:00 PM",
    tuesday: "12:00 PM - 04:00 PM",
    wednesday: "04:00 PM - 08:00 PM",
    thursday: "08:00 AM - 12:00 PM",
    friday: "12:00 PM - 04:00 PM",
    saturday: null,
    sunday: null
  }
  */


  //get the corresponding operating hours for the current day
  const operatingHours = schedule[currentDay];

  //if the corresponding operating hours are null => current day is not a day of operation => return false
  if(!operatingHours) return false;
  // if the current day is a day of operation => check if the current time is within the operating hours
  const delimiter = ' - ';
  const [start, end] = operatingHours.split(delimiter);

  // Convert time strings to Date objects
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
    return new Date(`1970-01-01T${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`);
  };      
  
  // Convert start and end times to date objects for comparison
  const startTime = parseTime(start);
  const endTime = parseTime(end);
  const currentTimeObj = parseTime(currentTime);
  
  // Check if current time is within the start and end times
  return currentTimeObj >= startTime && currentTimeObj <= endTime;
  };
  
  // Example usage:
  //const days = ["Mo", "Tu", "We"];
  //const hours = [
  //  { start: "08:00 AM", end: "12:00 PM" },
  //  { start: "12:00 PM", end: "04:00 PM" },
  //  { start: "04:00 PM", end: "08:00 PM" }
  //];
  //
  //console.log(isOperatingTime(days, hours)); // Output depends on current time and day


  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  





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

  const getHours = (operatingHours) => {
    //operatingHours is a string like '08:00 AM - 12:00 PM',
    const delimiter = ' - ';
    const hours = operatingHours.split(delimiter);//08:00 AM - 12:00 PM => ['08:00 AM', '12:00 PM']
    const startTimeArray = hours[0].split(' ');//08:00 AM to ['08;00', 'AM']
    const endTimeArray = hours[1].split(' ');//12:00 PM to ['12;00', 'PM']
    const startTime = startTimeArray[0];//08:00 AM to 08:00
    const endTime = endTimeArray[0];//12:00 PM to 12:00
    const startTimeFormatted = `${formatTime(startTime)} ${startTimeArray[1]}`;//'08:00' and 'AM' to '8 AM
    const endTimeFormatted = `${formatTime(endTime)} ${endTimeArray[1]}`;//'12:00' and 'PM' to '12 PM'
    const hoursString = [startTimeFormatted, endTimeFormatted].join('-');//['8', '12' ] => '8-12'
    return hoursString;
  }


  export const getOperatingTime = (schedule, daysSpecificHoursSet) => {
    let generalHours = '';
    const daysWithHours = DAYS.map(day => {
      const operatingHours = schedule[day.toLowerCase()];
      if (operatingHours!== null) {
        const hoursString = getHours(operatingHours);
        generalHours = hoursString;
        return (`${day} ${hoursString}\n`)
      }
      
    })
    if (daysSpecificHoursSet) return daysWithHours;
    return [`${DAYS.join(', ')} ${generalHours}`];
  }    



  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  



export const generateButtonDetails = ({
  active = null,
  visible = null,
  //content
  generalContent,
  activeContent,
  notActiveContent,
  //className
  generalClassName,
  activeClassName,
  notActiveClassName,
  //actions
  activeAction,
  notActiveAction,
  params
}) => {

  const _active = (active == null)? DEFAULT_VALUES.BUTTON_DETAILS.active: active;
  const _visible = (visible == null)? DEFAULT_VALUES.BUTTON_DETAILS.visible: visible;
  //content
  const _generalContent = !generalContent? DEFAULT_VALUES.BUTTON_DETAILS.generalContent: generalContent;
  const _activeContent = !activeContent? DEFAULT_VALUES.BUTTON_DETAILS.activeContent: activeContent;
  const _notActiveCotent = !notActiveContent? DEFAULT_VALUES.BUTTON_DETAILS.notActiveContent: notActiveContent;
  //className
  const _generalClassName = !generalClassName? DEFAULT_VALUES.BUTTON_DETAILS.generalClassName: generalClassName;
  const _activeClassName = !activeClassName? DEFAULT_VALUES.BUTTON_DETAILS.activeClassName: activeClassName;
  const _notActiveClassName = !notActiveClassName? DEFAULT_VALUES.BUTTON_DETAILS.notActiveClassName: notActiveClassName;
  //actions
  const _activeAction = !activeAction? DEFAULT_VALUES.BUTTON_DETAILS.activeAction: activeAction;
  const _notActiveAction = !notActiveAction? DEFAULT_VALUES.BUTTON_DETAILS.notActiveAction: notActiveAction;
  const _params = !params? DEFAULT_VALUES.BUTTON_DETAILS.params: params;
  

  const buttonDetails = {
    active: _active,
    visible: _visible,
    generalContent: _generalContent,
    activeContent: _activeContent,
    notActiveContent: _notActiveCotent,
    generalClassName: _generalClassName,
    activeClassName: _activeClassName,
    notActiveClasName: _notActiveClassName,
    activeAction: _activeAction,
    notActiveAction: _notActiveAction,
    params: _params
  };
  return buttonDetails;
};



  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  


  //finds the discounts that apply to the specified product
  export const findDiscountsForProduct = (discounts, productId) => {
    const cleanedProductId = getCleanedProductId(productId);
    const discountsThatBelongToThisProduct = discounts.filter(discount => {
      const discountBelongsToThisProduct = discount.product === cleanedProductId;
      return discountBelongsToThisProduct;
    });
    return discountsThatBelongToThisProduct;
  }

  //checks if the discount should be applied based on the quantity of the item purchased.
  export const findAppliedDiscount = (discounts, quantity) => {
    let appliedDiscount = null;
    const appliedDiscountBasedOnQuantity = discounts.filter(discount => {
      const quantityOnwhichDiscountApplies = discount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.QUANTITY}`];
      const discountShouldApply = quantity >= quantityOnwhichDiscountApplies;
      return discountShouldApply;
    });    
    if (appliedDiscountBasedOnQuantity.length > 0) 
      appliedDiscount = appliedDiscountBasedOnQuantity[0];
    return appliedDiscount;
  }

  //returns the new price based on the old price and the discount amount and its type.
  export const getPriceWithDiscountApplied = (discount, price) => {
    let amountTobeSubtracted = 0;
    const discountType = discount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.TYPE}`];
    const discountValue = discount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.VALUE}`];
    const DISCOUNT_TYPE_PERCENTAGE = FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.TYPE.PERCENTAGE;
    const DISCOUNT_TYPE_FIXED = FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.TYPE.FIXED;
    switch (discountType) {
      case DISCOUNT_TYPE_PERCENTAGE:
        
        amountTobeSubtracted = (discountValue * price) / 100;   
             
        break;
  
      case DISCOUNT_TYPE_FIXED:
        amountTobeSubtracted = discountValue;          
        break;
      default:
        break;
    }

    const priceWithDiscountApplied = price - amountTobeSubtracted; 
    if (priceWithDiscountApplied < 0) return 0;  // In case the discounted price becomes negative, return 0 instead.
    return priceWithDiscountApplied;
  }


  //returns the total price for the given item after applying the discount.
  export const calculatePriceForItem = (appliedDiscount, price, quantity) => {   
    //const appliedDiscount = findAppliedDiscount(discounts, quantity);
    let total = price * quantity;
    if (!appliedDiscount) return total;
    const applyOnSingleItem = appliedDiscount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.APPLY_ON_SINGLE_ITEM}`];
    if (applyOnSingleItem) {
      const singleItemPriceWithDiscountApplied = getPriceWithDiscountApplied(appliedDiscount, price);
      total = singleItemPriceWithDiscountApplied * quantity;
    } else{
      const priceBasedOnQuantity = price * quantity;
      total = getPriceWithDiscountApplied(appliedDiscount, priceBasedOnQuantity);
    }
    
    return total;
  }




  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  

// takes the products list, discounts list and used credit
//  RETURNS Calculated final total price that the customer will pay
export const calculateTotalListPriceWithAppliedDiscountsAndUsedCredit = (products, selectedDiscounts, usedCredit) => {
  const totalBeforecredit = calculateTotalListPriceWithAppliedDiscounts(products, selectedDiscounts);
  const finalTotal = totalBeforecredit - usedCredit;
  if (finalTotal < 0) return 0;  //if used credit is more than total
  return finalTotal;
}; 

//takes the products list, discounts list
// RETURNS total price with applied discounts (non quantity discounts, and quantity discounts)
export const calculateTotalListPriceWithAppliedDiscounts = (products, selectedDiscounts) => {
  const totalOfAllItemsWithAppliedQuantityDiscounts = calculateTotalListPriceWithAppliedQuantityDiscounts(products, selectedDiscounts)
  
  //discounts that apply to final price not affected by specific items quantities
  const nonQuantityDiscounts = selectedDiscounts.filter(discount => discount.quantity === 0);
  const totalBeforecredit = totalWithAppliedNonQuantityDiscounts(nonQuantityDiscounts, totalOfAllItemsWithAppliedQuantityDiscounts);
  //console.log('totalBeforecredit', totalBeforecredit)
  return totalBeforecredit;
}

// takes total price after applying quantity discounts (discounts that apply on a specific item)
// RETURNS total price with applied non quantity discounts (discounts that apply on the whole order, not on specific items)
const totalWithAppliedNonQuantityDiscounts = (discounts, total) => {
  if(discounts.length === 0) return total;
  const discount = discounts[0];
  const leftDiscounts = discounts.slice(1);
  const totalAfterNonQuantityDiscount = getPriceWithDiscountApplied(discount, total);
  return totalWithAppliedNonQuantityDiscounts(leftDiscounts, totalAfterNonQuantityDiscount);
}


// takes products list, discounts list
// RETURNS total price with applied quantity discounts (discounts that apply on a specific item)
export const calculateTotalListPriceWithAppliedQuantityDiscounts = (products, selectedDiscounts) => {
  const totalOfAllItemsWithAppliedQuantityDiscounts = products.reduce((total, item) => {
    const { id, quantity, price } = item;
    const discountsForThisProduct = findDiscountsForProduct(selectedDiscounts, id);      
    const appliedDiscount = findAppliedDiscount(discountsForThisProduct, quantity);
    const totalOfThisItem = calculatePriceForItem(appliedDiscount, price, quantity);    
    return total + totalOfThisItem;
  }, 0);
  return totalOfAllItemsWithAppliedQuantityDiscounts;
}

//takes products list
// RETURNS total price based on itemss prices and quantities, without discounts (discounts are not applied)
export const calculateTotalListPriceWithoutDiscounts = (products) => {
  const totalOfAllItems = products.reduce((total, item) => {
    const { quantity, price } = item;
    const totalOfThisItem = price * quantity;        
    return total + totalOfThisItem;
  }, 0);
  return totalOfAllItems;
}

  
  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  



export const formatPhoneNumberStyle1 = (number) => {
  const cleaned = ('' + number).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    const formattedNumber = !match[2]
      ? `(${match[1]}`
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    return formattedNumber;
  }
  return number;
};  

export const formatPhoneNumberStyle2 = (number) => {
  const str = number.toString();
  return `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6)}`;
};




  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  

//gets an array of productIds that might have variants or add-ons [product1Id_variant1Id_variant2Id..., product2Id_variant2Id_addOnId...]
//returns an array of productIds without variants or add-ons [product1Id, product2Id,...]
export const getCleanedProductsIds = (products) => {
  const cleanedProductsIds = products.map(product => {
    const cleanedProductId = getCleanedProductId(product.id);
    return cleanedProductId;
  });
  return cleanedProductsIds;
}

//gets a productId that might have variants or add-ons (product1Id_variant1Id_variant2Id...)
//returns the productId without variants or add-ons (product1Id)
export const getCleanedProductId = (productId) => {
  //if the product is a variant it will have an id with the format: productId_variant1Id_variant2Id...
  const delimiter  = '_';
  //gets the id, either as productId or productId_variant1Id_variant2Id...
  //split it into either [productId] or [productId, variant1Id, variant2Id,...]
  //get the first element, either productId
  const cleanedProductId = productId.split(delimiter )[0];
  return cleanedProductId;  
}




  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  



  export const getVariantsIdsAndOptionalAdditionsIdsFromProductId = (productId) => {
    const combinedIds = {
      [CONSTANTS.UNIQUE_IDS.VARIANT.type]: [],
      [CONSTANTS.UNIQUE_IDS.OPTIONAL_ADDITION.type]: [],
    };
    const delimiter  = '_';
    productId.split(delimiter).forEach((id, index) => {
      console.log('id', id)
      const type = getTypeFromId(id);
      console.log('type', type)
      if (type !== null) combinedIds[type].push(id);
    })
    return combinedIds;
  }



  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  





/**
 * Generates a unique ID for either a variant or an optional addition.
 * The ID will have a prefix to distinguish between the two types.
 *
 * @param {string} type - The type of ID to generate ('variant' or 'optionalAddition').
 * @returns {string} - A unique ID with a prefix indicating the type.
 */
export const generateUniqueId = (type) => {
  // Generate a UUID
  const uniquePart = uuidv4();
  const variant = CONSTANTS.UNIQUE_IDS.VARIANT;
  const optionalAddition = CONSTANTS.UNIQUE_IDS.OPTIONAL_ADDITION;

  // Add a prefix based on the type
  if (type === variant.type) {
    return `${variant.prefix}_${uniquePart}`;
  } else if (type === optionalAddition.type) {
    return `${optionalAddition.prefix}_${uniquePart}`;
  } else {
    throw new Error('Invalid type specified. Use "variant" or "optionalAddition".');
  }
};
/*
// Example usage:
const variantId = generateUniqueId('variant');
const optionalAdditionId = generateUniqueId('optionalAddition');

console.log(variantId); // e.g., 'var_123e4567-e89b-12d3-a456-426614174000'
console.log(optionalAdditionId); // e.g., 'opt_123e4567-e89b-12d3-a456-426614174000'
*/


  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  



  /**
 * Determines whether the given ID belongs to a variant or an optional addition.
 *
 * @param {string} id - The unique ID to check.
 * @returns {string} - Returns 'variants' if the ID is for a variant, 'optional-additions' if the ID is for an optional addition.
 * @returns {null} - Returns null if the ID does not match either type.
 */
export const getTypeFromId = (id) => {
  const variant = CONSTANTS.UNIQUE_IDS.VARIANT;
  const optionalAddition = CONSTANTS.UNIQUE_IDS.OPTIONAL_ADDITION;
  if (id.startsWith(variant.prefix)) {
    return variant.type;
  } else if (id.startsWith(optionalAddition.prefix)) {
    return optionalAddition.type;
  } else {
    return null; // ID does not match either type, so return null 
  }
};
/*
// Example usage:
const id1 = 'var_123e4567-e89b-12d3-a456-426614174000';
const id2 = 'opt_123e4567-e89b-12d3-a456-426614174000';

console.log(getTypeFromId(id1)); // Output: 'variants'
console.log(getTypeFromId(id2)); // Output: 'optional-additions'
*/
  
  