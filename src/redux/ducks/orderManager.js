import Paths from "../../constants/navigationPages";
import { isSameProduct } from "../../utils/appUtils";
import { saveOrUpdateCartItemToLocalStorage } from "../../utils/firestoreUtils";

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
const SET_PAYMENT_METHOD = 'orderManager/setPaymentMethod';
const SET_DISCOUNTS = 'orderManager/setDiscounts';
const ADD_DISCOUNT = 'orderManager/addDiscount';
const REMOVE_DISCOUNT = 'orderManager/removeDiscount';
const SET_SELECTED_DISCOUNTS = 'orderManager/setSelectedDiscounts';
const SELECT_DISCOUNT = 'orderManager/selectDiscount';
const DESELECT_DISCOUNT = 'orderManager/deselectDiscount';
const SET_DISCOUNT_MESSAGE = 'orderManager/setDiscountMessage';
const SET_DISCOUNTS_LOOKED_UP = 'orderManager/setDiscountsLookedUp';
const SET_USED_CREDIT = 'orderManager/setUsedCredit';
const BAN_DISCOUNT = 'orderManager/banDiscount';
const UNBAN_DISCOUNT = 'orderManager/unbanDiscount';
const SET_NAME = 'orderManager/setName';
const SET_EMAIL = 'orderManager/setEmail';
const SET_PHONE = 'orderManager/setPhone';
const SET_DELIVERY_FEE = 'orderManager/setDeliveryFee';
const SET_ITEMS_OBJECT = 'orderManager/setItemsObject';
const SET_TOTAL_PRICE = 'orderManager/setTotalPrice';
const SET_FINAL_SELECTED_DISCOUNTS = 'orderManager/setFinalSelectedDiscounts';
const SET_PRODUCERS = 'orderManager/setProducers';


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
    intentToPayConfirmed:false,
    emptyList: [],
    paymentMethod: '',
    discounts: {
        [`${Paths.CART}`]:[],
        [`${Paths.PRODUCT}`]:[]
    },
    selectedDiscounts: {
        [`${Paths.CART}`]:[],
        [`${Paths.PRODUCT}`]:[]
    },
    finalSelectedDiscounts: [],
    bannedDiscountsIds: [],
    discountMessage: {
        [`${Paths.CART}`]:'',
        [`${Paths.PRODUCT}`]:''
    },
    discountsLookedUp: {
        [`${Paths.CART}`]:false,
        [`${Paths.PRODUCT}`]:false
    },
    usedCredit: 0,
    name: '',
    email: '',
    phone: '',
    deliveryFee: 0,
    itemsObject: {},
    totalPrice: 0,
    producers: [],
}

