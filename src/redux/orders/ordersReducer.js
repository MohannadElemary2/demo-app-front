import {
  GET_ONLINE_ORDERS,
  GET_ONLINE_ORDER_DETAILS,
  CLEAR_ONLINE_ORDER_DETAILS,
  GET_SHIPPED_ORDERS,
  GET_UNRESOLVED_ORDERS,
} from "./ordersTypes";
const INITIAL_STATE = {
  onlineOrdersList: null,
  onlineOrderDetails: null,
  shippedOrders: null,
  unresolvedOrders: null,
  offlineOrders: null,
};
const ordersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ONLINE_ORDERS: {
      return { ...state, onlineOrdersList: action.payload };
    }
    case GET_ONLINE_ORDER_DETAILS: {
      return { ...state, onlineOrderDetails: action.payload };
    }
    case GET_SHIPPED_ORDERS: {
      return { ...state, shippedOrders: action.payload };
    }
    case CLEAR_ONLINE_ORDER_DETAILS: {
      return { ...state, onlineOrderDetails: null };
    }
    case GET_UNRESOLVED_ORDERS: {
      return { ...state, unresolvedOrders: action.payload };
    }
    case "GET_OFFLINE_ORDERS": {
      return { ...state, offlineOrders: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default ordersReducer;
