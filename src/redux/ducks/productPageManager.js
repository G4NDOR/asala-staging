// redux/ducks/productPageManager.js

const SET_PRODUCT = 'productPageManager/setProduct';
const REMOVE_PRODUCT = 'productPageManager/removeProduct'; // New action type
const TOGGLE_DESCRIPTION = 'productPageManager/toggleDescription';
const SET_NOTES = 'productPageManager/setNotes';
const SET_ADDRESS = 'productPageManager/setAddress';

const initialState = {
    product: null, // Store product information here
    isDescriptionExpanded: false, // Boolean for description section state
    notes:"",
    address:""
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

