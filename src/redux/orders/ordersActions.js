import { axiosInstance } from "../../network/apis";
import {
  GET_ONLINE_ORDERS,
  GET_ONLINE_ORDER_DETAILS,
  CLEAR_ONLINE_ORDER_DETAILS,
  GET_SHIPPED_ORDERS,
  GET_UNRESOLVED_ORDERS,
} from "./ordersTypes";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import { store } from "../storeConfig/store";
import { listValues, OrderStatus } from "../../utility/constants";
import { history } from "../../history";

export const getOnlineOrders = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/orders?per_page=${listValues.PER_PAGE}&sort[by]=date&sort[order]=desc&type=1`,
    {
      handlerEnabled: true,
      params,
      loader: "getOnlineOrders",
    },
  );
  dispatch({
    type: GET_ONLINE_ORDERS,
    payload: res.data,
  });
};

export const getOnlineOrderDetails = (id) => async (dispatch) => {
  store.dispatch(addLoader("getOnlineOrderDetails"));
  try {
    const res = await axiosInstance.get(`/api/v1/client/orders/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: GET_ONLINE_ORDER_DETAILS,
      payload: res.data,
    });
    store.dispatch(removeLoader("getOnlineOrderDetails"));
  } catch (err) {
    store.dispatch(removeLoader("getOnlineOrderDetails"));
    dispatch({
      type: GET_ONLINE_ORDER_DETAILS,
      payload: false,
    });
  }
};
export const clearOnlineOrderDetails = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ONLINE_ORDER_DETAILS,
  });
};

export const getShippedOrders = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/shipments?&sort[by]=updated_at&sort[order]=desc&order_status=${OrderStatus.SHIPPED}`,
    {
      handlerEnabled: true,
      params,
      loader: "getShippedOrders",
    },
  );
  dispatch({
    type: GET_SHIPPED_ORDERS,
    payload: res.data,
  });
};
export const getUnresolvedOrders = (params) => async (dispatch) => {
  const res = await axiosInstance.get("/api/v1/client/orders/manual-resolve", {
    handlerEnabled: true,
    params,
    loader: "getUnresolvedOrders",
  });
  dispatch({
    type: GET_UNRESOLVED_ORDERS,
    payload: res.data.data,
  });
};

export const getOfflineOrders = (params) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/pos/orders?sort[by]=transaction_date&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
        loader: "getOfflineOrders",
      },
    );
    dispatch({
      type: "GET_OFFLINE_ORDERS",
      payload: res.data,
    });
  } catch (err) {
    history.push("/misc/error/wrong-url");
  }
};
