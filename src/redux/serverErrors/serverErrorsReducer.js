import {
  ADD_SERVER_ERROR,
  REMOVE_SERVER_ERROR,
  CHANGE_DOMAIN_CHECKED,
  CLEAR_SERVER_ERRORS,
  CHANGE_REMOVE_QUANTITY_ALERT,
} from "./serverErrorsTypes";

const INITIAL_STATE = { domainChecked: false };

const errorsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_SERVER_ERROR:
      return { ...state, ...action.payload };
    case CLEAR_SERVER_ERRORS:
      return {};
    case REMOVE_SERVER_ERROR:
      return { ...state, ...action.payload };
    case CHANGE_DOMAIN_CHECKED:
      return { ...state, ...action.payload };
    case CHANGE_REMOVE_QUANTITY_ALERT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default errorsReducer;
