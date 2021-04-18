import { axiosInstance } from "../../network/apis";
import { store } from "../storeConfig/store";
import { addServerError } from "../serverErrors/serverErrorsActions";

import {
  GET_SHIPPING_PARTNERS_COUNTRIES,
  GET_SHIPPING_PARTNERS_CITIES_FROM,
  GET_SHIPPING_PARTNERS_CITIES_TO,
  CLEAR_SHIPPING_PARTNERS_COUNTRIES,
  CLEAR_SHIPPING_PARTNERS_CITIES_FROM,
  CLEAR_SHIPPING_PARTNERS_CITIES_TO,
  CHECK_FROM_CITY_EXISTENCE,
  CHECK_TO_CITY_EXISTENCE,
  GET_SHIPPING_METHODS_AS_DDL,
  PRINT_LABEL,
  CLEAR_PRINT_LABEL,
  CLEAR_FROM_CITY_EXISTENCE,
  CLEAR_TO_CITY_EXISTENCE,
} from "./createShippmentTypes";
import toasters from "../../utility/toasters";
import { showStationBatchOrderDetails } from "../picking/dispatchingStations/dispatchingStationsActions";
import { getURLParams } from "../../utility/commonFunctions";

export const getShippingMethodsAsDDL = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    `api/v1/client/shipping?sort[by]=created_at&sort[order]=desc&is_integrated=1`,
    {
      handlerEnabled: true,
      params,
      loader: "getShippingMethodsAsDDL",
    },
  );
  dispatch({
    type: GET_SHIPPING_METHODS_AS_DDL,
    payload: res.data.data,
    meta: res.data.meta,
  });
};
export const getShippingPartnerCountries = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/shipping/countries`, {
    handlerEnabled: true,
    params,
    loader: "getShippingPartnerCountries",
  });
  dispatch({
    type: GET_SHIPPING_PARTNERS_COUNTRIES,
    payload: res.data,
  });
};

export const clearShippingPartnerCountries = () => (dispatch) => {
  dispatch({
    type: CLEAR_SHIPPING_PARTNERS_COUNTRIES,
    payload: { shippingPartnerCountries: null },
  });
};

export const getShippingPartnerCitiesFrom = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/shipping/cities`, {
    handlerEnabled: true,
    params,
    loader: "getShippingPartnerCitiesFrom",
  });
  dispatch({
    type: GET_SHIPPING_PARTNERS_CITIES_FROM,
    payload: res.data,
  });
};

export const getShippingPartnerCitiesTo = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/shipping/cities`, {
    handlerEnabled: true,
    params,
    loader: "getShippingPartnerCitiesTo",
  });
  dispatch({
    type: GET_SHIPPING_PARTNERS_CITIES_TO,
    payload: res.data,
  });
};
export const clearShippingPartnerCitiesFrom = () => (dispatch) => {
  dispatch({
    type: CLEAR_SHIPPING_PARTNERS_CITIES_FROM,
    payload: { shippingPartnerCitiesFrom: null },
  });
};

export const clearShippingPartnerCitiesTo = () => (dispatch) => {
  dispatch({
    type: CLEAR_SHIPPING_PARTNERS_CITIES_TO,
    payload: { shippingPartnerCitiesTo: null },
  });
};
export const createShipment = (body) => async () => {
  try {
    await axiosInstance.post(`/api/v1/client/shipping/create-shipment`, body, {
      handlerEnabled: true,
      loader: "createShipment",
    });
    store.dispatch(printLabel({ order_id: body.order_id }));
  } catch (err) {
    store.dispatch(addServerError({ createShipmentErr: err.response.data.message }));
  }
};

export const printLabel = (body) => async (dispatch) => {
  const res = await axiosInstance.post(`/api/v1/client/shipping/print-label`, body, {
    handlerEnabled: true,
    loader: "printLabel",
  });
  dispatch({
    type: PRINT_LABEL,
    payload: res.data.data,
  });
};

export const clearPrintLabel = () => (dispatch) => {
  dispatch({
    type: CLEAR_PRINT_LABEL,
    payload: { printLabel: null },
  });
};
export const CheckCityFromExistence = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`api/v1/client/shipping/cities/check-existence`, {
    handlerEnabled: true,
    params,
    loader: "CheckCityFromExistence",
  });
  dispatch({
    type: CHECK_FROM_CITY_EXISTENCE,
    payload: res.data.data,
  });
};

export const clearCityFromExistence = () => (dispatch) => {
  dispatch({
    type: CLEAR_FROM_CITY_EXISTENCE,
    payload: { cityFromExistence: null },
  });
};
export const CheckCityToExistence = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`api/v1/client/shipping/cities/check-existence`, {
    handlerEnabled: true,
    params,
    loader: "CheckCityToExistence",
  });
  dispatch({
    type: CHECK_TO_CITY_EXISTENCE,
    payload: res.data.data,
  });
};

export const clearCityToExistence = () => (dispatch) => {
  dispatch({
    type: CLEAR_TO_CITY_EXISTENCE,
    payload: { cityToExistence: null },
  });
};

export const updateGrandTotal = (orderId) => async (dispatch) => {
  try {
    await axiosInstance.post(`/api/v1/client/orders/${orderId}/refund-not-found-items`, null, {
      handlerEnabled: true,
      loader: "updateGrandTotal",
    });
    dispatch(showStationBatchOrderDetails(getURLParams("batchOrderId")));
    toasters.Success("Grand total updated.");
  } catch (err) {
    toasters.Error(err.response.data.message);
  }
};

export const getShippingCountriesFromDDLAsync = async (
  search,
  loadedOptions,
  { page, integration },
) => {
  const res = await axiosInstance.get(
    `/api/v1/client/shipping/countries?dropdown=1&name=${search}&page=${page}&integration=${integration}`,
    {
      handlerEnabled: true,
      loader: "getShippingCountriesFromDDLAsync",
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
      integration,
    },
  };
};

export const getShippingCountriesToDLAsync = async (
  search,
  loadedOptions,
  { page, integration },
) => {
  const res = await axiosInstance.get(
    `/api/v1/client/shipping/countries?dropdown=1&name=${search}&page=${page}&integration=${integration}`,
    {
      handlerEnabled: true,
      loader: "getShippingCountriesToDLAsync",
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
      integration,
    },
  };
};

export const getShippingPartnerCitiesFromDDLAsync = async (
  search,
  loadedOptions,
  { page, integration, shipping_country_id },
) => {
  const res = await axiosInstance.get(
    `/api/v1/client/shipping/cities?dropdown=1&name=${search}&page=${page}&integration=${integration}&shipping_country_id=${shipping_country_id}`,
    {
      handlerEnabled: true,
      loader: "getShippingPartnerCitiesFromDDLAsync",
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
      integration,
      shipping_country_id,
    },
  };
};

export const getShippingPartnerCitiesToDDLAsync = async (
  search,
  loadedOptions,
  { page, integration, shipping_country_id },
) => {
  const res = await axiosInstance.get(
    `/api/v1/client/shipping/cities?dropdown=1&name=${search}&page=${page}&integration=${integration}&shipping_country_id=${shipping_country_id}`,
    {
      handlerEnabled: true,
      loader: "getShippingPartnerCitiesToDDLAsync",
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
      integration,
      shipping_country_id,
    },
  };
};
