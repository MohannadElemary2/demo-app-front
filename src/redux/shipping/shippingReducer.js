import {
  GET_SHIPPING_METHODS,
  GET_SIGNLE_SHIPPING_METHOD,
  CLEAR_SINGLE_SHIPPING_METHOD,
  GET_SHIPPING_PARTNERS_COUNTRIES,
  GET_SHIPPING_PARTNERS_CITIES,
  CLEAR_SHIPPING_PARTNERS_COUNTRIES,
  CLEAR_SHIPPING_PARTNERS_CITIES,
  CHECK_CITY_EXISTENCE,
  GET_SHIPPING_METHODS_AS_DDL
} from "./shippingTypes";

const INITIAL_STATE = {
  data: [],
  totalPages: 0,
  totalRecords: 0,
  signleShippingMethod: null,
  shippingPartnerCountries: null,
  shippingPartnerCities: null,
  cityExistence:null,
  shippingPartnerMethods:null
};

const shippingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SHIPPING_METHODS:
      return {
        ...state,
        data: action.payload,
        totalPages: action.meta.last_page,
        totalRecords: action.meta.total,
      };
    case GET_SIGNLE_SHIPPING_METHOD:
      return {
        ...state,
        ...action.payload,
      };

    case CLEAR_SINGLE_SHIPPING_METHOD:
      return {
        ...state,
        ...action.payload,
      };

    case CLEAR_SHIPPING_PARTNERS_COUNTRIES:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_SHIPPING_PARTNERS_CITIES:
      return {
        ...state,
        ...action.payload,
      };
    case GET_SHIPPING_PARTNERS_COUNTRIES: {
      return { ...state, shippingPartnerCountries: action.payload };
    }
    case GET_SHIPPING_PARTNERS_CITIES: {
      return { ...state, shippingPartnerCities: action.payload };
    }
    case CHECK_CITY_EXISTENCE: {
      return { ...state, cityExistence: action.payload };
    }
    case GET_SHIPPING_METHODS_AS_DDL: {
      return { ...state, shippingPartnerMethods: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default shippingReducer;
