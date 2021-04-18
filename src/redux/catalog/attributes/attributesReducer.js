import {
  GET_ATTRIBUTES,
  VIEW_ATTRIBUTE,
  CLEAR_ATTRIBUTE,
  CHECK_SYNC_ATTRIBUTES,
} from "./attributesTypes";

const INITIAL_STATE = {
  attributesList: null,
  viewedAttribute: null,
  syncStatus: null,
};

const attributesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ATTRIBUTES: {
      return { ...state, attributesList: action.payload };
    }
    case VIEW_ATTRIBUTE: {
      return { ...state, ...action.payload };
    }
    case CLEAR_ATTRIBUTE: {
      return { ...state, viewedAttribute: null };
    }
    case CHECK_SYNC_ATTRIBUTES: {
      return { ...state, syncStatus: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default attributesReducer;
