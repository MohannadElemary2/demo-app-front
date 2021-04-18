import { axiosInstance } from "../../../network/apis";
import { leaveDispatcherOccupation } from "../../../network/realTime";
import { listValues } from "../../../utility/constants";
import { getShippedOrders } from "../../orders/ordersActions";
import toasters from "../../../utility/toasters";
import { history } from "../../../history";
import {
  GET_DISPATCHING_ORDERS_LIST_STATIONS,
  GET_DISPATCHING_FILTER_HUBS,
  OCCUPY_STATION,
  UPDATE_OCCUPATION,
  CLEAR_DISPATCHING_ORDERS_LIST_STATIONS,
} from "./dispatchingOrdersTypes";

export const getDispatchingOrdersListStations = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    "/api/v1/client/picking/dispatchingStations?sort[order]=desc&active=1",
    {
      handlerEnabled: true,
      params,
      loader: "getDispatchingOrdersListStations",
    },
  );

  dispatch({
    type: GET_DISPATCHING_ORDERS_LIST_STATIONS,
    payload: res.data,
  });
};

export const getDispatchingFilterHubs = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    "api/v1/client/hubs?&sort[by]=created_at&sort[order]=desc&dropdown=1&asHubManager=1",
    {
      handlerEnabled: true,
      params,
      loader: "getDispatchingFilterHubs",
    },
  );
  dispatch({
    type: GET_DISPATCHING_FILTER_HUBS,
    payload: res.data.data,
  });
};

export const occupyStation = (id) => async (dispatch) => {
  const data = { dispatching_station: id };
  const res = await axiosInstance.post("/api/v1/client/dispatching/occupy-station", data, {
    handlerEnabled: true,
    loader: "occupyStation",
  });
  dispatch({
    type: OCCUPY_STATION,
    payload: res.data.data,
  });
};

export const updateOccupation = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_OCCUPATION,
    payload: data.dispatching_station,
  });
};

export const clearDispatchingOrdersListStations = () => async (dispatch) => {
  dispatch({
    type: CLEAR_DISPATCHING_ORDERS_LIST_STATIONS,
  });
  leaveDispatcherOccupation();
};

export const confirmOrderShipping = (body) => async (dispatch) => {
  await axiosInstance.post("/api/v1/client/shipments/confirm-shipment-shipping", body, {
    handlerEnabled: true,
    loader: "confirmOrderShipping",
  });
  dispatch(getShippedOrders({ page: 1, per_page: listValues.PER_PAGE }));
};
export const cancelOrder = (orderId) => async (dispatch) => {
  await axiosInstance.post(`/api/v1/client/orders/${orderId}/cancel`,  {
    handlerEnabled: true,
    loader: "cancelOrder",
  });
  toasters.Success(`Order canceled, please handover the items to the audit team in order to return them to the shelves.`);
  setTimeout(() => {
    history.go(-2);
  }, 1000);

};