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
const SELECT_VARIANT = 'productPageManager/selectVariant';
const DESELCT_VARIANT = 'productPageManager/deselectVariant';
const SET_VARIANT_FIELD = 'productPageManager/setVariantField';
const SET_START_INDEX = 'productPageManager/setStartIndex';
const SET_END_INDEX = 'productPageManager/setEndIndex';
const ADD_OPTIONAL_ADDITION = 'productPageManager/addOptionalAddition';
const REMOVE_OPTIONAL_ADDITION = 'productPageManager/removeOptionalAddition';
const SET_GEO_POINT = 'productPageManager/setGeoPoint';


const initialState = {
    product: null, // Store product information here
    isDescriptionExpanded: false, // Boolean for description section state
    notes:"",
    address:DEFAULT_VALUES.ADDRESS, 
    geopoint: {
        _lat: null,
        _long: null
    },
    producerImg: DEFAULT_VALUES.IMAGES[0],
    selectedAddressId: DEFAULT_VALUES.SELECTED_ADDRESS_ID,
    addresses: [], // Array of customer addresses
    recommendations: [],
    selectedVariants: {}, //
    variantsFields: {}, // store fields of product that are adjusted with variants
    startIndex: 0,//index that will give the highest level of variants in selctedVariants
    endIndex: 0,//index that will give the lowest level of variants in selctedVariants
    selectedOptionalAdditions: {},//
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

        case SELECT_VARIANT:
            // console.log("selecting variant", action.variant, "in index", action.index)
            return { 
               ...state,
                selectedVariants: {...state.selectedVariants, [action.index]: action.variant}
            };
        case DESELCT_VARIANT:
            const variantKey = action.variantId;
            const newSelectedVariants = { ...state.selectedVariants }; // Create a shallow copy of the selectedVariants
            
            delete newSelectedVariants[variantKey]; // Remove the key from the copied object
            
            return {
                ...state,
                selectedVariants: newSelectedVariants // Return the updated state
            };
        case SET_VARIANT_FIELD:
            return { 
               ...state,
                variantsFields: {...state.variantsFields, [action.index]: action.field}
            };        
        case SET_START_INDEX:
            return { 
               ...state,
                startIndex: action.startIndex
            };
        case SET_END_INDEX:
            return { 
               ...state,
                endIndex: action.endIndex
            };
        case ADD_OPTIONAL_ADDITION:
            const array = [...state.selectedOptionalAdditions[action.addition.type] || []];
            const newArray = [...array.filter(addition=>addition.id!== action.addition.id), action.addition];
            return { 
               ...state,
                selectedOptionalAdditions: {...state.selectedOptionalAdditions, [action.addition.type]: newArray}
            };
        case REMOVE_OPTIONAL_ADDITION:
            const additions = state.selectedOptionalAdditions[action.addition.type];
            const indexToRemove = additions ? additions.indexOf(action.addition) : -1;                        
            if (indexToRemove!== -1) {
                const array = [...additions];
                array.splice(indexToRemove, 1);
                return { 
                   ...state,
                    selectedOptionalAdditions: {...state.selectedOptionalAdditions, [action.addition.type]: array}
                };
            }
            return state; // If the addition is not found in the array, return the state as is.
        case SET_GEO_POINT:
            return { 
               ...state,
                geopoint: action.geopoint
            };
         // Add more action creators here for other actions related to the product page manager slice of state.
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

export const selectVariant = (variant, index) => ({
    type: SELECT_VARIANT,
    variant: variant,
    index: index
});

export const deselectVariant = (variantId) => ({
    type: DESELCT_VARIANT,
    variantId: variantId
});

export const setVariantField = (field, index) => ({
    type: SET_VARIANT_FIELD,
    field: field,
    index: index
});

export const setStartIndex = (startIndex) => ({
    type: SET_START_INDEX,
    startIndex: startIndex
});

export const setEndIndex = (endIndex) => ({
    type: SET_END_INDEX,
    endIndex: endIndex
});

export const addOptionalAddition = (addition) => ({
    type: ADD_OPTIONAL_ADDITION,
    addition: addition
});

export const removeOptionalAddition = (addition) => ({
    type: REMOVE_OPTIONAL_ADDITION,
    addition: addition
});

export const setGeoPoint = (geopoint) => ({
    type: SET_GEO_POINT,
    geopoint: geopoint
});

