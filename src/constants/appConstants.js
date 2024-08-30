const CONSTANTS = {
    Z_INDEXES:{
        CART: 1000,
        HOME_BUTTON: 1000,
        LOADING_SCREEN: 9999,
        SEARCH_BAR: 1000,
        SWIPE_CONFIRMATION: 1002
    },
    LOCAL_STORAGE: {
        KEYS: {
            CART_KEY: 'cart',
            WISHLIST_KEY: 'wishList',
            ADDRESS_LIST_KEY: 'addressList',
            ORDER_KEY: 'order',
            USER_ID_KEY: 'user-id'
        }
    },
    CHARGE_INFO_TYPES:{
        SUBTOTAL: 'subtotal',
        DISCOUNT: 'discount',
        DELIVERY: 'delivery',
        TAX: 'tax',
        TOTAL: 'total',
        SAVINGS:'savings'
    },
    PAYMENT_METHODS: {
        CREDIT_CARD: 'Credit Card',
        PAYPAL: 'PayPal',
        GOOGLE_PAY: 'Google Pay',
        APPLE_PAY: 'Apple Pay',
        ONLINE: 'Online',
        CASH: 'Cash'
    },
};

export default CONSTANTS;