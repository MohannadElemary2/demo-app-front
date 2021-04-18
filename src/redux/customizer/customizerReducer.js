import themeConfig from "../../configs/themeConfig";
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

const customizerReducer = (state = themeConfig, action) => {
  switch (action.type) {
    case CHANGE_MODE:
      return { ...state, theme: action.mode };
    case COLLAPSE_SIDEBAR:
      return { ...state, sidebarCollapsed: action.value };
    case CHANGE_NAVBAR_COLOR:
      return { ...state, navbarColor: action.color };
    case CHANGE_NAVBAR_TYPE:
      return { ...state, navbarType: action.style };
    case CHANGE_FOOTER_TYPE:
      return { ...state, footerType: action.style };
    case CHANGE_MENU_COLOR:
      return { ...state, menuTheme: action.style };
    case HIDE_SCROLL_TO_TOP:
      return { ...state, hideScrollToTop: action.value };
    case CHANGE_DIR:
      return { ...state, direction: action.value };
    default:
      return state;
  }
};

export default customizerReducer;
