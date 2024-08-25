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
}

export const FIREBASE_DOCUMENTS_FEILDS_NAMES = {
    PRODUCTS: {
        ID: 'id',
        NAME: 'name',
        PRICE: 'price',
        DESCRIPTION: 'description',
        IMAGE_URL: 'image-src',
        CATEGORY: 'category',
        PRODUCER_ID: 'producerId',
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
    },
    DYNAMIC_OUTPUT: {
        CONTENT: 'content',
        DESCRIPTION: 'description',
    }
}

export const FIREBASE_COLLECTIONS_QUERY_LIMIT = {
    PRODUCTS: 10,
    ANNOUNCEMENTS: 5,
    CUSTOMERS: 10,
    PRODUCERS: 10,
    REVIEWS: 5,
}

export const FIREBASE_DYNAMIC_OUTPUT_NAMES = {
    HOME_PAGE_WELCOME_SECTION_IMAGES: 'home-page-welcome-section-images',
    HOME_PAGE_WELCOME_SECTION_TITLE : 'home-page-welcome-section-title',
    HOME_PAGE_WELCOME_SECTION_CONTENT: 'home-page-welcome-section-content',
}

export const DAY_INDEX_MAP = {
    'Sun': 0,
    'Mon': 1,
    'Tue': 2,
    'Wed': 3,
    'Thu': 4,
    'Fri': 5,
    'Sat': 6,
}

export const FIREBASE_DOCUMENTS_FEILDS_UNITS = {
    PRODUCTS: {
        PRICE: 'currency',
        STOCK: 'number',
        WISHES: 'number',
        AVAILABLE: 'boolean',
        KEYWORDS: 'array',
        DAYS: 'array',
        HOURS: 'array',
        HOURS_START: 'number',
        HOURS_END: 'number',
        DAYS_SPECIFIC_HOURS_SET: 'array',
        CONTENT: 'html',
        DESCRIPTION: 'text',
        PREP_TIME_IN_MINUTES: 'min',
        PREORDER_PERIOD_IN_HOURS: 'hrs',
    }
}