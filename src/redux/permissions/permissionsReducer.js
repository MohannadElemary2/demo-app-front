import { getLocalItem } from "../../utility/commonFunctions";
import { SET_ABILITY_RULES, SYNC_PERMISSIONS } from "./permissionsTypes";

const INITIAL_STATE = getLocalItem("permissions") || {
  is_super: 0,
  roles: [],
  hubs: [],
  abilityRules: [],
};

const permissionsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SYNC_PERMISSIONS:
      return { ...state, ...action.payload };
    case SET_ABILITY_RULES:
      return { ...state, abilityRules: action.payload };

    default:
      return state;
  }
};

export default permissionsReducer;
