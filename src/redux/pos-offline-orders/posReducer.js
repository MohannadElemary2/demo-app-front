import {
    GET_SOLD_ITEMS,
    CLEAR_SOLD_ITEMS,
    GET_REFUND_ITEMS,
    CLEAR_REFUND_ITEMS,
    GET_HUBS
  } from "./posTypes";
  const INITIAL_STATE = {
    soldItemsList: null,
    refundItemsList: null,
    hubsList:null
  };
  const posReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GET_SOLD_ITEMS: {
        return { ...state, soldItemsList: action.payload };
      }
     case CLEAR_SOLD_ITEMS:{
      return { ...state, soldItemsList: null };
       }
       case GET_REFUND_ITEMS: {
        return { ...state, refundItemsList: action.payload };
      }
     case CLEAR_REFUND_ITEMS:{
      return { ...state, refundItemsList: null };
       }
       case GET_HUBS: {
        return { ...state, hubsList: action.payload };
      }
      default: {
        return state;
      }
    }
  };

  export default posReducer; 