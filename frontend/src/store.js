import { configureStore } from '@reduxjs/toolkit';
import { productReducers, productDetailReducer  } from './reducers/productReducers'
import { authReducer, userReducer, forgotPasswordReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';

const initialState = {
  cart: {
      cartItems: localStorage.getItem('cartItems') 
        ? JSON.parse(localStorage.getItem('cartItems'))
        : {} 
  }
};

export default configureStore({
  reducer: {
    products: productReducers,
    productDetails: productDetailReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer
  },
  preloadedState: initialState
});

