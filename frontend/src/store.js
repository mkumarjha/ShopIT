import { configureStore } from '@reduxjs/toolkit';
import { productReducers, productDetailReducer, newProductReducer, newReviewReducer, productReducer  } from './reducers/productReducers'
import { authReducer, userReducer, forgotPasswordReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';
import { newOrderReducer, myOrdersReducer, orderDetailsReducer } from './reducers/orderReducers';

const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') 
          ? JSON.parse(localStorage.getItem('cartItems'))
          : [],
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    }
};

export default configureStore({
  reducer: {
    products: productReducers,
    productDetails: productDetailReducer,
    newProduct: newProductReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    product: productReducer
  },
  preloadedState: initialState
});

