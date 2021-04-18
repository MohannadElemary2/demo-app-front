import React from "react";
import { FormattedMessage } from "react-intl";
import { axiosInstance } from "../../network/apis";
import {
  GET_SETTINGS,
  UPDATE_SETTINGS,
  SETUP_WIZARD,
  GET_POS_INTEGRATIONS,
  SHOW_POS_INTEGRATIONS,
} from "./settingsTypes";
import toasters from "../../utility/toasters";
import { store } from "../storeConfig/store";
import { addLoader, removeLoader } from "../loaders/loadersActions";
import { can } from "../../configs/casl/ability";

export const updateSettings = (body) => async (dispatch) => {
  store.dispatch(addLoader("saveSettingBtn"));
  if (body.settings.includes({ key: "is_setup_wizard_finished", value: "1" })) {
    try {
      await axiosInstance.put("/api/v1/client/settings", body, {
        handlerEnabled: true,
      });
      dispatch({
        type: UPDATE_SETTINGS,
        payload: { ...body },
      });
      store.dispatch(getSettings());
      store.dispatch(removeLoader("saveSettingBtn"));
    } catch (err) {
      store.dispatch(removeLoader("saveSettingBtn"));
    }
  } else {
    try {
      await axiosInstance.put("/api/v1/client/settings", body, {
        handlerEnabled: true,
      });
      dispatch({
        type: UPDATE_SETTINGS,
        payload: { ...body },
      });
      store.dispatch(getSettings());
      store.dispatch(removeLoader("saveSettingBtn"));
      toasters.Success("success");
    } catch (err) {
      store.dispatch(removeLoader("saveSettingBtn"));
    }
  }
};

export const getSettings = () => async (dispatch) => {
  const res = await axiosInstance.get("/api/v1/client/settings", {
    handlerEnabled: true,
  });

  dispatch({
    type: GET_SETTINGS,
    payload: res.data.data,
  });
};

export const setupWizard = (body) => async (dispatch) => {
  try {
    await axiosInstance.put("/api/v1/client/setup-wizard/is-finished", body, {
      handlerEnabled: true,
    });
    dispatch({
      type: SETUP_WIZARD,
      payload: { ...body },
    });
    if (can("view", "settings")) store.dispatch(getSettings());
    store.dispatch(removeLoader("setupWizardBtn"));
  } catch (err) {
    store.dispatch(removeLoader("setupWizardBtn"));
  }
};

export const getPosIntegrations = (params) => async (dispatch) => {
  const res = await axiosInstance.get("/api/v1/client/pos/integrations", {
    handlerEnabled: true,
    params,
    loader: "getPosIntegration",
  });
  dispatch({
    type: GET_POS_INTEGRATIONS,
    payload: res.data,
  });
};
export const showPosIntegrations = (id) => async (dispatch) => {
  const res = await axiosInstance.get(`/api/v1/client/pos/integrations/${id}`, {
    handlerEnabled: true,
    loader: "showPosIntegrations",
  });
  dispatch({
    type: SHOW_POS_INTEGRATIONS,
    payload: res.data.data,
  });
};
export const generatePosApiKey = (body) => async (dispatch) => {
  try {
    const res = await axiosInstance.post(
      `/api/v1/client/pos/integrations/generate-api-key`,
      { integration: body.integration },
      {
        handlerEnabled: true,
        loader: "generatePosApiKey",
      },
    );
    // adding the same data shape as showPosIntegrations as it will be handled inside the component
    dispatch({
      type: SHOW_POS_INTEGRATIONS,
      payload: { configuration: [res.data.data] },
    });
    toasters.Success(<FormattedMessage id="A new key is generated successfully" />);
  } catch (err) {
    toasters.Error(<FormattedMessage id="Failed to generate a new key, please try again later" />);
  }
};
