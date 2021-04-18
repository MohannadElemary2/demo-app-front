import { axiosInstance } from "../../../network/apis";
import toasters from "../../../utility/toasters";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import {
  MOVE_QUANTITY_FROM_LOCATION_TO_ANOTHER,
  GET_LOCATIONS_OF_HUB,
  VIEW_SKU,
  CLEAR_SKU,
  SELECT_HUB_LOCATION,
  SELECT_LOCATION,
  CLEAR_SELECTED_HUB_LOCATIONS,
  GET_SKUS,
  GET_MOVING_HUBS,
  GET_SKU_TABLE_DATA,
  CLEAR_SELECTED_HUB,
  CACHE_SKU,
} from "./movingTypes";
export const MoveQuantityFromLocationToAnother = (body) => async (dispatch) => {
  store.dispatch(addLoader("MoveQuantityFromLocationToAnother"));
  try {
    await axiosInstance.post("/api/v1/client/inventory/move", body, {
      handlerEnabled: true,
    });
    dispatch({
      type: MOVE_QUANTITY_FROM_LOCATION_TO_ANOTHER,
    });
    store.dispatch(removeLoader("MoveQuantityFromLocationToAnother"));
    // get the sku table data to see the updated results
    store.dispatch(getSKUsTableData({ product: body.product_id, hub: body.hub_id }));
    toasters.Success("Your changes have been saved.");
  } catch (err) {
    store.dispatch(removeLoader("MoveQuantityFromLocationToAnother"));
  }
};

export const getLocationsOfHub = (params) => async (dispatch) => {
  const res = await axiosInstance.get(`api/v1/client/hubLocations?sort[order]=asc&sort[by]=order`, {
    handlerEnabled: true,
    params,
    loader: "getLocationOfHub",
  });
  dispatch({
    type: GET_LOCATIONS_OF_HUB,
    payload: res.data.data,
  });
};

export const viewSKU = (sku) => async (dispatch) => {
  dispatch({
    type: VIEW_SKU,
    payload: sku,
  });
};

export const clearSKU = () => async (dispatch) => {
  dispatch({
    type: CLEAR_SKU,
  });
};

export const selectHub = (hub) => async (dispatch) => {
  dispatch({
    type: SELECT_HUB_LOCATION,
    payload: hub,
  });
  if (!hub) store.dispatch(clearSelectedHubLocations());
};
export const selectLocation = (location) => async (dispatch) => {
  const HUB = location.hub;
  dispatch({
    type: SELECT_LOCATION,
    payload: location,
  });
  store.dispatch(selectHub(HUB));
};

export const clearSelectedHubLocations = () => async (dispatch) => {
  dispatch({
    type: CLEAR_SELECTED_HUB_LOCATIONS,
  });
};

const defaultProductsParams = {
  "sort[by]": "created_at",
  "sort[order]": "desc",
};

export const getSKUs = (params = defaultProductsParams) => async (dispatch) => {
  store.dispatch(addLoader("getSKUs"));
  try {
    const res = await axiosInstance.get(`api/v1/client/catalog/products`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: GET_SKUS,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("getSKUs"));
  } catch (err) {
    store.dispatch(removeLoader("getSKUs"));
  }
};

export const getMovingHubs = (params) => async (dispatch) => {
  store.dispatch(addLoader("listHubs"));
  try {
    const res = await axiosInstance.get(
      "api/v1/client/hubs?&sort[by]=created_at&sort[order]=desc&asHubManager=1",
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_MOVING_HUBS,
      payload: res.data,
    });
    store.dispatch(removeLoader("listHubs"));
  } catch (err) {
    store.dispatch(removeLoader("listHubs"));
  }
};

export const getSKUsTableData = (params) => async (dispatch) => {
  store.dispatch(addLoader("getSelectedSKUTableData"));

  try {
    const res = await axiosInstance.get(`api/v1/client/inventory/location`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: GET_SKU_TABLE_DATA,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("getSelectedSKUTableData"));
  } catch (err) {
    store.dispatch(removeLoader("getSelectedSKUTableData"));
  }
};

export const clearSelectedHub = () => (dispatch) => {
  dispatch({
    type: CLEAR_SELECTED_HUB,
  });
};
export const clearMovingData = () => () => {
  store.dispatch(clearSKU());
  store.dispatch(clearSelectedHubLocations());
  store.dispatch(clearSelectedHub());
};

export const getSkusDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(`api/v1/client/catalog/products?sku=${search}&page=${page}`, {
    handlerEnabled: true,
    loader: "getSkusDDLAsync",
  });
  store.dispatch(casheSkus(res.data.data));
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

export const casheSkus = (skus) => async (dispatch) => {
  dispatch({
    type: CACHE_SKU,
    payload: skus,
  });
};

export const getLocationsDDLAsync = async (search, loadedOptions, { page, hub }) => {
  const res = await axiosInstance.get(
    `api/v1/client/hubLocations?sort[order]=asc&sort[by]=order?sku=${search}&page=${page}&hub=${hub}`,
    {
      handlerEnabled: true,
      loader: "getLocationsDDLAsync",
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
