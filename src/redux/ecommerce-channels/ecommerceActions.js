import { store } from "../storeConfig/store";
import { axiosInstance } from "../../network/apis";
import {
  GET_SIGNLE_CHANNEL,
  GET_CHANNELS,
  INTEGRATE_CHANNELS,
  CLEAR_SINGLE_CHANNEL,
  GET_INTEGRATION_HUBS,
  CREATE_HUBS_CONNECTION,
  CLEAR_INTEGRATION_HUBS,
  GET_HUBS_COUNTRIES,
  GET_HUBS_CITIES,
  UPDATE_CHANNEL_CONFIGS,
  GET_CHANNEL_CONFIGS,
  GET_INTEGRATED_SHIPPING_PARTNERS,
  CONNECT_SALES_CHANNELS,
  SET_ACTIVE_TAP,
  SET_ACTIVATED_TAP,
  GET_HUBS_COUNTRIES_DDL,
  GET_HUBS_CITIES_DDL,
} from "./ecommerceTypes";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import toasters from "../../utility/toasters";
import { history } from "../../history";
import { appendURLParams } from "../../utility/commonFunctions";

export const getChannels = (params) => async (dispatch) => {
  store.dispatch(addLoader("listChannels"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/sales-channels?sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_CHANNELS,
      payload: res.data.data,
      meta: res.data.meta,
    });
    store.dispatch(removeLoader("listChannels"));
  } catch (err) {
    store.dispatch(removeLoader("listChannels"));
  }
};


export const getSaleChannelDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(
    `api/v1/client/sales-channels?&sort[by]=created_at&sort[order]=desc&asHubManager=1&dropdown=1&name=${search}&page=${page}`,
    {
      handlerEnabled: true,
      loader: "getSaleChannelDDLAsync",
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

export const integrateChannle = (body) => async (dispatch) => {
  store.dispatch(addLoader("integrateBtn"));
  try {
    await axiosInstance.post("/api/v1/client/sales-channels/integrate", body, {
      handlerEnabled: true,
    });

    dispatch({
      type: INTEGRATE_CHANNELS,
    });

    store.dispatch(removeLoader("integrateBtn"));
    toasters.Success("Your integration has been saved.");
    setTimeout(() => {
      history.push("/settings/ecommerce-channels");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("integrateBtn"));
  }
};

export const getSingleChannel = (channel, tapTitle) => async (dispatch) => {
  store.dispatch(clearIntegrationHubs());
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/sales-channels/show?integration=${channel}`,
      {
        handlerEnabled: true,
        loader: "getSingleChannel",
      },
    );
    dispatch({
      type: GET_SIGNLE_CHANNEL,
      payload: { signleChannel: res.data.data },
    });
    dispatch(setActivatedTapAction(tapTitle));
  } catch (err) {
    history.push("/settings/ecommerce-channels");
  }
};

export const getIntegrationHubs = (channelId, params, tapTitle) => async (dispatch) => {
  store.dispatch(addLoader("getIntegrationHubs"));
  store.dispatch(clearIntegrationHubs());
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/hubs?order_by_sales_channel=${channelId}&per_page=50&dropdown=1`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_INTEGRATION_HUBS,
      payload: res.data,
    });
    dispatch(setActivatedTapAction(tapTitle));

    store.dispatch(removeLoader("getIntegrationHubs"));
  } catch (err) {
    store.dispatch(removeLoader("getIntegrationHubs"));
  }
};

export const clearSignleChannel = () => (dispatch) => {
  dispatch({
    type: CLEAR_SINGLE_CHANNEL,
    payload: { signleChannel: null },
  });
};

export const clearIntegrationHubs = () => (dispatch) => {
  dispatch({
    type: CLEAR_INTEGRATION_HUBS,
    payload: { integrationHubs: null },
  });
};

export const createHubsConnection = (body, channelName) => async (dispatch) => {
  store.dispatch(addLoader("createHubsConnection"));
  try {
    await axiosInstance.post("/api/v1/client/inventory/sales-channels/hubs", body, {
      handlerEnabled: true,
    });
    dispatch({
      type: CREATE_HUBS_CONNECTION,
    });

    store.dispatch(removeLoader("createHubsConnection"));
    toasters.Success("Success!");
    store.dispatch(getSingleChannel(channelName));
  } catch (err) {
    store.dispatch(removeLoader("createHubsConnection"));
  }
};

