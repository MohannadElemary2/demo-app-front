import { getLocalItem } from "../../utility/commonFunctions";
import { LOGIN, LOG_OUT, CHECK_DOMAIN_EXISTANCE } from "./AuthTypes";

const INITIAL_STATE = getLocalItem("auth") || { domainExist: false };

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN: {
      return { ...state, ...action.payload };
    }
    case LOG_OUT: {
      return {};
    }
    case CHECK_DOMAIN_EXISTANCE: {
      return { ...state, domainExist: true };
    }

    default: {
      return state;
    }
  }
};

export default authReducer;
