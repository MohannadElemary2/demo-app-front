import {
 
    GET_SHIPPING_PARTNERS_COUNTRIES,
    GET_SHIPPING_PARTNERS_CITIES_TO,
    GET_SHIPPING_PARTNERS_CITIES_FROM,
    CLEAR_SHIPPING_PARTNERS_COUNTRIES,
    CLEAR_SHIPPING_PARTNERS_CITIES_FROM,
    CLEAR_SHIPPING_PARTNERS_CITIES_TO,
    CHECK_FROM_CITY_EXISTENCE,
    CHECK_TO_CITY_EXISTENCE,
    GET_SHIPPING_METHODS_AS_DDL,
    PRINT_LABEL,
    CLEAR_FROM_CITY_EXISTENCE,
    CLEAR_TO_CITY_EXISTENCE,
    CLEAR_PRINT_LABEL
  } from "./createShippmentTypes";
  
  const INITIAL_STATE = {

    shippingPartnerCountries: null,
    shippingPartnerCitiesFrom: null,
    shippingPartnerCitiesTo:null,
    cityFromExistence:null,
    cityToExistence:null,
    shippingPartnerMethods:null,
    printLabel:null
  };
  
  const createShippmentReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    
      case CLEAR_SHIPPING_PARTNERS_COUNTRIES:
        return {
          ...state,
          ...action.payload,
        };
    case CLEAR_SHIPPING_PARTNERS_CITIES_FROM:
        return {
          ...state,
          ...action.payload,
        };
     case CLEAR_SHIPPING_PARTNERS_CITIES_TO:
          return {
            ...state,
            ...action.payload,
          }

     case CLEAR_PRINT_LABEL:
            return {
              ...state,
              ...action.payload,
            }
     case CLEAR_FROM_CITY_EXISTENCE:
              return {
                ...state,
                ...action.payload,
              }

     case CLEAR_TO_CITY_EXISTENCE:
                return {
                  ...state,
                  ...action.payload,
                }
      case GET_SHIPPING_PARTNERS_COUNTRIES: {
        return { ...state, shippingPartnerCountries: action.payload };
      }
      case GET_SHIPPING_PARTNERS_CITIES_FROM: {
        return { ...state, shippingPartnerCitiesFrom: action.payload };
      }
      case GET_SHIPPING_PARTNERS_CITIES_TO: {
        return { ...state, shippingPartnerCitiesTo: action.payload };
      }
      case CHECK_FROM_CITY_EXISTENCE: {
        return { ...state, cityFromExistence: action.payload };
      }
      case CHECK_TO_CITY_EXISTENCE: {
        return { ...state, cityToExistence: action.payload };
      }
      case GET_SHIPPING_METHODS_AS_DDL: {
        return { ...state, shippingPartnerMethods: action.payload };
      }
      case PRINT_LABEL: {
        return { ...state, printLabel: action.payload };
      }
      default: {
        return state;
      }
    }
  };
  
  export default createShippmentReducer;