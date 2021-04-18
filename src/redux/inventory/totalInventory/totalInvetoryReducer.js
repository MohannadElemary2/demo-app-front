import { GET_TOTAL_INVENTORY } from "./totalInventoryTypes";
const INITIAL_STATE = {
  totalInventoryList: null,
};
const totalInventoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TOTAL_INVENTORY: {
      return { ...state, totalInventoryList: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default totalInventoryReducer;
