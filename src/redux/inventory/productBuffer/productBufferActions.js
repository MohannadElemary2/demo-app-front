import {
  GET_PRODUCTS_BUFFER_LIST,
  VIEW_SINGLE_PRODUCT_BUFFER,
  CLEAR_SINGLE_PRODUCT_BUFFER,
  CLEAR_PRODUCTS_BUFFER_LIST,
} from "./productBufferTypes";
import { axiosInstance } from "./../../../network/apis";
import { addLoader, removeLoader } from "./../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import toasters from "../../../utility/toasters";
import { history } from "./../../../history";
import { listValues } from "../../../utility/constants";
export const getProductsBufferList = (params) => async (dispatch) => {
  store.dispatch(addLoader("getProductsBufferList"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/inventory/hubs/products-buffer?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_PRODUCTS_BUFFER_LIST,
      payload: res.data,
    });
    store.dispatch(removeLoader("getProductsBufferList"));
  } catch (err) {
    store.dispatch(removeLoader("getProductsBufferList"));
  }
};

export const exportProductsBufferList = (params) => async (dispatch) => {
  store.dispatch(addLoader("exportProductsBufferList"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/inventory/hubs/products-buffer/export?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    toasters.Success("We will send you the file via email");
    store.dispatch(removeLoader("exportProductsBufferList"));
  } catch (err) {
    store.dispatch(removeLoader("exportProductsBufferList"));
  }
};

export const viewSingleProductBuffer = (productId, hubId) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/inventory/hubs/products-buffer/${productId}?hub=${hubId}`,
    {
      handlerEnabled: true,
    },
  );
  dispatch({
    type: VIEW_SINGLE_PRODUCT_BUFFER,
    payload: res.data.data,
  });
};
export const clearSingleProductBuffer = () => async (dispatch) => {
  dispatch({
    type: CLEAR_SINGLE_PRODUCT_BUFFER,
  });
};

export const clearProductBufferlist = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PRODUCTS_BUFFER_LIST,
  });
};
export const updateSingleProductBuffer = (id, body) => async (dispatch) => {
  store.dispatch(addLoader("updateSingleProductBuffer"));
  try {
    await axiosInstance.put(`/api/v1/client/inventory/hubs/products-buffer/${id}`, body, {
      handlerEnabled: true,
    });
    toasters.Success(`Your changes have been saved.`);
    store.dispatch(removeLoader("updateSingleProductBuffer"));
    setTimeout(() => {
      history.goBack();
    }, 2000);
  } catch (err) {
    store.dispatch(removeLoader("updateSingleProductBuffer"));
  }
};

export const resetSingleProductBuffer = (id, body) => async (dispatch) => {
  store.dispatch(addLoader("resetSingleProductBuffer"));
  try {
    await axiosInstance.post(`/api/v1/client/inventory/hubs/products-buffer/${id}/reset`, body, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("resetSingleProductBuffer"));
    store.dispatch(viewSingleProductBuffer(id, body.hub));
  } catch (err) {
    store.dispatch(removeLoader("resetSingleProductBuffer"));
  }
};
