const INITIAL_STATE = {
  show: false,
  message: "Are you sure?",
  btnColor: "primary",
  confirmBtnColor: null,
  cancelBtnColor: null,
  loader: null,
  iconType: "warning",
  confirmLabel: "Yes",
  cancelLabel: "No",
  onConfirm: () => {},
  onCancel: () => {},
};

const lazyAlertReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SHOW_ALERT": {
      return { ...state, show: true, ...action.payload };
    }
    case "HIDE_ALERT": {
      return { ...state, show: false };
    }
    default:
      return state;
  }
};

export default lazyAlertReducer;
