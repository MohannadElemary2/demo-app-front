import { listValues, weekDays } from "../../utility/constants";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import { store } from "../storeConfig/store";
import {
  ADD_SHIFT,
  GET_WEEK_DAYS,
  REMOVE_SHIFT,
  TOGGLE_24,
  OPEN_DAY,
  SET_SHIFT_TIME_FROM,
  SET_SHIFT_TIME_TO,
  SELECT_HUB,
  GET_HUBS,
  COPY_TIMES_TO_ALL,
  GET_CITY,
  CLEAR_HUB,
  VIEW_HUB,
  GET_COUNTRIES,
  GET_CITIES,
  CLEAR_HUBS,
  GET_HUBS_DDL,
} from "./hubsTypes";
import { axiosInstance } from "../../network/apis";
import toasters from "../../utility/toasters";
import { history } from "../../history";
import { deepClone } from "../../utility/commonFunctions";

export const getWorkingDays = () => (dispatch) => {
  dispatch({
    type: GET_WEEK_DAYS,
    payload: deepClone(weekDays),
  });
};
export const openDay = (day) => (dispatch) => {
  dispatch({
    type: OPEN_DAY,
    payload: day,
  });
};
export const addShift = (day) => (dispatch) => {
  dispatch({
    type: ADD_SHIFT,
    payload: day,
  });
};
export const removeShift = (day) => (dispatch) => {
  dispatch({
    type: REMOVE_SHIFT,
    payload: day,
  });
};

export const toggle24 = (day) => (dispatch) => {
  dispatch({
    type: TOGGLE_24,
    payload: day,
  });
};

export const setShiftTimeFrom = (data) => (dispatch) => {
  dispatch({
    type: SET_SHIFT_TIME_FROM,
    payload: data,
  });
};

export const setShiftTimeTo = (data) => (dispatch) => {
  dispatch({
    type: SET_SHIFT_TIME_TO,
    payload: data,
  });
};

export const copyTimesToAll = (day) => (dispatch) => {
  dispatch({
    type: COPY_TIMES_TO_ALL,
    payload: day,
  });
};

export const createHub = (body) => async () => {
  store.dispatch(addLoader("createHub"));

  try {
    await axiosInstance.post("/api/v1/client/hubs", body, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("createHub"));
    toasters.Success("Your changes have been saved.");
    setTimeout(() => {
      history.push("/hubs");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("createHub"));
  }
};

export const getHubs = (params) => async (dispatch) => {
  store.dispatch(addLoader("listHubs"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/hubs?&sort[by]=created_at&sort[order]=desc&asHubManager=1`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_HUBS,
      payload: res.data,
    });
    store.dispatch(removeLoader("listHubs"));
  } catch (err) {
    store.dispatch(removeLoader("listHubs"));
  }
};

export const getCountries = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`api/v1/client/hubs/countries`, {
    handlerEnabled: true,
    params,
    loader: "getCountries",
  });
  dispatch({
    type: GET_COUNTRIES,
    payload: res.data,
  });
};

export const getCities = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`api/v1/client/hubs/cities?per_page${listValues.PER_PAGE}`, {
    handlerEnabled: true,
    loader: "getCities",
    params,
  });
  dispatch({
    type: GET_CITIES,
    payload: res.data,
  });
};

export const activateHub = (id, body) => async () => {
  store.dispatch(addLoader("activateBtn"));
  try {
    await axiosInstance.put(`/api/v1/client/hubs/${id}/activate`, body, {
      handlerEnabled: true,
    });
    if (body.is_active) {
      toasters.Success(`This hub is activated`);
    } else {
      toasters.Success(`This hub is deactivated`);
    }
    store.dispatch(removeLoader("activateBtn"));
  } catch (err) {
    store.dispatch(removeLoader("activateBtn"));
  }
};

export const updateBuffer = (id, body) => async () => {
  store.dispatch(addLoader("updateBuffer"));
  try {
    await axiosInstance.put(`/api/v1/client/hubs/${id}/buffer`, body, {
      handlerEnabled: true,
    });
    toasters.Success("Your changes have been saved.");
    store.dispatch(removeLoader("updateBuffer"));
  } catch (err) {
    store.dispatch(removeLoader("updateBuffer"));
  }
};
export const selectHub = (hub, selectType) => async (dispatch) => {
  dispatch({
    type: SELECT_HUB,
    selectType,
    payload: hub,
  });
};
export const clearHub = () => async (dispatch) => {
  dispatch({
    type: CLEAR_HUB,
  });
};

export const clearHubs = () => async (dispatch) => {
  dispatch({
    type: CLEAR_HUBS,
  });
};
export const getCityFromLatLng = (position, dragged) => async (dispatch) => {
  store.dispatch(addLoader("getCity"));
  try {
    const res = await axiosInstance.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&sensor=true&key=${process.env.REACT_APP_GOOGLE_API}`,
      {
        handlerEnabled: false,
        withCredentials: false,
      },
    );
    dispatch({
      type: GET_CITY,
      payload: { data: res.data.results, onDragEvent: dragged },
    });
    store.dispatch(removeLoader("getCity"));
  } catch (err) {
    store.dispatch(removeLoader("getCity"));
  }
};

export const viewHub = (id) => async (dispatch) => {
  store.dispatch(addLoader("viewHub"));
  try {
    const res = await axiosInstance.get(`/api/v1/client/hubs/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: VIEW_HUB,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("viewHub"));
  } catch (err) {
    store.dispatch(removeLoader("viewHub"));
  }
};

export const editHub = (id, body) => async () => {
  store.dispatch(addLoader("editHub"));

  try {
    await axiosInstance.put(`/api/v1/client/hubs/${id}`, body, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("editHub"));
    toasters.Success("Your changes have been saved.");
    setTimeout(() => {
      history.push("/hubs");
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("editHub"));
  }
};

export const getHubsDDL = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    "api/v1/client/hubs?&sort[by]=created_at&sort[order]=desc&asHubManager=1&dropdown=1",
    {
      handlerEnabled: true,
      params,
      loader: "getHubsDDL",
    },
  );
  dispatch({
    type: GET_HUBS_DDL,
    payload: res.data,
  });
};

export const getHubsDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(
    `api/v1/client/hubs?&sort[by]=created_at&sort[order]=desc&asHubManager=1&dropdown=1&name=${search}&page=${page}`,
    {
      handlerEnabled: true,
      loader: "getHubsDDLAsync",
    },
  );
  store.dispatch({
    type: GET_HUBS,
    payload: res.data,
  });

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

export const getCountriesDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(
    `api/v1/client/hubs/countries?&sort[by]=created_at&sort[order]=desc&asHubManager=1&dropdown=1&name=${search}&page=${page}`,
    {
      handlerEnabled: true,
      loader: "getCountriesDDLAsync",
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
    `api/v1/client/hubs/cities?&sort[by]=created_at&sort[order]=desc&asHubManager=1&dropdown=1&name=${search}&page=${page}&country=${country}`,
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
