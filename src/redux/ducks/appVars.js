// redux/ducks/appVars.js

import DEFAULT_VALUES from "../../constants/defaultValues";
import Paths from "../../constants/navigationPages";

const TRIGGER_LOADING = 'appVars/triggerLoading';
const RESET_LOADING = 'appVars/resetLoading';
const SET_SCREEN_WIDTH_IS_LESS_THAN_480 = 'appVars/setScreenWidthIsLessThan480';
const SET_CUSTOMER_ID = 'appVars/setCustomerId';
const SET_CUSTOMER_DETAILS = 'appVars/setCustomerDetails';
const SET_SCREEN_WIDTH_IS_LESS_THAN_800 = 'appVars/setScreenWidthIsLessThan800';
const SET_WISH_LIST = 'appVars/setWishList';
const ADD_TO_WISH_LIST = 'appVars/addToWishList';
const SET_HOME_PAGE_VISITED = 'appVars/setHomePageVisited';
const SET_CURRENT_PAGE = 'appVars/setCurrentPage';
const ADD_MESSAGE = 'appVars/addMessage';
const REMOVE_MESSAGE = 'appVars/removeMessage';
const SET_MESSAGE = 'appVars/setMessage';
const SET_DELIVERY_RANGE = 'appVars/setDeliveryRange';
const SET_BASE_DELIVERY_FEE = 'appVars/setBaseDeliveryFee';
const SET_BASE_DELIVERY_DISTANCE = 'appVars/setBaseDeliveryDistance';
const SET_DELIVERY_PRICE_PER_MILE = 'appVars/setDeliveryPricePerMile';
const SET_TAX_FEE = 'appVars/setTaxFee';
const SET_PHONE_NUMBER = 'appVars/setPhoneNumber';
const SET_EMAIL = 'appVars/setEmail';
const SET_WEBSITE = 'appVars/setWebsite';
const SET_RETURN_POLICY = 'appVars/setReturnPolicy';
const SET_DELIVERY_SPEED = 'appVars/setDeliverySpeed';





const initialState = {
    loading: true,
    screenWidthIsLessThan480:false,
    customerId: DEFAULT_VALUES.CUSTOMER_ID,  // Assuming customerId is a number
    customerDetails: DEFAULT_VALUES.CUSTOMER_DETAILS,  // Assuming customerDetails is an object containing customer data
    screenWidthIsLessThan800:false,
    wishList: [],  // Assuming wishList is a boolean value
    homePageVisited: false, 
    currentPage: Paths.HOME,  // Assuming currentPage is a string
    messages: [],  // Assuming messages is an array of objects containing messages
    messagesLimit: 1,
    deliveryRange: DEFAULT_VALUES.GENERAL_RANGE.DATA,  // Assuming deliveryRange is a number
    baseDeliveryFee: 3,
    baseDeliveryDistance: 3,
    deliveryPricePerMile: 0.5,
    taxFee: 0,
    phoneNumber: 0,
    email: '',
    website: '',
    returnPolicy: '',
    deliverySpeed: 0,
};

