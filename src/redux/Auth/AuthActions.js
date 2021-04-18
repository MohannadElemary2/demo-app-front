import { LOGIN, LOG_OUT, CHECK_DOMAIN_EXISTANCE } from "./AuthTypes";
import { axiosInstance } from "../../network/apis";
import { history } from "../../history";
import { getLocalItem, setLocalItem } from "../../utility/commonFunctions";
import { store } from "../storeConfig/store";
import { addServerError } from "../serverErrors/serverErrorsActions";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import { duration } from "../../utility/constants";
import toasters from "../../utility/toasters";
import { syncPermissions } from "../permissions/permissionsActions";
import { clearProfile, viewProfile } from "../profile/profileActions";

export const login = (user) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/api/v1/client/login", user, {
      handlerEnabled: true,
      loader: "loginBtn",
    });

    dispatch({
      type: LOGIN,
      payload: { email: res.data.data.user.email },
    });
    dispatch(viewProfile(res.data.data.user));
    dispatch(
      syncPermissions({
        is_super: res.data.data.user.is_super,
        all_hubs: res.data.data.user.all_hubs,
        roles: res.data.data.user.roles,
        hubs: res.data.data.user.hubs,
      }),
    );

    setLocalItem("auth", { email: res.data.data.user.email }, duration.week);
    toasters.Success(`Welcome Back ${res.data.data.user.name}!`);
    // cashing timezone coz its used in profile components

    if (getLocalItem("pathname")) {
      history.push(getLocalItem("pathname"));
      localStorage.removeItem("pathname");
    } else {
      history.push("/");
    }
  } catch (err) {
    if (err.response && err.response.data.message)
      store.dispatch(addServerError({ email: err.response.data.message }));
  }
};

export const setPasswordValidateLink = (segmants) => async () => {
  const segmantsValue = segmants.split("/");
  const data = {
    check: 1,
  };

  async function run() {
    try {
      await axiosInstance.post(
        `api/v1/client/email/verify/${segmantsValue[2]}/${segmantsValue[3]}`,
        data,
        {
          handlerEnabled: false,
        },
      );
    } catch (e) {
      history.push("/pages/login");
    }
  }
  run();
};

export const resetPasswordValidateLink = (data) => async () => {
  try {
    await axiosInstance.post("/api/v1/client/reset-password", data, {
      handlerEnabled: true,
    });
  } catch (err) {
    history.push("/pages/login");
  }
};
export const setPassword = (segmants, data) => async () => {
  const segmantsValue = segmants.split("/");
  store.dispatch(addLoader("setPasswordBtn"));
  try {
    await axiosInstance.post(
      `api/v1/client/email/verify/${segmantsValue[2]}/${segmantsValue[3]}`,
      data,
      {
        handlerEnabled: true,
      },
    );
    store.dispatch(removeLoader("setPasswordBtn"));

    toasters.Success("Success!");
    history.push("/pages/login");
  } catch (err) {
    store.dispatch(removeLoader("setPasswordBtn"));
  }
};

export const forgetPassword = (data) => async () => {
  store.dispatch(addLoader("forgetPasswordBtn"));
  try {
    await axiosInstance.post("/api/v1/client/forgot-password", data, {
      handlerEnabled: true,
    });
    setLocalItem("userEmail", data.email, duration.week);
    toasters.Success("Success!");
    store.dispatch(removeLoader("forgetPasswordBtn"));
  } catch (err) {
    store.dispatch(removeLoader("forgetPasswordBtn"));
  }
};

export const resetPassword = (data) => async () => {
  store.dispatch(addLoader("resetPasswordBtn"));
  try {
    await axiosInstance.post("/api/v1/client/reset-password", data, {
      handlerEnabled: true,
    });
    setTimeout(() => {
      history.push("/pages/login");
    }, 1000);

    toasters.Success("Password Reset!");
    store.dispatch(removeLoader("resetPasswordBtn"));
  } catch (err) {
    store.dispatch(removeLoader("resetPasswordBtn"));
  }
};

export const changePassword = (data) => async () => {
  store.dispatch(addLoader("changePasswordBtn"));
  try {
    await axiosInstance.put("/api/v1/client/profile/change-password", data, {
      handlerEnabled: true,
    });

    toasters.Success("Password Changed!");
    setTimeout(() => {
      history.push("/pages/login");
    }, 1000);
    store.dispatch(removeLoader("changePasswordBtn"));
  } catch (err) {
    store.dispatch(removeLoader("changePasswordBtn"));
  }
};

export const logout = (call = false) => async (dispatch) => {
  if (call) {
    await axiosInstance.get("/api/v1/client/profile/logout", {
      handlerEnabled: true,
      loader: "logoutBtn",
    });
  }
  dispatch({
    type: LOG_OUT,
  });

  localStorage.removeItem("auth");
  localStorage.removeItem("permissions");
  history.push("/pages/login");
  dispatch(clearProfile());
  window.Echo.disconnect();
};

export const checkDomainExistance = (data) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/api/v1/client/domain/check", data, {
      handlerEnabled: true,
    });
    dispatch({
      type: CHECK_DOMAIN_EXISTANCE,
      payload: res.data.data,
    });
  } catch (err) {
    history.push("/misc/error/workspace-not-found");
  }
};
