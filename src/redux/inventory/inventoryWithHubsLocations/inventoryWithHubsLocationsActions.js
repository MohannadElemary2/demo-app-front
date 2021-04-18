import {
  GET_INVENTORY_WITH_HUB_LOCATIONS,
  EXPORT_INVENTORY_WITH_HUB_LOCATIONS,
  CLEAR_INVENTORY_WITH_HUB_LOCATIONS,
  INVENTORY_WITH_HUB_LOCATIONS_STATISTICS,
  VIEW_SKU,
  CLEAR_SKU,
  GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY,
  CLEAR_GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY,
  CLEAR_INVENTORY_WITH_HUB_LOCATIONS_STATISTICS,
} from "./inventoryWithHubsLocationsTypes";
import { axiosInstance } from "../../../network/apis";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import toasters from "../../../utility/toasters";
import { listValues } from "../../../utility/constants";

export const getInventoryWithHubLocations = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/inventory/location?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
    {
      handlerEnabled: true,
      params,
      loader: "getInventoryWithHubLocations",
    },
  );
  dispatch({
    type: GET_INVENTORY_WITH_HUB_LOCATIONS,
    payload: res.data,
  });
};

export const getInventoryWithHubLocationsINAddQuantity = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/inventory/location?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
    {
      handlerEnabled: true,
      params,
    },
  );
  dispatch({
    type: GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY,
    payload: res.data,
  });
};

export const clearInventoryWithHubLocationsINAddQuantity = () => async (dispatch) => {
  dispatch({
    type: CLEAR_GET_INVENTORY_WITH_HUB_LOCATIONS_IN_ADD_QUANTITY,
  });
};
export const exportInventoryWithHubLocations = (params) => async (dispatch) => {
  store.dispatch(addLoader("exportInventoryWithHubLocations"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/inventory/location/export?&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: EXPORT_INVENTORY_WITH_HUB_LOCATIONS,
      payload: res.data,
    });
    store.dispatch(removeLoader("exportInventoryWithHubLocations"));
    toasters.Success("We will send you the file via email");
  } catch (err) {
    store.dispatch(removeLoader("exportInventoryWithHubLocations"));
  }
};
export const clearInventoryWithHubLocations = () => async (dispatch) => {
  dispatch({
    type: CLEAR_INVENTORY_WITH_HUB_LOCATIONS,
  });
};

export const getInventoryWithHubLocationStatistics = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/inventory/location/statistics`, {
    handlerEnabled: true,
    params,
  });
  dispatch({
    type: INVENTORY_WITH_HUB_LOCATIONS_STATISTICS,
    payload: res.data,
  });
};
export const clearInventoryWithHubLocationStatistics = () => async (dispatch) => {
  dispatch({
    type: CLEAR_INVENTORY_WITH_HUB_LOCATIONS_STATISTICS,
  });
};

export const viewSKU = (id) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/catalog/products/${id}`, {
    handlerEnabled: true,
  });
  dispatch({
    type: VIEW_SKU,
    payload: res.data.data,
  });
};

export const clearSKU = () => async (dispatch) => {
  dispatch({
    type: CLEAR_SKU,
  });
};
