export const updateBreadCrumbData = (data) => (dispatch) => {
  dispatch({
    type: "UPDATE_BREADCRUMB_DATA",
    payload: data,
  });
};

export const clearBreadCrumbData = () => (dispatch) => {
  dispatch({
    type: "CLEAR_BREADCRUMB_DATA",
  });
};
