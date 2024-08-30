import { combineReducers, createStore } from "redux";
import admin from "./ducks/admin";
import appVars from "./ducks/appVars";
import homePageManager from "./ducks/homePageManager";
import orderManager from "./ducks/orderManager";
import productPageManager from "./ducks/productPageManager";

const reducer = combineReducers({
    orderManager: orderManager,
    productPageManager: productPageManager,
    homePageManager: homePageManager,
    appVars:appVars,
    admin:admin,
})


const store = createStore(reducer)
export default store;