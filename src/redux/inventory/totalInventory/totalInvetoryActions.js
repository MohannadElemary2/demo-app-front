import { GET_TOTAL_INVENTORY, EXPORT_TOTAL_INVENTORY } from "./totalInventoryTypes";
import { axiosInstance } from "./../../../network/apis";
import { addLoader, removeLoader } from "./../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import toasters from "../../../utility/toasters";
import { listValues } from "../../../utility/constants";

export const getTotalInventory = (params) => async (dispatch) => {
  store.dispatch(addLoader("TotalInventory"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/inventory/total?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_TOTAL_INVENTORY,
      payload: res.data,
    });
    store.dispatch(removeLoader("TotalInventory"));
  } catch (err) {
    store.dispatch(removeLoader("TotalInventory"));
  }
};

export const exportTotalInventory = (params) => async (dispatch) => {
  store.dispatch(addLoader("exportTotalInventory"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/inventory/total/export?&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: EXPORT_TOTAL_INVENTORY,
      payload: res.data,
    });
    store.dispatch(removeLoader("exportTotalInventory"));
    toasters.Success("We will send you the file via email");
  } catch (err) {
    store.dispatch(removeLoader("exportTotalInventory"));
  }
};
