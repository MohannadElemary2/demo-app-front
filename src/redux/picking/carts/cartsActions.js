import { GET_CARTS, GET_CARTS_HUBS, VIEW_CARTS_HUBS, CLEAR_VIEWED_CART } from "./cartsTypes";
import { axiosInstance } from "../../../network/apis";
import toasters from "../../../utility/toasters";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import { history } from "../../../history";
import { listValues } from "../../../utility/constants";

export const getCartsList = (params) => async (dispatch) => {
  store.dispatch(addLoader("CartsList"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/picking/carts?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_CARTS,
      payload: res.data,
    });
    store.dispatch(removeLoader("CartsList"));
  } catch (err) {
    store.dispatch(removeLoader("CartsList"));
  }
};
export const activateCart = (id, body) => async (dispatch) => {
  store.dispatch(addLoader("activatecartBtn"));
  try {
    await axiosInstance.put(`/api/v1/client/picking/carts/${id}/activate`, body, {
      handlerEnabled: true,
    });
    if (body.is_active) {
      toasters.Success(`This cart is activated`);
    } else {
      toasters.Success(`This cart is deactivated`);
    }
    store.dispatch(removeLoader("activatecartBtn"));
  } catch (err) {
    store.dispatch(removeLoader("activatecartBtn"));
  }
};

export const getCartsHubs = (params) => async (dispatch) => {
  store.dispatch(addLoader("getCartsHubs"));
  try {
    const res = await axiosInstance.get(`/api/v1/client/hubs?asHubManager=1&dropdown=1`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: GET_CARTS_HUBS,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("getCartsHubs"));
  } catch (err) {
    store.dispatch(removeLoader("getCartsHubs"));
  }
};
export const addCart = (body) => async (dispatch) => {
  store.dispatch(addLoader("addCart"));
  try {
    await axiosInstance.post(`/api/v1/client/picking/carts`, body, {
      handlerEnabled: true,
    });
    dispatch({
      type: GET_CARTS_HUBS,
    });
    store.dispatch(removeLoader("addCart"));
    toasters.Success("Your changes have been saved.");
    history.push("/fulfillment/carts");
  } catch (err) {
    store.dispatch(removeLoader("addCart"));
  }
};
export const viewCart = (id) => async (dispatch) => {
  store.dispatch(addLoader("viewCart"));
  try {
    const res = await axiosInstance.get(`/api/v1/client/picking/carts/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: VIEW_CARTS_HUBS,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("viewCart"));
  } catch (err) {
    store.dispatch(removeLoader("viewCart"));
  }
};

export const editCart = (id, body) => async () => {
  store.dispatch(addLoader("editCart"));
  try {
    await axiosInstance.put(`/api/v1/client/picking/carts/${id}`, body, {
      handlerEnabled: true,
    });

    store.dispatch(removeLoader("editCart"));
    toasters.Success("Your changes have been saved.");
    history.push("/fulfillment/carts");
  } catch (err) {
    store.dispatch(removeLoader("editCart"));
  }
};
export const clearViewedCart = () => async (dispatch) => {
  dispatch({
    type: CLEAR_VIEWED_CART,
  });
};
