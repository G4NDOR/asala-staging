// redux/ducks/appVars.js

const TRIGGER_LOADING = 'appVars/triggerLoading';
const RESET_LOADING = 'appVars/resetLoading';
const SET_SCREEN_WIDTH_IS_LESS_THAN_480 = 'appVars/setScreenWidthIsLessThan480';


const initialState = {
    loading: true,
    screenWidthIsLessThan480:false,
};

export default function appVars(state = initialState, action) {
    switch (action.type) {
        case TRIGGER_LOADING:
            return { 
                ...state, 
                loading:true,
            };
        case RESET_LOADING:
            return { 
                ...state, 
                loading:false,
            };
        case SET_SCREEN_WIDTH_IS_LESS_THAN_480:
            return { 
                ...state, 
                screenWidthIsLessThan480:action.state,
            };            
        default:
            return state;
    }
}


export const triggerLoading = () => ({
    type: TRIGGER_LOADING,     
});

export const resetLoading = () => ({
    type: RESET_LOADING,              
});

export const setScreenWidthIsLessThan480 = (state) => ({
    type: SET_SCREEN_WIDTH_IS_LESS_THAN_480,    
    state:state          
});
