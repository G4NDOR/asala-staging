// redux/ducks/productPageManager.js

import DEFAULT_VALUES from "../../constants/defaultValues";

const SET_PRODUCT = 'productPageManager/setProduct';
const REMOVE_PRODUCT = 'productPageManager/removeProduct'; // New action type
const TOGGLE_DESCRIPTION = 'productPageManager/toggleDescription';
const SET_NOTES = 'productPageManager/setNotes';
const SET_ADDRESS = 'productPageManager/setAddress';
const SET_PRODUCER_IMG = 'productPageManager/setProducerImg';
const SET_SELECTED_ADDRESS_ID = 'productPageManager/setSelectedAddressId';

const initialState = {
    product: DEFAULT_VALUES.PRODUCT, // Store product information here
    isDescriptionExpanded: false, // Boolean for description section state
    notes:"",
    address:DEFAULT_VALUES.ADDRESS, 
    producerImg: DEFAULT_VALUES.IMAGES[0],
    selectedAddressId: DEFAULT_VALUES.SELECTED_ADDRESS_ID,
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

