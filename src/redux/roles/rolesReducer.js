import {
  GET_PERMISSIONS,
  GET_ROLES,
  VIEW_ROLE,
  CLEAR_VIEWED_ROLE,
  GET_ROLES_DDL,
} from "./rolesTypes";

const INITIAL_STATE = {
  rolesList: null,
  viewedRole: null,
  rolesDDL: { data: [], meta: {} },
};

const rolesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PERMISSIONS: {
      return { ...state, ...action.payload };
    }
    case VIEW_ROLE: {
      return { ...state, ...action.payload };
    }
    case CLEAR_VIEWED_ROLE: {
      return { ...state, ...action.payload };
    }
    case GET_ROLES: {
      return { ...state, rolesList: action.payload };
    }
    case GET_ROLES_DDL: {
      const updatedDDL = state.rolesDDL;
      updatedDDL.data = [...updatedDDL.data, ...action.payload.data];
      updatedDDL.meta = action.payload.meta;
      return { ...state, rolesDDL: updatedDDL };
    }
    default: {
      return state;
    }
  }
};

export default rolesReducer;
