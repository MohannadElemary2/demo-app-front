import {
  CLEAR_VIEWED_DISPATCHING_STATION,
  VIEW_DISPATCHING_STATION,
  LIST_STATIONS,
  LIST_STATIONS_CARTS,
  CLEAR_LIST_STATIONS_CARTS,
  VIEW_STATION_CART_DETAILS,
  VIEW_BATCH_ORDER_DETAILS,
  CLEAR_VIEW_STATION_CART_DETAILS,
  SHOW_STATION_BATCH_ORDER_DETAILS,
} from "./dispatchingStationsTypes";
const INITIAL_STATE = {
  viewedDispatchingStation: null,
  stationsList: null,
  stationCartsList: null,
  viewedStationCartDetails: null,
  viewedStationBatchOrderDetails: null,
};
const dispatchingStationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case VIEW_DISPATCHING_STATION: {
      return { ...state, viewedDispatchingStation: action.payload };
    }
    case CLEAR_VIEWED_DISPATCHING_STATION: {
      return { ...state, viewedDispatchingStation: null };
    }
    case LIST_STATIONS: {
      return { ...state, stationsList: action.payload };
    }

    case LIST_STATIONS_CARTS: {
      return { ...state, stationCartsList: action.payload };
    }
    case CLEAR_LIST_STATIONS_CARTS: {
      return { ...state, stationCartsList: null };
    }
    case VIEW_STATION_CART_DETAILS: {
      return { ...state, viewedStationCartDetails: action.payload };
    }
    case CLEAR_VIEW_STATION_CART_DETAILS: {
      return { ...state, viewedStationCartDetails: null };
    }
    case SHOW_STATION_BATCH_ORDER_DETAILS: {
      return { ...state, viewedStationBatchOrderDetails: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default dispatchingStationsReducer;