export const getHubsCountries = (params) => async (dispatch) => {
  store.dispatch(addLoader("getHubsCountries"));

  try {
    const res = await axiosInstance.get(`api/v1/client/hubs/countries`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: GET_HUBS_COUNTRIES,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("getHubsCountries"));
  } catch (err) {
    store.dispatch(removeLoader("getHubsCountries"));

    toasters.Error("Couldnt load Countries.");
  }
};

export const getHubsCities = (params) => async (dispatch) => {
  store.dispatch(addLoader("getHubsCities"));

  try {
    const res = await axiosInstance.get(`api/v1/client/hubs/cities`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: GET_HUBS_CITIES,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("getHubsCities"));
  } catch (err) {
    store.dispatch(removeLoader("getHubsCities"));

    toasters.Error("Couldnt load Cities.");
  }
};

export const getChannelConfigs = (channelName, tapTitle) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/sales-channels/configurations?sales_channel_tag=${channelName}`,
    {
      handlerEnabled: true,
      loader: "getChannelConfigs",
    },
  );
  dispatch({
    type: GET_CHANNEL_CONFIGS,
    payload: res.data.data,
  });
  dispatch(setActivatedTapAction(tapTitle));
};

export const updateChannelConfigs = (body) => async (dispatch) => {
  const res = await axiosInstance.post("/api/v1/client/sales-channels/configurations", body, {
    handlerEnabled: true,
    loader: "updateChannelConfigs",
  });
  toasters.Success("Configuration updated.");
  history.push("/settings/ecommerce-channels");
  dispatch({
    type: UPDATE_CHANNEL_CONFIGS,
    payload: res.data.data,
  });
};

export const getIntegratedShippingPartners = (channelName, tapTitle) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/shipping?sales_channnel=${channelName}&is_new=0`,
    {
      handlerEnabled: true,
      loader: "getIntegratedShippingPartners",
    },
  );
  dispatch({
    type: GET_INTEGRATED_SHIPPING_PARTNERS,
    payload: res.data,
  });
  dispatch(setActivatedTapAction(tapTitle));
};

export const connectSalesChannels = (body) => async (dispatch) => {
  const res = await axiosInstance.post("/api/v1/client/shipping/connect-sales-channels", body, {
    handlerEnabled: true,
    loader: "connectSalesChannels",
  });
  dispatch({
    type: CONNECT_SALES_CHANNELS,
    payload: res.data,
  });
};

export const setActiveTapAction = (tapTitle) => (dispatch) => {
  history.push(`?${appendURLParams("activeTap", tapTitle)}`);
  dispatch({
    type: SET_ACTIVE_TAP,
    payload: tapTitle,
  });
};
export const setActivatedTapAction = (tapTitle) => (dispatch) => {
  dispatch({
    type: SET_ACTIVATED_TAP,
    payload: tapTitle,
  });
};

export const getCountriesDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(
    `api/v1/client/hubs/countries?dropdown=1&name=${search}&page=${page}`,
    {
      handlerEnabled: true,
      loader: "getHubsDDLAsync",
    },
  );
  return {
    options: res.data.data.map((ele) => ({
      value: ele.country,
      label: ele.country,
    })),
    hasMore: page < res.data.meta.last_page,
    additional: {
      page: page + 1,
    },
  };
};
export const getCitiesDDLAsync = async (search, loadedOptions, { page, country }) => {
  const res = await axiosInstance.get(
    `api/v1/client/hubs/cities?dropdown=1&name=${search}&page=${page}&country=${country}`,
    {
      handlerEnabled: true,
      loader: "getCitiesDDLAsync",
    },
  );
  return {
    options: res.data.data.map((ele) => ({
      value: ele.city,
      label: ele.city,
    })),
    hasMore: page < res.data.meta.last_page,
    additional: {
      page: page + 1,
    },
  };
};
