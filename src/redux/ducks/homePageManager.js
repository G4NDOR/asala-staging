// redux/ducks/homePageManager.js

import DEFAULT_VALUES from "../../constants/defaultValues";

// Action types
const SET_ITEMS = 'homePageManager/setItems';
const ADD_ITEM = 'homePageManager/addItem';
const REMOVE_ITEM = 'homePageManager/removeItem';
const CLEAR_ITEMS = 'homePageManager/clearItems';
const SET_WELCOME_SECTION_IMAGES = 'homePageManager/setWelcomeSectionImages';
const SET_INTERVAL = 'homePageManager/setInterval';
const SET_ANNOUNCEMENTS = 'homePageManager/setAnnouncements';
const SET_WELCOME_SECTION_TITLE = 'homePageManager/setWelcomeSectionTitle';
const SET_WELCOME_SECTION_CONTENT = 'homePageManager/setWelcomeSectionContent';
const TRIGGER_LOADIND_MORE = 'homePageManager/triggerLoadingMore';
const RESET_LOADING_MORE = 'homePageManager/resetLoadingMore';
const ADD_ITEMS = 'homePageManager/addItems';
const SET_SEARCH_TERM = 'homePageManager/setSearchTerm';
const TRIGGER_SEARCHING = 'homePageManager/triggerSearching';
const RESET_SEARCHING = 'homePageManager/resetSearching';
const SET_SEARCH_ITEMS = 'homePageManager/setSearchItems';
const SET_SEARCH_BAR_IS_OPEN = 'homePageManager/setSearchBarIsOpen';
const SET_PRODUCT_SELECTED_ID = 'homePageManager/setProductSelectedId';
const SET_FIRST_TIME_PAGE_VISIT = 'homePageManager/setFirstTimePage';
const SET_LAST_DOC = 'homePageManager/setLastDoc';
const ADD_SEARCH_IMTEMS = 'homePageManager/addSearchItems';
const SET_LAST_SEARCHED_DOC = 'homePageManager/setLastSearchedDoc';



const initialState = {
    items: [], // Array to store items
    searchItems: [], // Array to store
    announcements: [], // Array to store
    welcomeSectionImages:DEFAULT_VALUES.IMAGES,
    interval: DEFAULT_VALUES.INTERVAL,
    welcomeSectionTitle:DEFAULT_VALUES.TITLE,
    welcomeSectionContent: DEFAULT_VALUES.CONTENT,
    loadingMore: false,
    searchTerm: '',
    searching: false,
    searchBarIsOpen: false,
    productSelectedId: DEFAULT_VALUES.PRODUCT.id,
    firstTimePageVisit: true,
    lastDoc: null,
    lastSearchedDoc: null,
};

