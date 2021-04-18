import {
  GET_LOCATIONS,
  CLEAR_LOCATIONS,
  CREATE_LOCATION,
  CLEAR_CREATE_LOCATION,
  VIEW_LOCATION,
  CLEAR_VIEWED_LOCATION,
} from "./locationsTypes";

const INITIAL_STATE = {
  locationsList: null,
  createdLocation: null,
  viewedLocation: null,
};

const locationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOCATIONS: {
      return { ...state, locationsList: action.payload };
    }
    case CLEAR_LOCATIONS: {
      return { ...state, locationsList: null };
    }
    case CREATE_LOCATION: {
      return { ...state, createdLocation: action.payload };
    }
    case CLEAR_CREATE_LOCATION: {
      return { ...state, createdLocation: null };
    }
    case CLEAR_VIEWED_LOCATION: {
      return { ...state, viewedLocation: null };
    }
    case VIEW_LOCATION: {
      return { ...state, viewedLocation: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default locationsReducer;
