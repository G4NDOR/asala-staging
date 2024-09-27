//constants

export const TIMESTAMP = {
    SERVER: 'serverTimestamp',
};

export const FIREBASE_DEFAULT_VALUES = {
    SERVER_TIMESTAMP: 'serverTimestamp',
}

export const FIREBASE_CLLECTIONS_NAMES = {
    PRODUCTS: 'products',
    ANNOUNCEMENTS: 'announcements',
    CUSTOMERS: 'customers',
    PRODUCERS: 'producers',
    REVIEWS: 'reviews',
    DYNAMIC_OUTPUT: 'dynamic-output',
    CARTS: 'carts',
    DISCOUNTS: 'discounts',
    DELIVERERS: 'deliverers',
    RANGES: 'ranges',
}

export const FIREBASE_DOCUMENTS_FEILDS_NAMES = {
    PRODUCTS: {
        ID: 'id',
        NAME: 'name',
        PRICE: 'price',
        DESCRIPTION: 'description',
        IMAGE_URL: 'image-src',
        CATEGORY: 'category',
        STOCK: 'stock',
        AVAILABLE: 'available',
        KEYWORDS: 'keywords',
        DAYS: 'days',
        HOURS: 'hours',
        HOURS_START: 'start',
        HOURS_END: 'end',
        DAYS_SPECIFIC_HOURS_SET: 'day-specific-hours-set',
        WISHES: 'wishes',
        PREORDER_PERIOD_IN_HOURS: 'preorder-period-in-hours',
        PREORDER_SET: 'preorder-set',
        PREP_TIME_IN_MINUTES: 'prep-time-in-minutes',
        STATUS: 'status',
        IN_STOCK: 'in-stock',
        DISCOUNTS: 'discounts',
        MATCHING_PRODUCTS: 'matching-products',
        PRODUCER: 'producer',
        FULL_NAME: 'full-name',
        QUANTITY: 'quantity',
        SCHEDULE: 'schedule',
        RANGE: 'range',
        VARIANTS: 'variants',
        OPTIONAL_ADDITIONS: 'optional-additions',
    },
    DYNAMIC_OUTPUT: {
        CONTENT: 'content',
        DESCRIPTION: 'description',
    },
    CUSTOMERS: {
        IP_ADDRESS: 'ip-address',
        ADDRESSES: 'address-list',
    },
    TIMESTAMP: 'time-created',
    UPDATED_AT: 'updated-at',
    ID: 'id',
    IS_DEFAULT_VALUE: 'is-default-value',
    CARTS: {
        IS_DEFAULT_VALUE: 'is-default-value',
        ITEMS: 'items',
        STATUS: 'status',
        TIMESTAMP: 'time-created',
        UPDATED_AT: 'updated-at',
    },
    DISCOUNTS: {
        ID: 'id',
        NAME: 'name',
        TYPE: 'type',
        VALUE: 'value',
        EXPIRATION: 'expiration',
        ACTIVE: 'active',
        PRODUCT: 'product',
        CUSTOMER: 'customer',
        TIMESTAMP: 'time-created',
        APPLY_ON_SINGLE_ITEM: 'apply-on-single-item',
        QUANTITY: 'quantity',
        MAX_USES: 'max-uses',
        DESCRIPTION: 'description',
        IS_DEFAULT_VALUE: 'is-default-value',
        OPPOSING_DISCOUNTS: 'opposing-discounts',
    },
    RANGES:{
        DELIVERER: 'deliverer',
    },
    DELIVERERS: {
        COMMISSION: 'commission',
        SPEED_IN_KMPH: 'speed-in-kmph',
    }
}

export const FIREBASE_COLLECTIONS_QUERY_LIMIT = {
    PRODUCTS: 10,
    ANNOUNCEMENTS: 5,
    CUSTOMERS: 1,
    PRODUCERS: 10,
    REVIEWS: 5,
}

