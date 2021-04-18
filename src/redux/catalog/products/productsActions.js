import {
  GET_PRODUCTS,
  GET_ALL_PRODUCTS,
  VIEW_PRODUCT,
  CLEAR_PRODUCT,
  SYNC_PRODUCTS,
  EXPORT_PRODUCTS,
  CHECK_SYNC_PRODUCTS,
} from "./productsTypes";
import { axiosInstance } from "../../../network/apis";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import { syncStatus, syncTypes, listValues } from "../../../utility/constants";
import toasters from "../../../utility/toasters";

const defaultProductsParams = {
  per_page: listValues.PER_PAGE,
  "sort[by]": "created_at",
  "sort[order]": "desc",
};

export const getProducts = (params = defaultProductsParams) => async (dispatch) => {
  store.dispatch(addLoader("listProducts"));
  try {
    const res = await axiosInstance.get(`api/v1/client/catalog/products`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
    store.dispatch(removeLoader("listProducts"));
  } catch (err) {
    store.dispatch(removeLoader("listProducts"));
  }
};
export const getAllProducts = (params) => async (dispatch) => {
  store.dispatch(addLoader("allListProducts"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/catalog/products?per_page=10000000&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_ALL_PRODUCTS,
      payload: res.data,
    });
    store.dispatch(removeLoader("allListProducts"));
  } catch (err) {
    store.dispatch(removeLoader("allListProducts"));
  }
};
export const clearProduct = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PRODUCT,
  });
};

export const viewProduct = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/api/v1/client/catalog/products/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: VIEW_PRODUCT,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: VIEW_PRODUCT,
      payload: "noData",
    });
  }
};

export const syncProducts = (params) => async (dispatch) => {
  store.dispatch(addLoader("syncProducts"));
  try {
    await axiosInstance.get(`/api/v1/client/catalog/products/sync`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: SYNC_PRODUCTS,
    });
    store.dispatch(removeLoader("syncProducts"));
  } catch (err) {
    store.dispatch(removeLoader("syncProducts"));
  }
};

export const checkSyncProducts = (canViewList, viewToaster, fromRefresh = false) => async (
  dispatch,
) => {
  store.dispatch(addLoader("checkSyncProducts"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/catalog/sync-status/${syncTypes.PRODUCTS}`,
      {
        handlerEnabled: true,
      },
    );

    dispatch({
      type: CHECK_SYNC_PRODUCTS,
      payload: res.data.data,
    });
    switch (res.data.data.status.value) {
      case syncStatus.SYNC_IN_PROGRESS:
        if (viewToaster) toasters.Info("Products Sync In Progress!");
        break;
      case syncStatus.SYNCED_SUCCESSFULLY:
        if (canViewList && !fromRefresh) store.dispatch(getProducts({ page: 1 }));
        if (viewToaster) toasters.Success("Products Synced Successfully!");
        break;
      case syncStatus.SYNC_FAILED:
        if (viewToaster) toasters.Error("Products Sync Failed!");
        break;
      default:
        break;
    }
    store.dispatch(removeLoader("checkSyncProducts"));
  } catch (err) {
    store.dispatch(removeLoader("checkSyncProducts"));
  }
};

export const exportCatalogProducts = (params) => async (dispatch) => {
  store.dispatch(addLoader("exportCatalogProducts"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/catalog/products/export?&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: EXPORT_PRODUCTS,
      payload: res.data,
    });
    store.dispatch(removeLoader("exportCatalogProducts"));
    toasters.Success("We will send you the file via email");
  } catch (err) {
    store.dispatch(removeLoader("exportCatalogProducts"));
  }
};

export const getSkusDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(
    `api/v1/client/catalog/products?&sort[by]=created_at&sort[order]=desc&asHubManager=1&dropdown=1&sku=${search}&page=${page}`,
    {
      handlerEnabled: true,
      loader: "getSkusDDLAsync",
    },
  );

  return {
    options: res.data.data.map((ele) => ({
      value: ele.id,
      label: ele.sku,
    })),
    hasMore: page < res.data.meta.last_page,
    additional: {
      page: page + 1,
    },
  };
};
