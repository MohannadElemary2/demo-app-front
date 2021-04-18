import {
  GET_CATEGORIES,
  VIEW_CATEGORY_DETAILS,
  GET_CATEGORIES_WITHOUT_TREE,
  CHECK_SYNC_CATEGORY,
} from "./categoriesTypes";

const INITIAL_STATE = {
  categoryTreeList: [],
  categoriesList: null,
  syncStatus: null,
};

const categoriesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CATEGORIES: {
      return { ...state, categoryTreeList: action.payload };
    }

    case GET_CATEGORIES_WITHOUT_TREE: {
      return { ...state, categoriesList: action.payload };
    }
    case VIEW_CATEGORY_DETAILS: {
      return { ...state, categoryDetails: action.payload };
    }
    case CHECK_SYNC_CATEGORY: {
      return { ...state, syncStatus: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default categoriesReducer;