export const FIREBASE_DYNAMIC_OUTPUT_NAMES = {
    HOME_PAGE_WELCOME_SECTION_IMAGES: 'home-page-welcome-section-images',
    HOME_PAGE_WELCOME_SECTION_TITLE : 'home-page-welcome-section-title',
    HOME_PAGE_WELCOME_SECTION_CONTENT: 'home-page-welcome-section-content',
}

export const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

export const FIREBASE_DOCUMENTS_FEILDS_UNITS = {
    PRODUCTS: {
        PREP_TIME_IN_MINUTES: 'min',
        PREORDER_PERIOD_IN_HOURS: 'hrs',
        STATUS: {
            present: 'present',
            future: 'future',
        },
        DISCOUNTS: {
            TYPE: {
                FIXED: 'fixed',
                PERCENTAGE: 'percentage',
            },
        },
        RANGES: {
            GENERAL: 'general',
        }
    },
    DISCOUNTS: {
        TYPE: {
            FIXED: 'fixed',
            PERCENTAGE: 'percentage',
        },
        CUSTOMER: {
            ALL: 'all',
            //or customer id
        },
        PRODUCT: {
            ALL: 'all',
        },
    },   
    RANGES: {
        TYPE: {
            CIRCLE: 'circle',
            RECTANGLE:'rectangle',
        }
    } 
}

//feild value of a feild
export const FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES = {
    PRODUCTS: {
        DISCOUNTS: {
            TYPE: 'type',
            VALUE: 'value',
            DESCRIPTION: 'description',
            ACTIVE: 'active',
            QUANTITY: 'quantity',
            APPLY_ON_SINGLE_ITEM: 'apply-on-single-item',
            
        },
        PRODUCER: {
            ID: 'id',
            NAME: 'name',
            LOCATION: 'location',
        },
        ADDRESS_LIST: {
            GEOPOINT: 'geopoint',
            STRING: 'string',
        },
    },
    CUSTOMERS: {
        ADDRESSES: {
            GEOPOINT: 'geopoint',
            STRING:'string',
        },
    },
    CARTS: {
        ITEMS: {
            ID: 'id',
            QUANTITY: 'quantity',
        },
    },
    DELIVERERS: {
        COMMISSION: {
            TYPE: 'type',
            VALUE: 'value',
        }
    }
}

export const REAL_TIME_DATABASE_COLLECTIONS_NAMES = {
    ORDERS: 'orders',
}

export const FIREBASE_ADMIN_VARS = {
    PATH: 'admin/vars',
    PLACING_ORDER_ALLOWED: 'placing-order-allowed',
}

export const DOMAIN = {
    PRODUCTION: 'https://asala-staging.web.app/',
    DEVELOPEMENT:'http://127.0.0.1:5000/',
    LOCAL: 'http://localhost:3000/',
}

export const PLACING_ORDER = {
    STATUS: {
        REJECTED: 'rejected',
        ACCEPTED: 'accepted',
    },
    REASONS: {
        PRODUCT_NOT_FOUND: 'product-not-found',
        UNAVAILABLE: 'unavailable',
        IS_FUTURE_PRODUCT: 'is-future-product',
        NOT_OPERATING_TIME: 'not-operating-time',
        OVER_PREORDER_PERIOD: 'over-preorder-period',
        OUT_OF_STOCK: 'out-of-stock',
        INSUFFICIENT_STOCK: 'insufficient-stock',
        RANGE_NOT_FOUND: 'range-not-found',
        OUT_OF_RANGE: 'out-of-range',
        VARIANTS_NOT_FOUND: 'variants-not-found',
        OPTIONAL_ADDITIONS_NOT_FOUND: 'optional-additions-not-found',
        ONLINE_PAYMENT_FAILED: 'online-payment-failed',
        PAYMENT_LINK_GENERATION_FAILED: 'payment-link-generation-failed',
    }
}

