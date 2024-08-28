const SET_CART_IS_OPEN= 'orderManager/setCartIsOpen'

const REMOVE_ITEM = 'orderManager/removeItem';
const INCREASE_QUANTITY = 'orderManager/increaseQuantity';
const DECREASE_QUANTITY = 'orderManager/decreaseQuantity';
const CLEAR_CART = 'orderManager/clearCart';
const ADD_ITEM_TO_CART = 'orderManager/addItemToCart';
const SET_CART = 'orderManager/setCart';
const SET_ONE_ITEM_CHECKOUT = 'orderManager/setOneItemCheckout';
const CLEAR_ONE_ITEM_CHECKOUT = 'orderManager/clearOneItemCheckout';
const ADD_ONE_ITEM_CHECKOUT = 'orderManager/addOneItemCheckout';
const REMOVE_ONE_ITEM_CHECKOUT = 'orderManager/removeOneItemCheckout';
const INCREASE_ONE_ITEM_QUANTITY = 'orderManager/increaseOneItemQuantity';
const DECREASE_ONE_ITEM_QUANTITY = 'orderManager/decreaseOneItemQuantity';
const TRIGGER_UNSEEN_CHANGES = 'orderManager/triggerUnseenChanges';
const RESET_UNSEEN_CHANGES = 'orderManager/resetUnseenChanges';
const TRIGGER_ANIMATION = 'orderManager/triggerAnimation';
const RESET_ANIMATION = 'orderManager/resetAnimation';
const TRIGGER_INTENT_TO_PAY = 'orderManager/triggerIntentToPay';
const RESET_INTENT_TO_PAY = 'orderManager/resetIntentToPay';
const TRIGGER_INTENT_TO_PAY_CONFIRMED = 'orderManager/triggerIntentToPayConfirmed';
const RESET_INTENT_TO_PAY_CONFIRMED = 'orderManager/resetIntentToPayConfirmed';
const SET_CART_LOADED_FROM_STORAGE = 'orderManager/setCartLoadedFromStorage';




const initialState = {
    cartIsOpen: false,
    cart: [], // Array to hold cart items
    cartLoadedFromStorage: false, // New boolean to indicate if cart data has been loaded from storage
    cartIsEmpty: true,  // New boolean to indicate if the cart is empty
    oneItemCheckout: [],   // Add this to manage a single product
    unseenChanges: false, // New boolean to track unseen changes
    isAnimated:false,
    mainOneItemCheckoutId: '',
    intentToPay:false,
    intentToPayConfirmed:false
}

