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


const initialState = {
    loading: true,
    screenWidthIsLessThan480:false,
    customerId: DEFAULT_VALUES.CUSTOMER_ID,  // Assuming customerId is a number
    customerDetails: DEFAULT_VALUES.CUSTOMER_DETAILS,  // Assuming customerDetails is an object containing customer data
    screenWidthIsLessThan800:false,
    wishList: [],  // Assuming wishList is a boolean value
    homePageVisited: false, 
    currentPage: Paths.HOME,  // Assuming currentPage is a string
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