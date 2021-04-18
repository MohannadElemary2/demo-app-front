import {
  GET_DISPATCHING_ORDERS_LIST_STATIONS,
  GET_DISPATCHING_FILTER_HUBS,
  UPDATE_OCCUPATION,
  CLEAR_DISPATCHING_ORDERS_LIST_STATIONS,
} from "./dispatchingOrdersTypes";
const INITIAL_STATE = {
  dispatchingOrdersListStations: null,
  dispatchingFilterHubs: null,
};
const dispatchingOrdersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DISPATCHING_ORDERS_LIST_STATIONS: {
      return { ...state, dispatchingOrdersListStations: action.payload };
    }
    case CLEAR_DISPATCHING_ORDERS_LIST_STATIONS: {
      return { ...state, dispatchingOrdersListStations: null };
    }
    case GET_DISPATCHING_FILTER_HUBS: {
      return { ...state, dispatchingFilterHubs: action.payload };
    }

    case UPDATE_OCCUPATION: {
      const updatedDispatchingOrdersListStations = { ...state.dispatchingOrdersListStations };

      updatedDispatchingOrdersListStations.data.forEach((ele) => {
        if (ele.id === action.payload.id) {
          ele.is_available = action.payload.is_available;
          ele.dispatcher = action.payload.dispatcher;
        }
      });

      return { ...state, dispatchingOrdersListStations: updatedDispatchingOrdersListStations };
    }

    default: {
      return state;
    }
  }
};

export default dispatchingOrdersReducer;
