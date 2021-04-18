export const showAlert = (alertData) => (dispatch) => {
  dispatch({
    type: "SHOW_ALERT",
    payload: alertData,
  });
};

export const hideAlert = () => (dispatch) => {
  dispatch({
    type: "HIDE_ALERT",
  });
};
