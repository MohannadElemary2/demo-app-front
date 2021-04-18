import { axiosInstance } from "../../network/apis";
import { GET_PERMISSIONS, GET_ROLES, VIEW_ROLE, CLEAR_VIEWED_ROLE } from "./rolesTypes";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import { store } from "../storeConfig/store";

import { history } from "../../history";

import toasters from "../../utility/toasters";
import { listValues } from "../../utility/constants";

export const getPermissions = () => async (dispatch) => {
  const res = await axiosInstance.get("/api/v1/client/permissions", {
    handlerEnabled: true,
  });
  dispatch({
    type: GET_PERMISSIONS,
    payload: { permissions: res.data.data },
  });
};

export const createRole = (body) => async () => {
  store.dispatch(addLoader("saveBtn"));
  try {
    await axiosInstance.post("/api/v1/client/roles", body, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("saveBtn"));
    toasters.Success("Role Created!");

    setTimeout(() => {
      history.push("/roles");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("saveBtn"));
  }
};

export const getRoles = (params) => async (dispatch) => {
  store.dispatch(addLoader("listRoles"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/roles?&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_ROLES,
      payload: res.data,
    });
    store.dispatch(removeLoader("listRoles"));
  } catch (err) {
    store.dispatch(removeLoader("listRoles"));
  }
};

export const deleteRole = (id) => async () => {
  store.dispatch(addLoader("deleteroleBtn"));
  try {
    await axiosInstance.delete(`/api/v1/client/roles/${id}`, {
      handlerEnabled: true,
    });
    history.push("/roles");
    store.dispatch(removeLoader("deleteroleBtn"));
    toasters.Success("The role has been deleted successfully");
    store.dispatch(getRoles({ page: 1, per_page: listValues.PER_PAGE }));
  } catch (err) {
    store.dispatch(removeLoader("deleteroleBtn"));
  }
};

export const viewRole = (id) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/roles/${id}`, {
    handlerEnabled: true,
  });
  dispatch({
    type: VIEW_ROLE,
    payload: { viewedRole: res.data.data },
  });
};

export const editRole = (id, body) => async () => {
  store.dispatch(addLoader("saveBtn"));
  try {
    await axiosInstance.put(`/api/v1/client/roles/${id}`, body, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("saveBtn"));
    toasters.Success("Role Edited!");

    setTimeout(() => {
      history.push("/roles");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("saveBtn"));
  }
};

export const clearViewedRole = () => async (dispatch) => {
  dispatch({
    type: CLEAR_VIEWED_ROLE,
    payload: { viewedRole: null },
  });
};

export const getRolesDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(
    `/api/v1/client/roles?&sort[by]=created_at&sort[order]=desc&page=${page}&name=${search}`,
    {
      handlerEnabled: true,
      loader: "getRolesDDLAsync",
    },
  );
  return {
    options: res.data.data.map((ele) => ({
      value: ele.id,
      label: ele.name,
    })),
    hasMore: page < res.data.meta.last_page,
    additional: {
      page: page + 1,
    },
  };
};
