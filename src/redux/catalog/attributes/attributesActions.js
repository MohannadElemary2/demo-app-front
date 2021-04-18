import {
  GET_ATTRIBUTES,
  SYNC_ATTRIBUTES,
  VIEW_ATTRIBUTE,
  CLEAR_ATTRIBUTE,
  CHECK_SYNC_ATTRIBUTES,
} from "./attributesTypes";
import { axiosInstance } from "../../../network/apis";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import { syncStatus, syncTypes, listValues } from "../../../utility/constants";
import toasters from "../../../utility/toasters";

export const getAttributes = (params) => async (dispatch) => {
  store.dispatch(addLoader("listAttributes"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/catalog/attributes?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_ATTRIBUTES,
      payload: res.data,
    });
    store.dispatch(removeLoader("listAttributes"));
  } catch (err) {
    store.dispatch(removeLoader("listAttributes"));
  }
};

export const syncAttributes = (params) => async (dispatch) => {
  store.dispatch(addLoader("syncAttributes"));

  try {
    await axiosInstance.get(`/api/v1/client/catalog/attributes/sync`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: SYNC_ATTRIBUTES,
    });

    store.dispatch(removeLoader("syncAttributes"));
  } catch (err) {
    store.dispatch(removeLoader("syncAttributes"));
  }
};

export const clearAttribute = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ATTRIBUTE,
  });
};

export const viewAttribute = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/api/v1/client/catalog/attributes/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: VIEW_ATTRIBUTE,
      payload: { viewedAttribute: res.data.data },
    });
  } catch (err) {
    dispatch({
      type: VIEW_ATTRIBUTE,
      payload: { viewedAttribute: "noData" },
    });
  }
};

export const checkSyncAttributes = (canViewList, viewToaster, fromRefresh = false) => async (
  dispatch,
) => {
  store.dispatch(addLoader("checkSyncAttributes"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/catalog/sync-status/${syncTypes.ATTRIBUTES}`,
      {
        handlerEnabled: true,
      },
    );

    dispatch({
      type: CHECK_SYNC_ATTRIBUTES,
      payload: res.data.data,
    });
    switch (res.data.data.status.value) {
      case syncStatus.SYNC_IN_PROGRESS:
        if (viewToaster) toasters.Info("Attributes Sync In Progress!");
        break;
      case syncStatus.SYNCED_SUCCESSFULLY:
        if (canViewList && !fromRefresh) store.dispatch(getAttributes({ page: 1 }));
        if (viewToaster) toasters.Success("Attributes Synced Successfully!");
        break;
      case syncStatus.SYNC_FAILED:
        if (viewToaster) toasters.Error("Attributes Sync Failed!");
        break;
      default:
        break;
    }

    store.dispatch(removeLoader("checkSyncAttributes"));
  } catch (err) {
    store.dispatch(removeLoader("checkSyncAttributes"));
  }
};
