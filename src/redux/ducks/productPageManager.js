// redux/ducks/productPageManager.js

import DEFAULT_VALUES from "../../constants/defaultValues";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES } from "../../constants/firebase";

const SET_PRODUCT = 'productPageManager/setProduct';
const REMOVE_PRODUCT = 'productPageManager/removeProduct'; // New action type
const TOGGLE_DESCRIPTION = 'productPageManager/toggleDescription';
const SET_NOTES = 'productPageManager/setNotes';
const SET_ADDRESS = 'productPageManager/setAddress';
const SET_PRODUCER_IMG = 'productPageManager/setProducerImg';
const SET_SELECTED_ADDRESS_ID = 'productPageManager/setSelectedAddressId';
const SET_RECOMMENDATIONS = 'productPageManager/setRecommendations';
const SET_ADDRESSES = 'productPageManager/setAddresses';
const ADD_ADDRESS = 'productPageManager/addAddress';

const initialState = {
    product: DEFAULT_VALUES.PRODUCT, // Store product information here
    isDescriptionExpanded: false, // Boolean for description section state
    notes:"",
    address:DEFAULT_VALUES.ADDRESS, 
    producerImg: DEFAULT_VALUES.IMAGES[0],
    selectedAddressId: DEFAULT_VALUES.SELECTED_ADDRESS_ID,
    addresses: [], // Array of customer addresses
    recommendations: []
};


export default function productPageManager(state = initialState, action) {
    switch (action.type) {
        case SET_PRODUCT:
            return { 
                ...state, 
                product: action.product 
            };
        case REMOVE_PRODUCT:
            return { 
                ...state, 
                product: null // Remove the product
            };
        case TOGGLE_DESCRIPTION:
            return { 
                ...state, 
                isDescriptionExpanded: !state.isDescriptionExpanded 
            };
        case SET_NOTES:
            return { 
                ...state, 
                notes: action.notes 
            };
        case SET_ADDRESS:
            return { 
                ...state, 
                address: action.address 
            };
        case SET_PRODUCER_IMG:
            return { 
               ...state, 
                producerImg: action.producerImg 
            };            
        case SET_SELECTED_ADDRESS_ID:
            return { 
               ...state, 
                selectedAddressId: action.selectedAddressId 
            };
        case SET_RECOMMENDATIONS:
            return { 
               ...state, 
                recommendations: action.recommendations 
            };
        case SET_ADDRESSES:
            return { 
               ...state, 
                addresses: action.addresses 
            };
        case ADD_ADDRESS:
            const existingAddressIndex = state.addresses.findIndex(address => address === action.address);
            if (existingAddressIndex !== -1) {
                return state; // Address already exists in the array
            }
            // If the address doesn't exist, add it to the array
            else {
                return { 
                    ...state, 
                     addresses: [...state.addresses, action.address] // Add new address to the array
                 };
            }


        // Add more action creators as needed for other actions related to the product page
        // Add more cases as needed for other actions related to the product page
        default:
            return state;
    }
}


export const setProduct = (product) => ({
    type: SET_PRODUCT,
    product
});

export const removeProduct = () => ({
    type: REMOVE_PRODUCT // New action creator
});

export const toggleDescription = () => ({
    type: TOGGLE_DESCRIPTION
});

export const setNotes = (notes) => ({
    type: SET_NOTES,
    notes: notes
});

export const setAddress = (address) => ({
    type: SET_ADDRESS,
    address: address
});

export const setProducerImg = (producerImg) => ({
    type: SET_PRODUCER_IMG,
    producerImg: producerImg
});

export const setSelectedAddressId = (selectedAddressId) => ({
    type: SET_SELECTED_ADDRESS_ID,
    selectedAddressId: selectedAddressId
});

export const setRecommendations = (recommendations) => ({
    type: SET_RECOMMENDATIONS,
    recommendations: recommendations
});

export const setAddresses = (addresses) => ({
    type: SET_ADDRESSES,
    addresses: addresses
});

export const addAddress = (address) => ({
    type: ADD_ADDRESS,
    address: address
});

