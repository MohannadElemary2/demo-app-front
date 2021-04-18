import {
  GET_PRODUCTS_BUFFER_LIST,
  VIEW_SINGLE_PRODUCT_BUFFER,
  CLEAR_SINGLE_PRODUCT_BUFFER,
  CLEAR_PRODUCTS_BUFFER_LIST,
} from "./productBufferTypes";
const INITIAL_STATE = {
  productBufferList: null,
  viewedSingleProductBuffer: null,
};
const productBufferReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS_BUFFER_LIST: {
      return { ...state, productBufferList: action.payload };
    }
    case VIEW_SINGLE_PRODUCT_BUFFER: {
      return { ...state, viewedSingleProductBuffer: action.payload };
    }
    case CLEAR_SINGLE_PRODUCT_BUFFER: {
      return { ...state, viewedSingleProductBuffer: null };
    }
    case CLEAR_PRODUCTS_BUFFER_LIST: {
      return { ...state, productBufferList: null };
    }

    default: {
      return state;
    }
  }
};

export default productBufferReducer;
