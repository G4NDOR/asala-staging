
const SET_SELECTED_COLLECTION = 'admin/setSelectedCollection';
const SET_PASSWORD = 'admin/setPassword';
const SET_ACCESS_GRANTED = 'admin/setAccessGranted';


const initialState = {
    selectedCollection: null,
    password: null,
    accessGranted: false,
};

export default function admin(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_COLLECTION:
            return { 
               ...state,
                selectedCollection: action.selectedCollection
            };
        case SET_PASSWORD:
            return { 
               ...state,
                password: action.password
            };
        case SET_ACCESS_GRANTED:
            return { 
               ...state,
               accessGranted: action.accessGranted
            };

        // Add other actions here as needed
        default:
            return state;
    }
}

export const setSelectedCollection = (selectedCollection) => ({
    type: SET_SELECTED_COLLECTION,
    selectedCollection: selectedCollection
});

export const setPassword = (password) => ({
    type: SET_PASSWORD,
    password: password
});

export const setAccessGranted = (accessGranted) => ({
    type: SET_ACCESS_GRANTED,
    accessGranted: accessGranted
});