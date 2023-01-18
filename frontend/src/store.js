import { configureStore } from '@reduxjs/toolkit';
import { productReducers, productDetailReducer  } from './reducers/productReducers'

export default configureStore({
  reducer: {
    products: productReducers,
    productDetails: productDetailReducer
  },
});