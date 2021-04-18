import { axiosInstance } from "./../../network/apis";
import { addLoader, removeLoader } from "./../loaders/loadersActions";
import { store } from "../storeConfig/store";
import toasters from "../../utility/toasters";
import { history } from "./../../history";
import { VIEW_USER, CLEAR_USER, LIST_USERS, DELETE_USER } from "./usersTypes";
import { listValues } from "../../utility/constants";

export const createUser = (body) => async (dispatch) => {
  store.dispatch(addLoader("createUser"));
  try {
    await axiosInstance.post("/api/v1/client/users", body, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("createUser"));
    toasters.Success("Your changes have been saved.");

    setTimeout(() => {
      history.push("/users");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("createUser"));
  }
};

export const viewUser = (userID) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/users/${userID}`, {
    handlerEnabled: true,
  });
  dispatch({
    type: VIEW_USER,
    payload: res.data.data,
  });
};

export const editUser = (userID, user) => async (dispatch) => {
  store.dispatch(addLoader("editUser"));
  try {
    await axiosInstance.put(`/api/v1/client/users/${userID}`, user, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("editUser"));
    toasters.Success("Your changes have been saved.");

    setTimeout(() => {
      history.push("/users");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("editUser"));
  }
};

export const clearUser = () => async (dispatch) => {
  dispatch({
    type: CLEAR_USER,
  });
};

export const listUsers = (params) => async (dispatch) => {
  store.dispatch(addLoader("listUsers"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/users?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: LIST_USERS,
      payload: res.data,
    });
    store.dispatch(removeLoader("listUsers"));
  } catch (err) {
    store.dispatch(removeLoader("listUsers"));
  }
};

export const deleteUser = (userID) => async (dispatch) => {
  store.dispatch(addLoader("deleteUser"));
  try {
    await axiosInstance.delete(`/api/v1/client/users/${userID}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: DELETE_USER,
      payload: userID,
    });
    store.dispatch(removeLoader("deleteUser"));
    toasters.Success("The user has been deleted successfully");
    store.dispatch(listUsers({ page: 1 }));
  } catch (err) {
    store.dispatch(removeLoader("deleteUser"));
  }
};
