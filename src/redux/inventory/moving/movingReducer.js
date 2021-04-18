import {
  CLEAR_SKU,
  GET_LOCATIONS_OF_HUB,
  VIEW_SKU,
  SELECT_LOCATION,
  CLEAR_SELECTED_HUB_LOCATIONS,
  SELECT_HUB_LOCATION,
  GET_MOVING_HUBS,
  GET_SKU_TABLE_DATA,
  CLEAR_SELECTED_HUB,
  CACHE_SKU,
} from "./movingTypes";

const INITIAL_STATE = {
  movingHubs: null,
  selectedHub: null,
  selectedHubLocations: [],
  selectedLocation: null,
  SKUs: [],
  selectedSKU: null,
  selectedSKUTableData: null,
};
const movingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOCATIONS_OF_HUB: {
      return { ...state, selectedHubLocations: action.payload };
    }
    case CLEAR_SELECTED_HUB_LOCATIONS: {
      return { ...state, selectedHubLocations: [] };
    }
    case VIEW_SKU: {
      return { ...state, selectedSKU: action.payload };
    }
    case CLEAR_SKU: {
      return { ...state, selectedSKU: null, selectedSKUTableData: null, SKUs: [] };
    }
    case SELECT_LOCATION: {
      return { ...state, selectedLocation: action.payload };
    }
    case SELECT_HUB_LOCATION: {
      return { ...state, selectedHub: action.payload };
    }
    case CACHE_SKU: {
      return { ...state, SKUs: [...state.SKUs, ...action.payload] };
    }

    case GET_MOVING_HUBS: {
      return { ...state, movingHubs: action.payload };
    }
    case GET_SKU_TABLE_DATA: {
      return { ...state, selectedSKUTableData: action.payload };
    }
    case CLEAR_SELECTED_HUB: {
      return { ...state, selectedHub: null };
    }
    default: {
      return state;
    }
  }
};

export default movingReducer;
