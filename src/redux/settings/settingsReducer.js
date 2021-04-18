import {
  GET_POS_INTEGRATIONS,
  GET_SETTINGS,
  SHOW_POS_INTEGRATIONS,
  UPDATE_SETTINGS,
} from "./settingsTypes";

const INITIAL_STATE = {};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SETTINGS: {
      return { ...state, ...action.payload };
    }
    case UPDATE_SETTINGS: {
      return { ...state, ...action.payload };
    }
    case GET_POS_INTEGRATIONS: {
      return { ...state, pos: action.payload };
    }
    case SHOW_POS_INTEGRATIONS: {
      return { ...state, singlePos: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default settingsReducer;
