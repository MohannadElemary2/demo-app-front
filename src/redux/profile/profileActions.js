import { store } from "../storeConfig/store";
import { VIEW_PROFILE, EDIT_PROFILE, CHANGE_TIMEZONE } from "./profileTypes";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import { axiosInstance } from "../../network/apis";
import { setLocalItem } from "../../utility/commonFunctions";
import { duration } from "../../utility/constants";
import toasters from "../../utility/toasters";

export const viewProfile = (loginData) => async (dispatch) => {
  if (loginData) {
    dispatch({
      type: VIEW_PROFILE,
      payload: loginData,
    });
  } else {
    const res = await axiosInstance.get("/api/v1/client/profile", {
      handlerEnabled: true,
    });
    dispatch({
      type: VIEW_PROFILE,
      payload: res.data.data,
    });

    if (res?.data?.data?.is_super) {
      // eslint-disable-next-line no-console
      console.log("User Permissions =>", "Super Admin");
    } else {
      // eslint-disable-next-line no-console
      console.log("User Permissions =>", res?.data?.data?.roles[0]?.permissions);
    }
  }
};

export const editProfile = (body) => async (dispatch) => {
  store.dispatch(addLoader("saveBtn"));
  try {
    const res = await axiosInstance.put("/api/v1/client/profile", body, {
      handlerEnabled: true,
    });
    dispatch({
      type: EDIT_PROFILE,
      payload: res.data.data,
    });
    dispatch(viewProfile());
    toasters.Success("Profile Edited!");
    store.dispatch(removeLoader("saveBtn"));
  } catch (err) {
    store.dispatch(removeLoader("saveBtn"));
  }
};

export const changeTimezone = (body) => async (dispatch) => {
  store.dispatch(addLoader("saveBtn"));
  try {
    await axiosInstance.put("/api/v1/client/profile/time-zone", body, {
      handlerEnabled: true,
    });
    dispatch({
      type: CHANGE_TIMEZONE,
      payload: { ...body },
    });

    toasters.Success("Success!");
    store.dispatch(removeLoader("saveBtn"));
  } catch (err) {
    store.dispatch(removeLoader("saveBtn"));
  }
};

export const clearProfile = () => async (dispatch) => {
  dispatch({
    type: "CLEAR_PROFILE",
  });
};
export const connectSocket = () => async (dispatch) => {
  dispatch({
    type: "SOCKED_CONNECTED",
  });
};