export default function homePageManager(state = initialState, action) {
    switch (action.type) {
        case SET_ITEMS:
            return { 
                ...state, 
                items: action.items 
            };
        case ADD_ITEM:
            return { 
                ...state, 
                items: [...state.items, action.item] 
            };
        case REMOVE_ITEM:
            return { 
                ...state, 
                items: state.items.filter(item => item.id !== action.id) 
            };
        case CLEAR_ITEMS:
            return { 
                ...state, 
                items: [] 
            };
        case SET_WELCOME_SECTION_IMAGES:
            return { 
                ...state, 
                welcomeSectionImages: action.images 
            };    
        case SET_INTERVAL:
            return { 
               ...state, 
                interval: action.interval 
            };
        case SET_ANNOUNCEMENTS:
            return { 
               ...state, 
                announcements: action.announcements 
            };   
        case SET_WELCOME_SECTION_TITLE:
            return { 
               ...state, 
                welcomeSectionTitle: action.title 
            };
        case SET_WELCOME_SECTION_CONTENT:
            return { 
               ...state, 
                welcomeSectionContent: action.content 
            };
        case TRIGGER_LOADIND_MORE:
            return { 
               ...state, 
                loadingMore: true 
            };
        case RESET_LOADING_MORE:
            return { 
               ...state, 
                loadingMore: false 
            };
        case ADD_ITEMS:
            const newItems = action.items.map(item => {
                // Find the index of the item in the state array that matches the current action item
                const existingItemIndex = state.items.findIndex(stateItem => stateItem.id === item.id);
            
                // If the item exists in the cart, update the quantity (this code is missing)
                if (existingItemIndex !== -1) {
                    // You might want to update the quantity or other properties here
                    // For example:
                    // state.items[existingItemIndex].quantity += item.quantity;
                    // If you don't want to return anything in this case, return null
                    return null; // or undefined to skip adding it to the newItems array
                } else {
                    // If the item doesn't exist, add it to the newItems array
                    return {...item, quantity: 1};
                }
            }).filter(item => item !== null);
            return { 
               ...state, 
                items: [...state.items,...newItems] 
            };
        case SET_SEARCH_TERM:
            return { 
               ...state, 
                searchTerm: action.searchTerm 
            };
        case TRIGGER_SEARCHING:
            return { 
               ...state, 
                searching: true 
            };
        case RESET_SEARCHING:
            return { 
               ...state, 
                searching: false 
            };
        case SET_SEARCH_ITEMS:
            return { 
               ...state, 
                searchItems: action.searchItems 
            };
        case SET_SEARCH_BAR_IS_OPEN:
            return { 
               ...state, 
                searchBarIsOpen: action.isOpen 
            };
        case SET_PRODUCT_SELECTED_ID:
            return { 
               ...state, 
                productSelectedId: action.productId 
            };
        case SET_FIRST_TIME_PAGE_VISIT:
            return { 
               ...state, 
                firstTimePageVisit: action.isFirstTime
            };
        case SET_LAST_DOC:
            return { 
               ...state, 
                lastDoc: action.lastDoc
            };
        case ADD_SEARCH_IMTEMS:
            return { 
               ...state, 
                searchItems: [...state.searchItems,...action.searchItems] 
            };
        case SET_LAST_SEARCHED_DOC:
            return { 
               ...state, 
                lastSearchedDoc: action.lastDoc
            };
        // Add other action types as needed for the home page manager module
        default:
            return state;
    }
}


export const setItems = (items) => ({
    type: SET_ITEMS,
    items
});

export const addItem = (item) => ({
    type: ADD_ITEM,
    item
});

export const removeItem = (id) => ({
    type: REMOVE_ITEM,
    id
});

export const clearItems = () => ({
    type: CLEAR_ITEMS
});

export const setWelcomeSectionImages = (images) => ({
    type: SET_WELCOME_SECTION_IMAGES,
    images
});

export const setInterval = (interval) => ({
    type: SET_INTERVAL,
    interval
});

export const setAnnouncements = (announcements) => ({
    type: SET_ANNOUNCEMENTS,
    announcements
});

export const setWelcomeSectionTitle = (title) => ({
    type: SET_WELCOME_SECTION_TITLE,
    title
});

export const setWelcomeSectionContent = (content) => ({
    type: SET_WELCOME_SECTION_CONTENT,
    content
});

export const triggerLoadingMore = () => ({
    type: TRIGGER_LOADIND_MORE
});

export const resetLoadingMore = () => ({
    type: RESET_LOADING_MORE
});

export const addItems = (items) => ({
    type: ADD_ITEMS,
    items
});

export const setSearchTerm = (searchTerm) => ({
    type: SET_SEARCH_TERM,
    searchTerm
});

export const triggerSearching = () => ({
    type: TRIGGER_SEARCHING
});

export const resetSearching = () => ({
    type: RESET_SEARCHING
});

export const setSearchItems = (searchItems) => ({
    type: SET_SEARCH_ITEMS,
    searchItems
});

export const setSearchBarIsOpen = (isOpen) => ({
    type: SET_SEARCH_BAR_IS_OPEN,
    isOpen
});

export const setProductSelectedId = (productId) => ({
    type: SET_PRODUCT_SELECTED_ID,
    productId
});

export const setFirstTimePageVisit = (isFirstTime) => ({
    type: SET_FIRST_TIME_PAGE_VISIT,
    isFirstTime
});

export const setLastDoc = (lastDoc) => ({
    type: SET_LAST_DOC,
    lastDoc
});

export const addSearchItems = (searchItems) => ({
    type: ADD_SEARCH_IMTEMS,
    searchItems
});

export const setLastSearchedDoc = (lastDoc) => ({
    type: SET_LAST_SEARCHED_DOC,
    lastDoc
});