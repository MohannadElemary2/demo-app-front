import {
  CLEAR_IMPORTING_LOCATIONS,
  CLEAR_IMPORTING_BUFFER,
  GET_IMPORTING_HUBS,
  SET_LOCATIONS_FILE_SERVER_ERROR,
  SET_BUFFER_FILE_SERVER_ERROR,
} from "./importingTypes";

const INITIAL_STATE = {
  importingHubs: null,
  locationFileServerErrors: null,
  bufferFileServerErrors: null,
};

const importingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_IMPORTING_HUBS: {
      return { ...state, importingHubs: action.payload };
    }
    case SET_LOCATIONS_FILE_SERVER_ERROR: {
      return { ...state, locationFileServerErrors: action.payload };
    }
    case SET_BUFFER_FILE_SERVER_ERROR: {
      return { ...state, bufferFileServerErrors: action.payload };
    }
    case CLEAR_IMPORTING_LOCATIONS: {
      return { ...state, locationFileServerErrors: null };
    }
    case CLEAR_IMPORTING_BUFFER: {
      return { ...state, bufferFileServerErrors: null };
    }

    default: {
      return state;
    }
  }
};
export default importingReducer;
