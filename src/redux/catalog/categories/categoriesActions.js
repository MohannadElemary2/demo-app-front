import {
  CHECK_SYNC_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORIES_WITHOUT_TREE,
  SYNC_CATEGORIES,
  VIEW_CATEGORY_DETAILS,
} from "./categoriesTypes";
import { axiosInstance } from "../../../network/apis";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import { listValues, syncStatus, syncTypes } from "../../../utility/constants";
import toasters from "../../../utility/toasters";

export const getCategories = () => async (dispatch) => {
  store.dispatch(addLoader("listCategories"));
  try {
    const res = await axiosInstance.get(`/api/v1/client/catalog/categories?tree=1&per_page=50000`, {
      handlerEnabled: true,
    });
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("listCategories"));
  } catch (err) {
    store.dispatch(removeLoader("listCategories"));
  }
};

export const getCategoriesWithOutTree = (params) => async (dispatch) => {
  store.dispatch(addLoader("listCategories"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/catalog/categories?sort[by]=created_at&sort[order]=desc&dropdown=1&per_page=${listValues.PER_PAGE}`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_CATEGORIES_WITHOUT_TREE,
      payload: res.data,
    });
    store.dispatch(removeLoader("listCategories"));
  } catch (err) {
    store.dispatch(removeLoader("listCategories"));
  }
};
export const syncCategories = (params, canViewList) => async (dispatch) => {
  store.dispatch(addLoader("syncCategories"));

  try {
    await axiosInstance.get(`/api/v1/client/catalog/categories/sync`, {
      handlerEnabled: true,
      params,
    });
    dispatch({
      type: SYNC_CATEGORIES,
    });
    store.dispatch(removeLoader("syncCategories"));
  } catch (err) {
    store.dispatch(removeLoader("syncCategories"));
  }
};

export const viewCategoryDetails = (category) => async (dispatch) => {
  dispatch({
    type: VIEW_CATEGORY_DETAILS,
    payload: category,
  });
};

export const checkSyncCategories = (canViewList, viewToaster, fromRefresh = false) => async (
  dispatch,
) => {
  store.dispatch(addLoader("checkSyncCategories"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/catalog/sync-status/${syncTypes.CATEGORIES}`,
      {
        handlerEnabled: true,
      },
    );

    dispatch({
      type: CHECK_SYNC_CATEGORY,
      payload: res.data.data,
    });

    switch (res.data.data.status.value) {
      case syncStatus.SYNC_IN_PROGRESS:
        if (viewToaster) toasters.Info("Categories Sync In Progress!");
        break;
      case syncStatus.SYNCED_SUCCESSFULLY:
        if (canViewList && !fromRefresh) store.dispatch(getCategories({ page: 1 }));
        if (viewToaster) toasters.Success("Categories Synced Successfully!");
        break;
      case syncStatus.SYNC_FAILED:
        if (viewToaster) toasters.Error("Categories Sync Failed!");
        break;
      default:
        break;
    }

    store.dispatch(removeLoader("checkSyncCategories"));
  } catch (err) {
    store.dispatch(removeLoader("checkSyncCategories"));
  }
};

export const getCategoriesDDLAsync = async (search, loadedOptions, { page }) => {
  const res = await axiosInstance.get(
    `api/v1/client/catalog/categories?&sort[by]=created_at&sort[order]=desc&asHubManager=1&dropdown=1&name=${search}&page=${page}`,
    {
      handlerEnabled: true,
      loader: "getCategoriesDDLAsync",
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
