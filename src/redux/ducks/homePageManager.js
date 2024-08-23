// redux/ducks/homePageManager.js

const SET_ITEMS = 'homePageManager/setItems';
const ADD_ITEM = 'homePageManager/addItem';
const REMOVE_ITEM = 'homePageManager/removeItem';
const CLEAR_ITEMS = 'homePageManager/clearItems';


const initialState = {
    items: [] // Array to store items
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
