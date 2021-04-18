import { axiosInstance } from "../../network/apis";
import { GET_SOLD_ITEMS,DISCARD_SOLD_ITEMS,REMOVE_QUANTITY_TO_INVENTORY,CLEAR_SOLD_ITEMS,GET_REFUND_ITEMS,CLEAR_REFUND_ITEMS ,GET_HUBS,DISCARD_REFUND_ITEMS,ADD_QUANTITY_TO_INVENTORY} from "./posTypes";
import { store } from "../storeConfig/store";
import toasters from "../../utility/toasters";

export const getSoldItems = (params) => async (dispatch) => {
    const res = await axiosInstance.get(
        "api/v1/client/pos/sold-items?sort[by]=id&sort[order]=desc",
        {
          handlerEnabled: true,
          params,
          loader: "getSoldItems",
        },
      );
      dispatch({
        type: GET_SOLD_ITEMS,
        payload: res.data,
      });
};

export const clearSoldItems = () => async (dispatch) => {
  dispatch({
    type: CLEAR_SOLD_ITEMS,
  });
};

export const discardSoldItems = (body) => async (dispatch) => {
  const res = await axiosInstance.post("api/v1/client/pos/discard-sold-items", body, {
    handlerEnabled: true,
    loader: "discardSoldItems",
  });
  dispatch({
    type: DISCARD_SOLD_ITEMS,
    payload: res.data,
  });
  store.dispatch(getSoldItems({ hub_id: body.hub_id }));
}; 


export const removeQuantityFromInventory = (body) => async (dispatch) => {
  try {
    const res = await axiosInstance.post(`/api/v1/client/inventory/remove`, body, {
      handlerEnabled: true,
      loader: "removeQuantityFromInventory"
    });
    dispatch({
      type: REMOVE_QUANTITY_TO_INVENTORY,
      payload: res.data.data,
    });
    toasters.Success("Location Confirmed.");
    const discardbody={
      quantity:body.quantity,
      product_id:body.product_id,
      hub_id:body.hub_id
    }
    store.dispatch(discardSoldItems(discardbody));
  } catch (err) {
    store.dispatch(getSoldItems({ hub_id: body.hub_id }));
  }
};

export const getRefundItems = (params) => async (dispatch) => {
  const res = await axiosInstance.get(
      "api/v1/client/pos/refunded-items?sort[by]=id&sort[order]=desc",
      {
        handlerEnabled: true,
        params,
        loader: "getRefundItems",
      },
    );
    dispatch({
      type: GET_REFUND_ITEMS,
      payload: res.data,
    });
};

export const clearRefundItems = () => async (dispatch) => {
  dispatch({
    type: CLEAR_REFUND_ITEMS,
  });
};



export const discardRefundItems = (body) => async (dispatch) => {
  const res = await axiosInstance.post("api/v1/client/pos/discard-refunded-items", body, {
    handlerEnabled: true,
    loader: "discardRefundItems",
  });
  dispatch({
    type: DISCARD_REFUND_ITEMS,
    payload: res.data,
  });
  store.dispatch(getRefundItems({ hub_id: body.hub_id }));
}; 



export const addQuantityToInventory = (body) => async (dispatch) => {
  try {
    const res = await axiosInstance.post(`/api/v1/client/inventory/add`, body, {
      handlerEnabled: true,
      loader: "removeQuantityFromInventory"
    });
    dispatch({
      type: ADD_QUANTITY_TO_INVENTORY,
      payload: res.data.data,
    });
    toasters.Success("Location Confirmed.");
    const discardbody={
      quantity:body.quantity,
      product_id:body.product_id,
      hub_id:body.hub_id
    }
    store.dispatch(discardRefundItems(discardbody));
  } catch (err) {
    store.dispatch(getRefundItems({ hub_id: body.hub_id }));
  }
};


export const getHubs = (params) => async (dispatch) => {
 
  try {
    const res = await axiosInstance.get(
      `api/v1/client/hubs?&sort[by]=created_at&sort[order]=desc&asHubManager=1`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_HUBS,
      payload: res.data,
    });
  
  } catch (err) {
   
  }
};