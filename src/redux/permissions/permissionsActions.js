import { axiosInstance } from "../../network/apis";
import { SYNC_PERMISSIONS, SET_ABILITY_RULES } from "./permissionsTypes";
import { duration } from "../../utility/constants";
import { manualUpdate } from "../../configs/casl/ability";
import { setLocalItem } from "../../utility/commonFunctions";
import { viewProfile } from "../profile/profileActions";

export const syncPermissions = (auth = null, manualSync = false) => async (dispatch) => {
  // in case login i get data from auth (login api)
  if (auth) {
    dispatch({
      type: SYNC_PERMISSIONS,
      payload: auth,
    });
    setLocalItem("permissions", auth, duration.week);
  } else {
    const res = await axiosInstance.get("/api/v1/client/profile", {
      handlerEnabled: true,
    });
    dispatch(viewProfile(res.data.data));
    dispatch({
      type: SYNC_PERMISSIONS,
      payload: {
        is_super: res.data.data.is_super,
        all_hubs: res.data.data.all_hubs,
        roles: res.data.data.roles,
        hubs: res.data.data.hubs,
      },
    });
    if (manualSync) {
      manualUpdate({
        is_super: res.data.data.is_super,
        all_hubs: res.data.data.all_hubs,
        roles: res.data.data.roles,
        hubs: res.data.data.hubs,
      });
    }
    setLocalItem(
      "permissions",
      {
        is_super: res.data.data.is_super,
        all_hubs: res.data.data.all_hubs,
        roles: res.data.data.roles,
        hubs: res.data.data.hubs,
      },
      duration.week,
    );
  }
};

export const setAbilityRules = (rules) => (dispatch) => {
  dispatch({
    type: SET_ABILITY_RULES,
    payload: rules,
  });
};
