import { axiosInstance } from "../../../network/apis";
import toasters from "../../../utility/toasters";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import {
  GET_IMPORTING_HUBS,
  IMPORT_HUB_LOCATIONS,
  SET_LOCATIONS_FILE_SERVER_ERROR,
  SET_BUFFER_FILE_SERVER_ERROR,
  CLEAR_IMPORTING_LOCATIONS,
  CLEAR_IMPORTING_BUFFER,
} from "./importingTypes";

export const getImportingHubs = (params) => async (dispatch) => {
  store.dispatch(addLoader("getImportingHubs"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/hubs?&sort[by]=created_at&sort[order]=desc&dropdown=1&asHubManager=1`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_IMPORTING_HUBS,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("getImportingHubs"));
  } catch (err) {
    store.dispatch(removeLoader("getImportingHubs"));
  }
};
export const setLocationFileServerErrors = (errors) => async (dispatch) => {
  dispatch({
    type: SET_LOCATIONS_FILE_SERVER_ERROR,
    payload: errors,
  });
};
export const setBufferFileServerErrors = (errors) => async (dispatch) => {
  dispatch({
    type: SET_BUFFER_FILE_SERVER_ERROR,
    payload: errors,
  });
};
export const importHubLocations = (body) => async (dispatch) => {
  const data = new FormData();
  data.append("hub", body.hub);
  data.append("file", body.file);
  store.dispatch(addLoader("importHubLocations"));
  try {
    const res = await axiosInstance.post("/api/v1/client/inventory/location/import", data, {
      handlerEnabled: true,
    });
    dispatch({
      type: IMPORT_HUB_LOCATIONS,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("importHubLocations"));
    toasters.Success("Data imported successfully!");
  } catch (err) {
    // if the status is 400 (bad request)
    if (err.response.status === 400) store.dispatch(setLocationFileServerErrors(err.response.data));
    store.dispatch(removeLoader("importHubLocations"));
  }
};
export const importProductsBuffer = (body) => async (dispatch) => {
  const data = new FormData();
  data.append("hub", body.hub);
  data.append("file", body.file);
  store.dispatch(addLoader("importProductsBuffer"));
  try {
    const res = await axiosInstance.post(
      "/api/v1/client/inventory/hubs/products-buffer/import",
      data,
      {
        handlerEnabled: true,
      },
    );
    dispatch({
      type: IMPORT_HUB_LOCATIONS,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("importProductsBuffer"));
    toasters.Success("Data imported successfully!");
  } catch (err) {
    // if the status is 400 (bad request)
    if (err.response.status === 400) store.dispatch(setBufferFileServerErrors(err.response.data));
    store.dispatch(removeLoader("importProductsBuffer"));
  }
};

export const clearImportingLocations = () => async (dispatch) => {
  dispatch({
    type: CLEAR_IMPORTING_LOCATIONS,
  });
};
export const clearImportingBuffer = () => async (dispatch) => {
  dispatch({
    type: CLEAR_IMPORTING_BUFFER,
  });
};
