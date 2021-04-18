import { SCAN_CART } from "./pickerTypes";

const INITIAL_STATE = {
  viewedScanedCart: null,
};
const pickerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SCAN_CART: {
      return { ...state, viewedscanedCart: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default pickerReducer;