export default function appVars(state = initialState, action) {
    switch (action.type) {
        case TRIGGER_LOADING:
            return { 
                ...state, 
                loading:true,
            };
        case RESET_LOADING:
            return { 
                ...state, 
                loading:false,
            };
        case SET_SCREEN_WIDTH_IS_LESS_THAN_480:
            return { 
                ...state, 
                screenWidthIsLessThan480:action.state,
            };   
        case SET_CUSTOMER_ID:
            return { 
               ...state,
                customerId: action.customerId
            };    
        case SET_CUSTOMER_DETAILS:
            return { 
               ...state,
                customerDetails: action.customerDetails
            };     
        case SET_SCREEN_WIDTH_IS_LESS_THAN_800:
            return { 
               ...state,
                screenWidthIsLessThan800: action.state
            };
        case SET_WISH_LIST:
            return { 
               ...state,
                wishList: action.wishList
            };
        case ADD_TO_WISH_LIST:
            return { 
               ...state,
                wishList: [...state.wishList, action.itemId],
            };
        case SET_HOME_PAGE_VISITED:
            return { 
               ...state,
                homePageVisited: action.homePageVisited
            };
        case SET_CURRENT_PAGE:
            return { 
               ...state,
                currentPage: action.currentPage
            };
        case ADD_MESSAGE:
            // Create a new array with the added message
            let newMessages = [...state.messages, action.message];
            
            // Check if the messages limit is exceeded
            if (newMessages.length > state.messagesLimit) {
                newMessages = newMessages.slice(1);  // Remove the oldest message
            }
            
            return { 
                ...state,
                messages: newMessages
            };
    
        case REMOVE_MESSAGE:
            
            // Filter out the message by index
            const lessMessages = state.messages.filter((_, index) => index !== action.index);
            
            return { 
                ...state,
                messages: lessMessages
            };
        case SET_MESSAGE:
            return { 
               ...state,
                messages: [action.message]
            };
        case SET_DELIVERY_RANGE:
            return { 
               ...state,
                deliveryRange: action.deliveryRange
            };
        case SET_BASE_DELIVERY_FEE:
            return { 
               ...state,
                baseDeliveryFee: action.baseDeliveryFee
            };
        case SET_BASE_DELIVERY_DISTANCE:
            return { 
               ...state,
                baseDeliveryDistance: action.baseDeliveryDistance
            };
        case SET_DELIVERY_PRICE_PER_MILE:
            return { 
               ...state,
                deliveryPricePerMile: action.deliveryPricePerMile
            };
        case SET_TAX_FEE:
            return { 
               ...state,
                taxFee: action.taxFee
            };
        case SET_PHONE_NUMBER:
            return { 
               ...state,
                phoneNumber: action.phoneNumber
            };
        case SET_EMAIL:
            return { 
               ...state,
                email: action.email
            };
        case SET_WEBSITE:
            return { 
               ...state,
                website: action.website
            };
        case SET_RETURN_POLICY:
            return { 
               ...state,
                returnPolicy: action.returnPolicy
            };
        case SET_DELIVERY_SPEED:
            return { 
               ...state,
                deliverySpeed: action.deliverySpeed
            };
        // Add other actions here as needed
        default:
            return state;
    }
}


export const triggerLoading = () => ({
    type: TRIGGER_LOADING,     
});

export const resetLoading = () => ({
    type: RESET_LOADING,              
});

export const setScreenWidthIsLessThan480 = (state) => ({
    type: SET_SCREEN_WIDTH_IS_LESS_THAN_480,    
    state:state          
});

export const setCustomerId = (customerId) => ({
    type: SET_CUSTOMER_ID,
    customerId: customerId
});

export const setCustomerDetails = (customerDetails) => ({
    type: SET_CUSTOMER_DETAILS,
    customerDetails: customerDetails
});

export const setScreenWidthIsLessThan800 = (state) => ({
    type: SET_SCREEN_WIDTH_IS_LESS_THAN_800,    
    state:state          
});

export const setWishList = (wishList) => ({
    type: SET_WISH_LIST,
    wishList: wishList
});

export const addToWishList = (itemId) => ({
    type: ADD_TO_WISH_LIST,  
    itemId: itemId  
});

export const setHomePageVisited = (homePageVisited) => ({
    type: SET_HOME_PAGE_VISITED,
    homePageVisited: homePageVisited
});

export const setCurrentPage = (currentPage) => ({
    type: SET_CURRENT_PAGE,
    currentPage: currentPage
});

export const addMessage = (message) => ({
    type: ADD_MESSAGE,
    message: message
});

export const removeMessage = (index) => ({
    type: REMOVE_MESSAGE,
    index: index
});

export const setMessage = (message) => ({
    type: SET_MESSAGE,
    message: message
});

export const setDeliveryRange = (deliveryRange) => ({
    type: SET_DELIVERY_RANGE,
    deliveryRange: deliveryRange
});

export const setBaseDeliveryFee = (baseDeliveryFee) => ({
    type: SET_BASE_DELIVERY_FEE,
    baseDeliveryFee: baseDeliveryFee
});

export const setBaseDeliveryDistance = (baseDeliveryDistance) => ({
    type: SET_BASE_DELIVERY_DISTANCE,
    baseDeliveryDistance: baseDeliveryDistance
});

export const setDeliveryPricePerMile = (deliveryPricePerMile) => ({
    type: SET_DELIVERY_PRICE_PER_MILE,
    deliveryPricePerMile: deliveryPricePerMile
});

export const setTaxFee = (taxFee) => ({
    type: SET_TAX_FEE,
    taxFee: taxFee
});

export const setPhoneNumber = (phoneNumber) => ({
    type: SET_PHONE_NUMBER,
    phoneNumber: phoneNumber
});

export const setEmail = (email) => ({
    type: SET_EMAIL,
    email: email
});

export const setWebsite = (website) => ({
    type: SET_WEBSITE,
    website: website
});

export const setReturnPolicy = (returnPolicy) => ({
    type: SET_RETURN_POLICY,
    returnPolicy: returnPolicy
});

export const setDeliverySpeed = (deliverySpeed) => ({
    type: SET_DELIVERY_SPEED,
    deliverySpeed: deliverySpeed
});