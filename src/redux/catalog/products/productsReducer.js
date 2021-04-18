import {
  GET_PRODUCTS,
  GET_ALL_PRODUCTS,
  CLEAR_PRODUCT,
  VIEW_PRODUCT,
  CHECK_SYNC_PRODUCTS,
} from "./productsTypes";

const INITIAL_STATE = {
  productsList: null,
  allproductsList: null,
  syncStatus: null,
  selectedSKU:null,
  SKUs: null,
};

const productsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS: {
      return { ...state, productsList: action.payload };
    }
    case GET_ALL_PRODUCTS: {
      return { ...state, allproductsList: action.payload };
    }
    case VIEW_PRODUCT: {
      return { ...state, selectedSKU:action.payload};
    }
    case CLEAR_PRODUCT: {
      return { ...state, selectedSKU: null };
    }
    case CHECK_SYNC_PRODUCTS: {
      return { ...state, syncStatus: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default productsReducer;
