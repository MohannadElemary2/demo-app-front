import { GET_INVENTORY_WITH_HUBS } from "./inventoryWithHubsTypes";
const INITIAL_STATE = {
  inventoryWithHubsList: null,
};
const InventoryWithHubsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_INVENTORY_WITH_HUBS: {
      return { ...state, inventoryWithHubsList: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default InventoryWithHubsReducer;
