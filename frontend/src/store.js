import { configureStore } from '@reduxjs/toolkit';
import { productReducers, productDetailReducer  } from './reducers/productReducers'
import { authReducer } from './reducers/userReducers';


export default configureStore({
  reducer: {
    products: productReducers,
    productDetails: productDetailReducer,
    auth: authReducer
  },
});