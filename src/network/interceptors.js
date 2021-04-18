/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-prototype-builtins */
import React from "react";
import { FormattedMessage } from "react-intl";
import Toasters from "../utility/toasters";
import { store } from "../redux/storeConfig/store";
import {
  addRequest,
  removeRequest,
  startLoading,
  finishLoading,
  addLoader,
  removeLoader,
} from "../redux/loaders/loadersActions";
import { addServerError, clearServerErrors } from "../redux/serverErrors/serverErrorsActions";
import { history } from "../history";
import { logout } from "../redux/Auth/AuthActions";
import { syncPermissions } from "../redux/permissions/permissionsActions";
import { setLocalItem } from "../utility/commonFunctions";
import { duration } from "../utility/constants";

export const isHandlerEnabled = (config = {}) =>
  !(config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled);

export const requestHandler = (request) => {
  store.dispatch(startLoading());
  store.dispatch(addRequest(request.url));
  store.dispatch(clearServerErrors());

  if (isHandlerEnabled(request)) {
    if (request.loader) store.dispatch(addLoader(request.loader));
  }
  return request;
};

export const successHandler = (response) => {
  store.dispatch(finishLoading());
  setTimeout(() => {
    store.dispatch(removeRequest(response.config.url));
  }, 500);
  if (isHandlerEnabled(response)) {
    if (response.config.loader) store.dispatch(removeLoader(response.config.loader));
  }
  return response;
};

export const errorHandler = (error) => {
  console.error("{{{{{>>>>>ERROR ===>", { ...error });
  if (error.config.loader) store.dispatch(removeLoader(error.config.loader));
  store.dispatch(finishLoading());
  //  in case lazy issue
  if (!error.config) {
    let counter = +localStorage.getItem("counter") ?? 0;
    if (counter < 3) {
      counter += 1;
      localStorage.setItem("counter", counter);
      window.location.reload();
    } else {
      counter = 0;
      localStorage.setItem("counter", counter);
      history.push("/misc/error/404");
    }
    // if not lazy issue
  } else {
    setTimeout(() => {
      store.dispatch(removeRequest(error?.response?.config?.url));
    }, 500);
  }

  if (isHandlerEnabled(error.config) && error.response) {
    if (error.config.loader) store.dispatch(removeLoader(error.config.loader));
    switch (error.response.status) {
      case 400:
        Toasters.Error(error.response.data.message);
        break;
      case 401:
        Toasters.Error(error.response.data.message);
        setLocalItem("pathname", window.location.pathname, duration.week);
        store.dispatch(logout());
        break;
      case 403:
        Toasters.Error(<FormattedMessage id="You don't have this permission" />);
        history.push("/");
        store.dispatch(syncPermissions());
        break;
      case 422:
        if (error.response.config.url === "/api/v1/client/inventory/remove") {
          Toasters.Error(
            <FormattedMessage id="The quantity is either not available or reserved for picking." />,
          );
        } else {
          Toasters.Error(<FormattedMessage id="Invalid data, please try again" />);
          handleBackendValidations(error);
        }

        break;
      case 404:
        break;
      case 406:
        break;
      case 500:
        history.push("/misc/error/500");
        break;
      default:
        Toasters.Error(<FormattedMessage id="Something went wrong" />);
        break;
    }
  }
  return Promise.reject({ ...error });
};

// Handling backend custom error messages
const handleBackendValidations = (error) => {
  const serverErrorResponse = error.response.data.errors;
  const errors = {};

  for (const key in serverErrorResponse) {
    if (Object.prototype.hasOwnProperty.call(serverErrorResponse, key)) {
      errors[key] = serverErrorResponse[key][0];
    }
  }
  store.dispatch(addServerError(errors));
};
