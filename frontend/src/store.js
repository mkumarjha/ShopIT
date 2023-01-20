import { configureStore } from '@reduxjs/toolkit';
import { productReducers, productDetailReducer  } from './reducers/productReducers'
import { authReducer, userReducer } from './reducers/userReducers';


export default configureStore({
  reducer: {
    products: productReducers,
    productDetails: productDetailReducer,
    auth: authReducer,
    user: userReducer
  },
});