export default function orderManager(state = initialState, action) {
    switch (action.type) {
        case SET_CART_IS_OPEN:
            return { ...state, cartIsOpen: action.cartIsOpen };
        case REMOVE_ITEM:
            const newCartRemove = state.cart.filter(item => item.id !== action.id);
            const newCartSelectedDiscounts = state.selectedDiscounts[Paths.CART].filter(discount => discount.product !== action.id);
            return { 
                ...state, 
                selectedDiscounts: {
                    ...state.selectedDiscounts,
                    [Paths.CART]: newCartSelectedDiscounts,
                },
                cart: newCartRemove,
                cartIsEmpty: newCartRemove.length === 0 
            };
        case INCREASE_QUANTITY:
            const updatedCartIncrease = state.cart.map(item => 
                item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            saveOrUpdateCartItemToLocalStorage(updatedCartIncrease);
            return { 
                ...state, 
                cart: updatedCartIncrease,
                cartIsEmpty: updatedCartIncrease.length === 0 
            };
        case DECREASE_QUANTITY:
            const cartSelectedDiscountsAfterDecrease = [...state.selectedDiscounts[Paths.CART]]; // Create a copy for immutability
            const discountToBeRemoved = cartSelectedDiscountsAfterDecrease.find(discount => isSameProduct(discount.product, action.id));
            
            // Remove the discount if needed
            if (discountToBeRemoved && state.cart.find(item => item.id === action.id)?.quantity === discountToBeRemoved.quantity) {
                const index = cartSelectedDiscountsAfterDecrease.indexOf(discountToBeRemoved);
                if (index > -1) {
                    cartSelectedDiscountsAfterDecrease.splice(index, 1); // Removes 1 item at the found index
                }
            }
            
            // Update cart items and handle quantity
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
            
            saveOrUpdateCartItemToLocalStorage(updatedCartDecrease);
            
            return { 
                ...state, 
                selectedDiscounts: {
                    ...state.selectedDiscounts,
                    [Paths.CART]: cartSelectedDiscountsAfterDecrease,
                },
                cart: updatedCartDecrease,
                cartIsEmpty: updatedCartDecrease.length === 0 
            };            
        case CLEAR_CART:
            saveOrUpdateCartItemToLocalStorage([]);
            return { 
                ...state, 
                selectedDiscounts: {
                    ...state.selectedDiscounts,
                    [Paths.CART]: [],
                },
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
                saveOrUpdateCartItemToLocalStorage(updatedCart);
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
                saveOrUpdateCartItemToLocalStorage(newCart);
                return {
                    ...state,
                    cart: newCart,
                    cartIsEmpty: newCart.length === 0
                };
            }
        case SET_CART:
            console.log('SET_CART: state cart: ', state.cart, 'action cart: ', action.cart);
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
                selectedDiscounts: {
                    ...state.selectedDiscounts,
                    [Paths.PRODUCT]: [],
                },
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
        const oneItemCheckoutAfterRemoval = state.oneItemCheckout.filter(item => item.id!== action.id);    
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
                selectedDiscounts: {
                    ...state.selectedDiscounts,
                    [Paths.PRODUCT]: oneItemCheckoutAfterRemoval,
                },
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
                if (item.id === action.id) {
                    if (item.quantity > 1) {
                        // Decrease quantity if more than 1
                        return { ...item, quantity: item.quantity - 1 };
                    } else if (action.id !== state.mainOneItemCheckoutId) {
                        // If quantity is 1 and not the main item, mark for removal
                        return null; // Mark item for removal
                    } else {
                        // If it's the main item, do not remove it
                        return { ...item, quantity: item.quantity };
                    }
                }
                return item;
            }).filter(item => item !== null); // Remove marked items
            
            // Check if the discount needs to be unselected
            const discountToUnselect = state.selectedDiscounts[Paths.PRODUCT].find(discount => 
                isSameProduct(discount.product, action.id) && discount.quantity === 1
            );
            
            const updatedSelectedDiscounts = discountToUnselect ? 
                state.selectedDiscounts[Paths.PRODUCT].filter(discount => discount !== discountToUnselect) 
                : state.selectedDiscounts[Paths.PRODUCT];
            
            // Save updated state
            return { 
                ...state, 
                oneItemCheckout: updatedOneItemCheckoutDecrease,
                selectedDiscounts: {
                    ...state.selectedDiscounts,
                    [Paths.PRODUCT]: updatedSelectedDiscounts,
                },
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
        case SET_PAYMENT_METHOD:
            return { ...state, paymentMethod: action.paymentMethod };
        case SET_DISCOUNTS:
            return { ...state, discounts: {...state.discounts, [action.parent]: action.discounts} };
        case ADD_DISCOUNT:
            return { 
               ...state,
                discounts: {...state.discounts, [action.parent]: [...state.discounts[action.parent], action.discount]}
            };
        case REMOVE_DISCOUNT:
            return { 
               ...state,
                discounts: {...state.discounts, [action.parent]: state.discounts[action.parent].filter(discount => discount.id!== action.discount.id)}
            };
        case SET_SELECTED_DISCOUNTS:
            return { 
               ...state,
                selectedDiscounts: {...state.selectedDiscounts, [action.parent]: action.selectedDiscounts}
            };
        case SELECT_DISCOUNT:
            //console.log("SELECT_DISCOUNT: ", action.discount);
            return { 
               ...state,
                selectedDiscounts: {...state.selectedDiscounts, [action.parent]: [...state.selectedDiscounts[action.parent], action.discount]}
            };
        case DESELECT_DISCOUNT:
            return { 
               ...state,
                selectedDiscounts: {...state.selectedDiscounts, [action.parent]: state.selectedDiscounts[action.parent].filter(discount => discount.id!== action.discount.id)}
            };
        case SET_DISCOUNT_MESSAGE:
            return { 
               ...state,
                discountMessage: { ...state.discountMessage, [action.parent]: action.discountMessage}
            };
        case SET_DISCOUNTS_LOOKED_UP:
            return { 
               ...state,
                discountsLookedUp: { ...state.discountsLookedUp, [action.parent]: action.discountsLookedUp}
            };
        case SET_USED_CREDIT:
            return { 
               ...state,
                usedCredit: action.usedCredit
            };
        case BAN_DISCOUNT:
            return { 
               ...state,
               bannedDiscountsIds: [...state.bannedDiscountsIds, action.discountId]
            };
        case UNBAN_DISCOUNT:
            return { 
               ...state,
               bannedDiscountsIds: state.bannedDiscountsIds.filter(discountId => discountId!== action.discountId)
            };
        case SET_NAME:
            return { 
               ...state,
                name: action.name
            };
        case SET_EMAIL:
            return { 
               ...state,
                email: action.email
            };
        case SET_PHONE:
            return { 
               ...state,
                phone: action.phone
            };
        case SET_DELIVERY_FEE:
            return { 
               ...state,
                deliveryFee: action.deliveryFee
            };
        case SET_ITEMS_OBJECT:
            return { 
               ...state,
                itemsObject: action.itemsObject
            };
        case SET_TOTAL_PRICE:
            return { 
               ...state,
                totalPrice: action.totalPrice
            };
        case SET_FINAL_SELECTED_DISCOUNTS:
            return { 
               ...state,
                finalSelectedDiscounts: action.finalSelectedDiscounts
            };
        case SET_PRODUCERS:
            return { 
               ...state,
                producers: action.producers
            };
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

export const setPaymentMethod = (paymentMethod) => ({
    type: SET_PAYMENT_METHOD,
    paymentMethod
})

export const setDiscounts = (discounts, parent) => ({
    type: SET_DISCOUNTS,
    discounts,
    parent
})

export const addDiscount = (discount, parent) => ({
    type: ADD_DISCOUNT,
    discount,
    parent
})

export const removeDiscount = (discount, parent) => ({
    type: REMOVE_DISCOUNT,
    discount,
    parent
})

export const setSelectedDiscounts = (selectedDiscounts, parent) => ({
    type: SET_SELECTED_DISCOUNTS,
    selectedDiscounts,
    parent
})

export const selectDiscount = (discount, parent) => ({
    type: SELECT_DISCOUNT,
    discount,
    parent
})

export const deselectDiscount = (discount, parent) => ({
    type: DESELECT_DISCOUNT,
    discount,
    parent
})

export const setDiscountMessage = (discountMessage, parent) => ({
    type: SET_DISCOUNT_MESSAGE,
    discountMessage,
    parent
})

export const setDiscountsLookedUp = (discountsLookedUp, parent) => ({
    type: SET_DISCOUNTS_LOOKED_UP,
    discountsLookedUp,
    parent
})

export const setUsedCredit = (usedCredit) => ({
    type: SET_USED_CREDIT,
    usedCredit
})

export const banDiscount = (discountId, parent) => ({
    type: BAN_DISCOUNT,
    discountId
})

export const unbanDiscount = (discountId, parent) => ({
    type: UNBAN_DISCOUNT,
    discountId
})

export const setName = (name) => ({
    type: SET_NAME,
    name
})

export const setEmail = (email) => ({
    type: SET_EMAIL,
    email
})

export const setPhone = (phone) => ({
    type: SET_PHONE,
    phone
})

export const setDeliveryFee = (deliveryFee) => ({
    type: SET_DELIVERY_FEE,
    deliveryFee
})

export const setItemsObject = (items) => ({
    type: SET_ITEMS_OBJECT,
    items
})

export const setTotalPrice = (totalPrice) => ({
    type: SET_TOTAL_PRICE,
    totalPrice
})

export const setFinalSelectedDiscounts = (finalSelectedDiscounts) => ({
    type: SET_FINAL_SELECTED_DISCOUNTS,
    finalSelectedDiscounts
})

export const setProducers = (producers) => ({
    type: SET_PRODUCERS,
    producers
})

