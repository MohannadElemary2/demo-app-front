import {
  CHANGE_MODE,
  COLLAPSE_SIDEBAR,
  CHANGE_NAVBAR_COLOR,
  CHANGE_NAVBAR_TYPE,
  CHANGE_FOOTER_TYPE,
  CHANGE_MENU_COLOR,
  HIDE_SCROLL_TO_TOP,
  CHANGE_DIR,
} from "./customizerTypes";

export const changeMode = (mode) => {
  return (dispatch) => dispatch({ type: CHANGE_MODE, mode });
};

export const collapseSidebar = (value) => {
  return (dispatch) => dispatch({ type: COLLAPSE_SIDEBAR, value });
};

export const changeNavbarColor = (color) => {
  return (dispatch) => dispatch({ type: CHANGE_NAVBAR_COLOR, color });
};

export const changeNavbarType = (style) => {
  return (dispatch) => dispatch({ type: CHANGE_NAVBAR_TYPE, style });
};

export const changeFooterType = (style) => {
  return (dispatch) => dispatch({ type: CHANGE_FOOTER_TYPE, style });
};

export const changeMenuColor = (style) => {
  return (dispatch) => dispatch({ type: CHANGE_MENU_COLOR, style });
};

export const hideScrollToTop = (value) => {
  return (dispatch) => dispatch({ type: HIDE_SCROLL_TO_TOP, value });
};

export const changeDir = (value) => {
  return (dispatch) => dispatch({ type: CHANGE_DIR, value });
};
