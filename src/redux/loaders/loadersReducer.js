import {
  ADD_LOADER,
  REMOVE_LOADER,
  ADD_REQUEST,
  REMOVE_REQUEST,
  START_LOADING,
  FINISH_LOADING,
} from "./loadersTypes";

const INITIAL_STATE = {
  loading: 0,
  totalRequests: 0,
  totalRequestsArr: [],
};

const loadersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_LOADER: {
      return { ...state, ...action.payload };
    }
    case REMOVE_LOADER: {
      const updatedState = { ...state };
      delete updatedState[action.payload];
      return { ...updatedState };
    }
    case ADD_REQUEST: {
      const { totalRequestsArr } = state;
      totalRequestsArr.push(action.payload);
      return { ...state, totalRequestsArr };
    }
    case REMOVE_REQUEST: {
      let { totalRequestsArr } = state;
      totalRequestsArr = totalRequestsArr.filter((req) => req !== action.payload);
      return { ...state, totalRequestsArr };
    }
    case START_LOADING: {
      let { totalRequests } = state;
      totalRequests += 1;
      return { ...state, totalRequests };
    }
    case FINISH_LOADING: {
      let { loading } = state;
      loading += 1;
      return { ...state, loading };
    }
    default:
      return state;
  }
};

export default loadersReducer;