export default function orderManager(state = initialState, action) {
    switch (action.type) {
        case SET_CART_IS_OPEN:
            return { ...state, cartIsOpen: action.cartIsOpen };
        case REMOVE_ITEM:
            const newCartRemove = state.cart.filter(item => item.id !== action.id);
            return { 
                ...state, 
                cart: newCartRemove,
                cartIsEmpty: newCartRemove.length === 0 
            };
        case INCREASE_QUANTITY:
            const updatedCartIncrease = state.cart.map(item => 
                item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            return { 
                ...state, 
                cart: updatedCartIncrease,
                cartIsEmpty: updatedCartIncrease.length === 0 
            };
        case DECREASE_QUANTITY:
            const updatedCartDecrease = state.cart.map(item => {
                if (item.id === action.id) {
                    if (item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    } else {
                        return null; // Mark item for removal
                    }
                }
                return item;
            }).filter(item => item !== null); // Remove marked items
            return { 
                ...state, 
                cart: updatedCartDecrease,
                cartIsEmpty: updatedCartDecrease.length === 0 
            };
        case CLEAR_CART:
            return { 
                ...state, 
                cart: [],
                cartIsEmpty: true  // Cart is empty after clearing
            };
        case ADD_ITEM_TO_CART:
            const existingItemIndex = state.cart.findIndex(cartItem => cartItem.id === action.item.id);
            //console.log(ADD_ITEM_TO_CART);
            // If the item exists in the cart, update the quantity
            if (existingItemIndex !== -1) {
                //console.log('item exists alredy => increase quantity');
                const updatedCart = state.cart.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    ...state,
                    cart: updatedCart,
                    cartIsEmpty: updatedCart.length === 0
                };
            }else{
                //console.log("item doesn't exist =>  add item");
                // Otherwise, add the new item to the cart
                const newItem = { ...action.item, quantity: 1 };
                const newCart = [...state.cart, newItem];
                return {
                    ...state,
                    cart: newCart,
                    cartIsEmpty: newCart.length === 0
                };
            }
        case SET_CART:
            return { 
                ...state, 
                cart: action.cart,
                cartIsEmpty: action.cart.length === 0  // Update based on provided cart
            };
        case SET_ONE_ITEM_CHECKOUT:
            return { 
                ...state, 
                oneItemCheckout: action.oneItemCheckout,
            };
        case CLEAR_ONE_ITEM_CHECKOUT:
            return { 
                ...state, 
                oneItemCheckout: [],
            };            
        case ADD_ONE_ITEM_CHECKOUT:
            const _existingItemIndex = state.oneItemCheckout.findIndex(item => item.id === action.item.id);
            //console.log("ADD_ITEM_TO_CART");
            // If the item exists in the cart, update the quantity
            if (_existingItemIndex !== -1) {
                //console.log('item exists alredy => increase quantity');
                const updatedOneItemCheckout = state.oneItemCheckout.map((item, index) =>
                    index === _existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    ...state,
                    oneItemCheckout: updatedOneItemCheckout,
                };
            }else if (state.oneItemCheckout.length == 0){
                //console.log("item doesn't exist and list is empty =>  add item as main ");
                // Otherwise, add the new item to the cart
                const newItem = { ...action.item, quantity: 1 };
                const newOneItemCheckout = [...state.oneItemCheckout, newItem];
                return {
                    ...state,
                    oneItemCheckout: newOneItemCheckout,
                    mainOneItemCheckoutId: newItem.id,
                };
            }else{
                //console.log("item doesn't exist =>  add item");
                //console.log(" main id: ", action.item.id )
                // Otherwise, add the new item to the cart
                const newItem = { ...action.item, quantity: 1 };
                const newOneItemCheckout = [...state.oneItemCheckout, newItem];
                return {
                    ...state,
                    oneItemCheckout: newOneItemCheckout,
                };
            }
        case REMOVE_ONE_ITEM_CHECKOUT:
            const _updatedCartDecrease = state.oneItemCheckout.map(item => {
                if (item.id === action.id) {
                    if (item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    } else {
                        return null; // Mark item for removal
                    }
                }
                return item;
            }).filter(item => item !== null); // Remove marked items
            return { 
                ...state, 
                oneItemCheckout: _updatedCartDecrease,
            };
        case INCREASE_ONE_ITEM_QUANTITY:
            const updatedOneItemCheckoutIncrease = state.oneItemCheckout.map(item => 
                item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            return { 
                ...state, 
                oneItemCheckout: updatedOneItemCheckoutIncrease
            };
        case DECREASE_ONE_ITEM_QUANTITY:
            const updatedOneItemCheckoutDecrease = state.oneItemCheckout.map(item => {
                //console.log("state.oneItemCheckout: ", state.oneItemCheckout);
                //console.log("state.oneItemCheckout: ", state.mainOneItemCheckoutId);
                if (item.id === action.id) {
                    if (item.quantity > 1) {
                        //console.log("quantity more than 2, decreasing");
                        return { ...item, quantity: item.quantity - 1 };
                    } else if (action.id != state.mainOneItemCheckoutId) {
                        //console.log("action.id: ", action.id);
                        //console.log("state.mainOneItemCheckoutId: ", state.mainOneItemCheckoutId);
                        //console.log("quantity less than 2 and not main item, removing");
                        return null; // Mark item for removal
                    }else {
                        //console.log("main item, not removing")
                        //return null; // Mark item for removal
                        return { ...item, quantity: item.quantity};
                    }
                }
                return item;
            }).filter(item => item !== null); // Remove marked items
            return { 
                ...state, 
                oneItemCheckout: updatedOneItemCheckoutDecrease,
            };
        case TRIGGER_UNSEEN_CHANGES:
            return { ...state, unseenChanges: true };
        case RESET_UNSEEN_CHANGES:
            return { ...state, unseenChanges: false };
        case TRIGGER_ANIMATION:
            return { ...state, isAnimated: true };
        case RESET_ANIMATION:
            return { ...state, isAnimated: false };
        case TRIGGER_INTENT_TO_PAY:
            return { ...state, intentToPay: true };
        case RESET_INTENT_TO_PAY:
            return { ...state, intentToPay: false };
        case TRIGGER_INTENT_TO_PAY_CONFIRMED:
            return { ...state, intentToPayConfirmed: true };
        case RESET_INTENT_TO_PAY_CONFIRMED:
            return { ...state, intentToPayConfirmed: false };            
        case SET_CART_LOADED_FROM_STORAGE:
            return { ...state, cartLoadedFromStorage: action.cartLoadedFromStorage };
        default:
            return state;
    }
}


export const setCartIsOpen=(cartIsOpen)=> ({
    type:SET_CART_IS_OPEN,
    cartIsOpen:cartIsOpen
})



export const removeItem = (id) => ({
    type: REMOVE_ITEM,
    id
});

export const increaseQuantity = (id) => ({
    type: INCREASE_QUANTITY,
    id
});

export const decreaseQuantity = (id) => ({
    type: DECREASE_QUANTITY,
    id
});

export const clearCart = () => ({
    type: CLEAR_CART
});

export const addItemToCart = (item) => ({
    type: ADD_ITEM_TO_CART,
    item: item
});

export const setCart = (cart) => ({
    type: SET_CART,
    cart
});

export const setOneItemCheckout = (items) => ({
    type: SET_ONE_ITEM_CHECKOUT,
    items: items
});

export const clearOneItemCheckout = () => ({
    type: CLEAR_ONE_ITEM_CHECKOUT,
});

export const addOneItemCheckout = (item) => ({
    type: ADD_ONE_ITEM_CHECKOUT,
    item
});

export const removeOneItemCheckout = (id) => ({
    type: REMOVE_ONE_ITEM_CHECKOUT,
    id:id
});

export const increaseOneItemQuantity = (id) => ({
    type: INCREASE_ONE_ITEM_QUANTITY,
    id:id
});

export const decreaseOneItemQuantity = (id) => ({
    type: DECREASE_ONE_ITEM_QUANTITY,
    id:id
});

export const triggerUnseenChanges = () => ({
    type: TRIGGER_UNSEEN_CHANGES,
});

export const resetUnseenChanges = () => ({
    type: RESET_UNSEEN_CHANGES,
});

export const triggerAnimation = () => ({
    type: TRIGGER_ANIMATION,
});

export const resetAnimation = () => ({
    type: RESET_ANIMATION,
});

export const triggerIntentToPay = () => ({
    type: TRIGGER_INTENT_TO_PAY,
});

export const resetIntentToPay = () => ({
    type: RESET_INTENT_TO_PAY,
});

export const triggerIntentToPayConfirmed = () => ({
    type: TRIGGER_INTENT_TO_PAY_CONFIRMED,
});

export const resetIntentToPayConfirmed = () => ({
    type: RESET_INTENT_TO_PAY_CONFIRMED,
});

export const setCartLoadedFromStorage = (cartLoadedFromStorage) => ({
    type: SET_CART_LOADED_FROM_STORAGE,
    cartLoadedFromStorage
});


