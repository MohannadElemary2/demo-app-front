import {
  ADD_SERVER_ERROR,
  REMOVE_SERVER_ERROR,
  CLEAR_SERVER_ERRORS,
  CHANGE_DOMAIN_CHECKED,
  CHANGE_REMOVE_QUANTITY_ALERT,
} from "./serverErrorsTypes";

export const addServerError = (error) => (dispatch) => {
  dispatch({
    type: ADD_SERVER_ERROR,
    payload: error,
  });
};

export const removeServerError = (errorKey) => (dispatch) => {
  const error = {};
  error[errorKey] = null;
  dispatch({
    type: REMOVE_SERVER_ERROR,
    payload: error,
  });
};
export const clearServerErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_SERVER_ERRORS,
  });
};

export const setDomainChecked = (bool) => (dispatch) => {
  dispatch({
    type: CHANGE_DOMAIN_CHECKED,
    payload: { domainChecked: bool },
  });
};

export const setRemoveQuantityAlert = (bool) => (dispatch) => {
  dispatch({
    type: CHANGE_REMOVE_QUANTITY_ALERT,
    payload: { showRemoveQuantityAlert: bool },
  });
};
