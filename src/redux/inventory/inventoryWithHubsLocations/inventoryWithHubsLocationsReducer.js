import {
  GET_INVENTORY_WITH_HUB_LOCATIONS,
  CLEAR_INVENTORY_WITH_HUB_LOCATIONS,
  INVENTORY_WITH_HUB_LOCATIONS_STATISTICS,
  CLEAR_SKU,
  VIEW_SKU,
  GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY,
  CLEAR_GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY,
  CLEAR_INVENTORY_WITH_HUB_LOCATIONS_STATISTICS,
} from "./inventoryWithHubsLocationsTypes";
const INITIAL_STATE = {
  inventoryWithHubsLocationsList: null,
  inventoryWithHubsLocationStatistics: null,
  inventoryWithHubsLocationsListAddQuantity: null,
  selectedSKU: null,
};
const InventoryWithHubsLocationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_INVENTORY_WITH_HUB_LOCATIONS: {
      return { ...state, inventoryWithHubsLocationsList: action.payload };
    }
    case GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY: {
      return { ...state, inventoryWithHubsLocationsListAddQuantity: action.payload };
    }
    case INVENTORY_WITH_HUB_LOCATIONS_STATISTICS: {
      return { ...state, inventoryWithHubsLocationStatistics: action.payload };
    }
    case CLEAR_INVENTORY_WITH_HUB_LOCATIONS_STATISTICS: {
      return { ...state, inventoryWithHubsLocationStatistics: null };
    }
    case CLEAR_INVENTORY_WITH_HUB_LOCATIONS: {
      return { ...state, inventoryWithHubsLocationsList: null };
    }
    case CLEAR_GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY: {
      return { ...state, inventoryWithHubsLocationsListAddQuantity: null };
    }
    case VIEW_SKU: {
      return { ...state, selectedSKU: action.payload };
    }
    case CLEAR_SKU: {
      return { ...state, selectedSKU: null };
    }
    default: {
      return state;
    }
  }
};

export default InventoryWithHubsLocationsReducer;
