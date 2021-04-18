import {
  ADD_LOADER,
  REMOVE_LOADER,
  ADD_REQUEST,
  REMOVE_REQUEST,
  FINISH_LOADING,
  START_LOADING,
} from "./loadersTypes";

export const addLoader = (loaderKey) => (dispatch) => {
  const loader = {};
  loader[loaderKey] = true;
  dispatch({
    type: ADD_LOADER,
    payload: loader,
  });
};
export const removeLoader = (loaderKey) => (dispatch) => {
  dispatch({
    type: REMOVE_LOADER,
    payload: loaderKey,
  });
};

export const addRequest = (request) => (dispatch) => {
  dispatch({
    type: ADD_REQUEST,
    payload: request,
  });
};
export const removeRequest = (request) => (dispatch) => {
  dispatch({
    type: REMOVE_REQUEST,
    payload: request,
  });
};

export const startLoading = (request) => (dispatch) => {
  dispatch({
    type: START_LOADING,
    payload: request,
  });
};
export const finishLoading = (request) => (dispatch) => {
  dispatch({
    type: FINISH_LOADING,
    payload: request,
  });
};
