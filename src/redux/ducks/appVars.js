// redux/ducks/appVars.js

import DEFAULT_VALUES from "../../constants/defaultValues";

const TRIGGER_LOADING = 'appVars/triggerLoading';
const RESET_LOADING = 'appVars/resetLoading';
const SET_SCREEN_WIDTH_IS_LESS_THAN_480 = 'appVars/setScreenWidthIsLessThan480';
const SET_CUSTOMER_ID = 'appVars/setCustomerId';
const SET_CUSTOMER_DETAILS = 'appVars/setCustomerDetails';
const SET_SCREEN_WIDTH_IS_LESS_THAN_800 = 'appVars/setScreenWidthIsLessThan800';


const initialState = {
    loading: true,
    screenWidthIsLessThan480:false,
    customerId: DEFAULT_VALUES.CUSTOMER_ID,  // Assuming customerId is a number
    customerDetails: DEFAULT_VALUES.CUSTOMER_DETAILS,  // Assuming customerDetails is an object containing customer data
    screenWidthIsLessThan800:false,
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