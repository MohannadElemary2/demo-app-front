import { axiosInstance } from "../../../network/apis";
import { addLoader, removeLoader } from "./../../loaders/loadersActions";
import { setRemoveQuantityAlert } from "../../serverErrors/serverErrorsActions";
import { store } from "../../storeConfig/store";
import { ADD_QUANTITY_TO_INVENTORY } from "./editInventoryTypes";
import toasters from "../../../utility/toasters";
import { getInventoryWithHubLocationsINAddQuantity } from "../inventoryWithHubsLocations/inventoryWithHubsLocationsActions";
import { history } from "./../../../history";

export const addQuantityToInventory = (body, componentName) => async (dispatch) => {
  store.dispatch(addLoader("editQuantityInventory"));
  try {
    const res = await axiosInstance.post(`/api/v1/client/inventory/add`, body, {
      handlerEnabled: true,
    });
    dispatch({
      type: ADD_QUANTITY_TO_INVENTORY,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("editQuantityInventory"));
    toasters.Success("Your changes have been saved.");
    if (componentName === "addQuantity") {
      store.dispatch(
        getInventoryWithHubLocationsINAddQuantity({
          product: body.product_id,
          hub: body.hub_id
        }),
      );
    }

    if (componentName === "auditEditQuantities") {
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
  } catch (err) {
    store.dispatch(removeLoader("editQuantityInventory"));
  }
};

export const removeQuantityFromInventory = (body) => async (dispatch) => {
  store.dispatch(addLoader("editQuantityInventory"));
  try {
    const res = await axiosInstance.post(`/api/v1/client/inventory/remove`, body, {
      handlerEnabled: true,
    });
    dispatch({
      type: ADD_QUANTITY_TO_INVENTORY,
      payload: res.data.data,
    });

    store.dispatch(removeLoader("editQuantityInventory"));
    if (body.force_remove === 1) {
      toasters.Success("You removed a reserved quantity, Please refill it.");
    } else {
      toasters.Success("Your changes have been saved.");
    }
    setTimeout(() => {
      history.goBack();
    }, 2000);
  } catch (err) {
    if (err.response.status == 406) store.dispatch(setRemoveQuantityAlert(true));
    store.dispatch(removeLoader("editQuantityInventory"));
  }
};
