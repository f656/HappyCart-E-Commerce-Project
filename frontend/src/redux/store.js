import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice.js"
import productReducer from "./Slices/productSlice.js";
import cartReducer from "./Slices/cartSlice.js";
import checkoutReducer from "./Slices/checkoutSlice.js";
import orderReducer from "./Slices/orderSlice.js";
import adminReducer from "./Slices/adminSlice.js";
import adminProductReducer from "./Slices/adminProductSlice.js";
import adminOrderReducer from "./Slices/adminOrderSlice.js";
import subscriberReducer from "./Slices/subscriberSlice.js"
const store = configureStore({
    reducer: {
        auth:authReducer,
        products:productReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
        orders:orderReducer,
        admin:adminReducer,
        adminProducts:adminProductReducer,
        adminOrders:adminOrderReducer,
         subscriber: subscriberReducer,

    },
})

export default store;