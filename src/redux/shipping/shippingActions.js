import { store } from "../storeConfig/store";
import { axiosInstance } from "../../network/apis";
import {
  GET_SHIPPING_METHODS,
  INTEGRATE_SHIPPING_METHODS,
  GET_SIGNLE_SHIPPING_METHOD,
  CLEAR_SINGLE_SHIPPING_METHOD,
  GET_SHIPPING_PARTNERS_COUNTRIES,
  GET_SHIPPING_PARTNERS_CITIES,
  CLEAR_SHIPPING_PARTNERS_COUNTRIES,
  CLEAR_SHIPPING_PARTNERS_CITIES,
  CHECK_CITY_EXISTENCE,
  GET_SHIPPING_METHODS_AS_DDL
} from "./shippingTypes";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import toasters from "../../utility/toasters";
import { history } from "../../history";
import { addServerError } from "../serverErrors/serverErrorsActions";

export const getShippingMethods = (params) => async (dispatch) => {
  store.dispatch(addLoader("getShippingMethods"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/shipping?sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_SHIPPING_METHODS,
      payload: res.data.data,
      meta: res.data.meta,
    });
    store.dispatch(removeLoader("getShippingMethods"));
  } catch (err) {
    store.dispatch(removeLoader("getShippingMethods"));
  }
};



export const integrateShippingMethod = (body) => async (dispatch) => {
  store.dispatch(addLoader("integrateBtn"));
  try {
    await axiosInstance.post("/api/v1/client/shipping/integrate", body, {
      handlerEnabled: true,
    });

    dispatch({
      type: INTEGRATE_SHIPPING_METHODS,
    });

    store.dispatch(removeLoader("integrateBtn"));
    toasters.Success("Your integration has been saved.");
    setTimeout(() => {
      history.push("/settings/shipping-methods");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("integrateBtn"));
    store.dispatch(addServerError({ channelIntegrationErr: err.response.data.message }));
  }
};
export const getSingleShippingMethod = (shippingMethod) => async (dispatch) => {
  store.dispatch(addLoader("getShippingMethod"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/shipping/show?integration=${shippingMethod}`,
      {
        handlerEnabled: true,
      },
    );
    dispatch({
      type: GET_SIGNLE_SHIPPING_METHOD,
      payload: { signleShippingMethod: res.data.data },
    });

    store.dispatch(removeLoader("getShippingMethod"));
  } catch (err) {
    store.dispatch(removeLoader("getShippingMethod"));
  }
};
export const clearSingleShippingMethod = () => (dispatch) => {
  dispatch({
    type: CLEAR_SINGLE_SHIPPING_METHOD,
    payload: { signleShippingMethod: null },
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

export const getShippingPartnerCities = (integration, shipping_country_id, params) => async (
  dispatch,
) => {
  const res = await axiosInstance.get(
    `/api/v1/client/shipping/cities?integration=${integration}&shipping_country_id=${shipping_country_id}`,
    {
      handlerEnabled: true,
      params,
      loader: "getShippingPartnerCities",
    },
  );
  dispatch({
    type: GET_SHIPPING_PARTNERS_CITIES,
    payload: res.data,
  });
};

export const clearShippingPartnerCities = () => (dispatch) => {
  dispatch({
    type: CLEAR_SHIPPING_PARTNERS_CITIES,
    payload: { shippingPartnerCities: null },
  });
};
export const connectTOSaleChannel = (body, partnerName, channelName) => async (dispatch) => {
  await axiosInstance.post("/api/v1/client/shipping/connect-sales-channels", body, {
    handlerEnabled: true,
    loader: "connectTOSaleChannel",
  });

  dispatch({
    type: INTEGRATE_SHIPPING_METHODS,
  });

  toasters.Success(`${partnerName} is connected with ${channelName} orders successfully.`);
};


