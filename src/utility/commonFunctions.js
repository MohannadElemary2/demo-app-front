/* eslint-disable no-param-reassign */
import { history } from "../history";
import { duration } from "./constants";

export const getDomain = () => {
  const { host } = window.location;
  const domain = host.split(".")[0];
  const domain_name = process.env.REACT_APP_DOMAIN ? process.env.REACT_APP_DOMAIN : domain;
  return domain_name;
};

export const getURLParams = (paramName) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(paramName);
};

export const appendURLParams = (paramName, value) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(paramName, value);
  return searchParams.toString();
};
export const deleteURLParam = (paramName) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(paramName);
  return searchParams.toString();
};

/**
 *
 * @param key Local Storage Key
 * @param value Local Storage Value (String)
 * @param ttl Time to live (Expiry Date in MS)
 */
export const setLocalItem = (key, value, ttl = duration.day) => {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};
/**
 *
 * @param key Local Storage Key
 */
export const getLocalItem = (key) => {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

/**
 * Redirect the user to login page if not logged in [from local storage]
 */
export const redirectUnauthUser = () => {
  const user = getLocalItem("auth");
  const segmants = window.location.pathname;
  if (!user && (!segmants.includes("password") || !segmants.includes("set-password"))) {
    history.push("/pages/login");
  }
};

export const randomNumber = (min = 0, max = 10000000) =>
  Math.ceil(min + Math.random() * (max - min));

export const containsAll = (baseArr, arr) => {
  let all = false;

  for (let i = 0; i < arr.length; i += 1) {
    if (baseArr.includes(arr[i])) {
      all = true;
    } else {
      all = false;
      return all;
    }
  }

  return all;
};

export const truncate = (text, num = 10) => {
  if (text.length > num) {
    return `${text.substring(0, num - 3)}...`;
  }
  return text;
};

export const formateNumberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getInnerHTML = (str) => str.replace(/(<([^>]+)>)/gi, "");

export const deepClone = (ele) => JSON.parse(JSON.stringify(ele));

export const getToken = () => {
  const user = getLocalItem("auth");
  if (user) return `Bearer ${user.access_token}`;
  return null;
};

export const toTop = () => {
  window.scroll({ top: 0, left: 0, behavior: "smooth" });
};
export const getTimes = (minutesInterval = 15, startTime = 0) => {
  const times = []; // time array
  const x = minutesInterval; // minutes interval
  let tt = startTime; // start time
  const ap = ["AM", "PM"]; // AM-PM

  const formatHrs = (hh) => {
    const _12Format = hh === 12 ? 12 : hh % 12;
    return _12Format === 0 ? 12 : _12Format;
  };

  // loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i += 1) {
    const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    const mm = tt % 60; // getting minutes of the hour in 0-55 format

    const hours = `0${formatHrs(hh)}`.slice(-2);
    const minutes = `0${mm}`.slice(-2);
    const AMPM = ap[Math.floor(hh / 12)];

    times[i] = `${hours}:${minutes} ${AMPM}`; // pushing data in array in [00:00 - 12:00 AM/PM format]
    tt += x;
  }
  return times;
};

export const debounce = (func, wait, immediate) => {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const humanFileSize = (bytes, si = true, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    u += 1;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return `${bytes.toFixed(dp)} ${units[u]}`;
};

export const toggleStrNum = (strNum) => (strNum === "0" ? "1" : "0");

export const scrollToView = (errors) => {
  console.log(errors);
  if (Object.keys(errors)[0])
    document
      .getElementById(Object.keys(errors)[0])
      .scrollIntoView({ behavior: "smooth", block: "center" });
};
