const INITIAL_STATE = { breadCrumbTitle: "", breadCrumbItems: [] };

const breadCrumbReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_BREADCRUMB_DATA": {
      return { ...state, ...action.payload };
    }
    case "CLEAR_BREADCRUMB_DATA": {
      return { state };
    }
    default: {
      return state;
    }
  }
};

export default breadCrumbReducer;
