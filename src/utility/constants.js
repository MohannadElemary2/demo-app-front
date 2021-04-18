import React from "react";
import { FormattedMessage } from "react-intl";
import { getTimes, randomNumber } from "./commonFunctions";
export const duration = {
  minute: 60000,
  day: 8.64e7,
  week: 6.048e8,
  month: 2.592e9,
  year: 3.154e10,
};

export const formRegex = {
  noSpecialNorSpaces: /^(\d|\w)+$/,
  // eslint-disable-next-line no-useless-escape
  url: /^(https:\/\/www\.|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|^((https:\/\/www\.|https:\/\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|'\\'?$/,
};

export const status = {
  unauthorized: 401,
  notFound: 404,
  internalServerError: 500,
  unprocessableEntity: 422,
};

export const weekDays = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
].map((day, i) => ({
  id: i,
  name: day,
  open: 0,
  shifts: [
    {
      id: randomNumber(),
      day: i,
      time_from: null,
      time_to: null,
      errUiId: randomNumber(),
    },
  ],
  allDay: 0,
  errUiId: randomNumber(),
}));

export const syncStatus = {
  NO_SYNC_YET: 1,
  SYNCED_SUCCESSFULLY: 2,
  SYNC_FAILED: 3,
  SYNC_IN_PROGRESS: 4,
};

export const hubTypes = {
  BACKSTORAGE: 1,
  PICKING: 2,
};

export const shiftTimes = getTimes().map((ele, i) => ({
  id: i,
  value: ele,
  label: ele,
}));

export const listValues = {
  PER_PAGE: 20,
};

export const syncTypes = {
  CATEGORIES: 1,
  ATTRIBUTES: 2,
  PRODUCTS: 3,
};

export const OrderStatus = {
  PENDING: 1,
  PREPARING: 2,
  PREPARED: 3,
  PREPARING_TO_SHIP: 4,
  SHIPMENT_READY: 5,
  SHIPPED: 6,
  DELIVERED: 7,
  CANCELLED: 8,
};

export const validationMsgs = {
  required: <FormattedMessage id="This field is required." />,
};

export const noActionsRoles = ["Picker", "Dispatcher"];

export const orderDetails = {
  NEW: "New",
  INCOMPLETE: "Incomplete",
  NOT_FOUND: "Not Found",
  DONE: "Picked",
};

export const offlineOrderStatus = {
  Sale: 1,
  Refund: 2,
};
