import { CLEAR_VIEWED_CART, GET_CARTS, GET_CARTS_HUBS, VIEW_CARTS_HUBS } from "./cartsTypes";
const INITIAL_STATE = {
  cartsList: null,
  cartsHubs: null,
  viewedCart: null,
};
const cartsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CARTS: {
      return { ...state, cartsList: action.payload };
    }
    case GET_CARTS_HUBS: {
      return { ...state, cartsHubs: action.payload };
    }
    case VIEW_CARTS_HUBS: {
      return { ...state, viewedCart: action.payload };
    }
    case CLEAR_VIEWED_CART: {
      return { ...state, viewedCart: null };
    }

    default: {
      return state;
    }
  }
};

export default cartsReducer;
