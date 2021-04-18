import { GET_INVENTORY_WITH_HUBS, EXPORT_HUBS_INVENTORY } from "./inventoryWithHubsTypes";
import { axiosInstance } from "../../../network/apis";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import toasters from "../../../utility/toasters";
import { listValues } from "../../../utility/constants";

export const getInventoryWithHubs = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
    `/api/v1/client/inventory/hubs?per_page=${listValues.PER_PAGE}&sort[by]=created_at&sort[order]=desc`,
    {
      handlerEnabled: true,
      params,
      loader: "getInventoryWithHubs",
    },
  );
  dispatch({
    type: GET_INVENTORY_WITH_HUBS,
    payload: res.data,
  });
};

export const exportHubsInventory = (params) => async (dispatch) => {
  store.dispatch(addLoader("exportHubsInventory"));
  try {
    const res = await axiosInstance.get(
      `/api/v1/client/inventory/hubs/export?&sort[by]=created_at&sort[order]=desc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: EXPORT_HUBS_INVENTORY,
      payload: res.data,
    });
    store.dispatch(removeLoader("exportHubsInventory"));
    toasters.Success("We will send you the file via email");
  } catch (err) {
    store.dispatch(removeLoader("exportHubsInventory"));
  }
};
