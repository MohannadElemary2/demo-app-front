import { VIEW_PROFILE, CHANGE_TIMEZONE, EDIT_PROFILE } from "./profileTypes";

const INITIAL_STATE = {};

const profileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case VIEW_PROFILE: {
      const hasOneHub = action.payload.hubs.length === 1;
      return { ...state, hasOneHub, ...action.payload };
    }
    case EDIT_PROFILE: {
      return { ...state, ...action.payload };
    }
    case CHANGE_TIMEZONE: {
      return { ...state, ...action.payload };
    }
    case "CLEAR_PROFILE": {
      return {};
    }
    case "SOCKED_CONNECTED": {
      return { ...state, isSocketConnected: true };
    }
    default: {
      return state;
    }
  }
};

export default profileReducer;
