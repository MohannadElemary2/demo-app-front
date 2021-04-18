import { CLEAR_USER, VIEW_USER, LIST_USERS, DELETE_USER } from "./usersTypes";

const INITIAL_STATE = {
  viewedUser: null,
  usersList: null,
  lastDeletedUserId: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case VIEW_USER: {
      return { ...state, viewedUser: action.payload };
    }
    case CLEAR_USER: {
      return { ...state, viewedUser: null };
    }
    case LIST_USERS: {
      return { ...state, usersList: action.payload };
    }
    case DELETE_USER: {
      return { ...state, lastDeletedUserId: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
