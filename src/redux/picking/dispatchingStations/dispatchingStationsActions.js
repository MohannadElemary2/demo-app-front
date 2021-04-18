import React from "react";
import { FormattedMessage } from "react-intl";
import { axiosInstance } from "../../../network/apis";
import toasters from "../../../utility/toasters";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import { history } from "../../../history";
import { appendURLParams } from "../../../utility/commonFunctions";
import {
  VIEW_DISPATCHING_STATION,
  CLEAR_VIEWED_DISPATCHING_STATION,
  LIST_STATIONS,
  LIST_STATIONS_CARTS,
  CLEAR_LIST_STATIONS_CARTS,
  VIEW_STATION_CART_DETAILS,
  CLEAR_VIEW_STATION_CART_DETAILS,
  SHOW_STATION_BATCH_ORDER_DETAILS,
} from "./dispatchingStationsTypes";

export const createDispatchingStation = (body) => async () => {
  store.dispatch(addLoader("createDispatchingStation"));
  try {
    await axiosInstance.post(`/api/v1/client/picking/dispatchingStations`, body, {
      handlerEnabled: true,
    });

    store.dispatch(removeLoader("createDispatchingStation"));
    toasters.Success("Your changes have been saved.");
    history.push("/fulfillment/dispatching-list");
  } catch (err) {
    store.dispatch(removeLoader("createDispatchingStation"));
  }
};

export const viewDispatchingStation = (id) => async (dispatch) => {
  store.dispatch(addLoader("viewDispatchingStation"));
  try {
    const res = await axiosInstance.get(`/api/v1/client/picking/dispatchingStations/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: VIEW_DISPATCHING_STATION,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("viewDispatchingStation"));
  } catch (err) {
    store.dispatch(removeLoader("viewDispatchingStation"));
  }
};

export const editDispatchingStation = (id, body) => async () => {
  store.dispatch(addLoader("editDispatchingStation"));
  try {
    await axiosInstance.put(`/api/v1/client/picking/dispatchingStations/${id}`, body, {
      handlerEnabled: true,
    });

    store.dispatch(removeLoader("editDispatchingStation"));
    toasters.Success("Your changes have been saved.");
    history.push("/fulfillment/dispatching-list");
  } catch (err) {
    store.dispatch(removeLoader("editDispatchingStation"));
  }
};
export const clearViewedDispatchingStation = () => async (dispatch) => {
  dispatch({
    type: CLEAR_VIEWED_DISPATCHING_STATION,
  });
};

export const listStations = (params) => async (dispatch) => {
  store.dispatch(addLoader("listStations"));
  try {
    const res = await axiosInstance.get(
      "/api/v1/client/picking/dispatchingStations?sort[order]=desc",
      {
        handlerEnabled: true,
        params,
      },
    );

    dispatch({
      type: LIST_STATIONS,
      payload: res.data,
    });
    store.dispatch(removeLoader("listStations"));
  } catch (err) {
    store.dispatch(removeLoader("listStations"));
  }
};

export const listStationsCarts = (params) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(
      "/api/v1/client/dispatching/dispatching-station-carts?sort[order]=desc",
      {
        handlerEnabled: true,
        params,
        loader: "listStationsCarts",
      },
    );

    dispatch({
      type: LIST_STATIONS_CARTS,
      payload: res.data,
    });
  } catch (err) {
    history.push(`/dispatching/dispatch-orders${window.location.search}`);
  }
};

export const clearListStationCarts = () => async (dispatch) => {
  dispatch({
    type: CLEAR_LIST_STATIONS_CARTS,
  });
};

export const leaveStation = (body) => async () => {
  await axiosInstance.post(`/api/v1/client/dispatching/leave-station`, body, {
    handlerEnabled: true,
    loader: "leaveStation",
  });

  history.push("/dispatching/dispatch-orders");
};

export const showStationCartDetails = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`api/v1/client/dispatching/cart-details?cart=${id}`, {
      handlerEnabled: true,
      loader: "showStationCartDetails",
    });
    dispatch({
      type: VIEW_STATION_CART_DETAILS,
      payload: res.data.data,
    });

    history.push(
      `/dispatching/dispatch-orders/station-carts/station-cart-details?${appendURLParams(
        "cartId",
        id,
      )}`,
    );
  } catch (err) {
    history.push(`/dispatching/dispatch-orders/station-carts${window.location.search}`);
  }
};

export const clearStationCartDetails = () => async (dispatch) => {
  dispatch({
    type: CLEAR_VIEW_STATION_CART_DETAILS,
  });
};

export const showStationBatchOrderDetails = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/api/v1/client/dispatching/batch-order-details/${id}`, {
      handlerEnabled: true,
      loader: "showStationBatchOrderDetails",
    });
    dispatch({
      type: SHOW_STATION_BATCH_ORDER_DETAILS,
      payload: res.data.data,
    });
  } catch (err) {
    history.push(
      `/dispatching/dispatch-orders/station-carts/station-cart-details${window.location.search}`,
    );
  }
};

export const savePackingProgress = (id, cartId) => async () => {
  await axiosInstance.post(`/api/v1/client/dispatching/mark-batch-order-as-packed/${id}`, null, {
    handlerEnabled: true,
    loader: "savePackingProgress",
  });
  toasters.Success(<FormattedMessage id="success" />);
  history.push(
    `/dispatching/dispatch-orders/station-carts/station-cart-details/${cartId}${window.location.search}`,
  );
};

export const createShipment = (body) => async () => {
  await axiosInstance.post(`/api/v1/client/shipping/create-shipment`, body, {
    handlerEnabled: true,
    loader: "createShipment",
  });
};
export const releaseCart = (id) => async () => {
  await axiosInstance.post(`/api/v1/client/dispatching/mark-batch-as-completed/${id}`, null, {
    handlerEnabled: true,
    loader: "releaseCart",
  });
  history.push(`/dispatching/dispatch-orders/station-carts/${window.location.search}`);
};
