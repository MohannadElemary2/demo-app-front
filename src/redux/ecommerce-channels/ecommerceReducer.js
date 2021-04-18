import {
  GET_CHANNELS,
  GET_SIGNLE_CHANNEL,
  CLEAR_SINGLE_CHANNEL,
  GET_INTEGRATION_HUBS,
  CLEAR_INTEGRATION_HUBS,
  GET_HUBS_COUNTRIES,
  GET_HUBS_CITIES,
  GET_CHANNEL_CONFIGS,
  GET_INTEGRATED_SHIPPING_PARTNERS,
  SET_ACTIVE_TAP,
  SET_ACTIVATED_TAP,
  GET_HUBS_COUNTRIES_DDL,
  GET_HUBS_CITIES_DDL,
} from "./ecommerceTypes";

const INITIAL_STATE = {
  data: [],
  params: null,
  allData: [],
  totalPages: 0,
  filteredData: [],
  totalRecords: 0,
  sortIndex: [],
  signleChannel: null,
  integrationHubs: null,
  signleChannelConfigs: null,
  signleChannelShipping: null,
  activeTap: null,
  activatedTaps: [],
  hubsCountriesDDL: { data: [], meta: {} },
  hubsCitiesDDL: { data: [], meta: {} },
};

const ecommerceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHANNELS:
      return {
        ...state,
        data: action.payload,
        totalPages: action.meta.last_page,
        totalRecords: action.meta.total,
      };
    case GET_SIGNLE_CHANNEL:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_SINGLE_CHANNEL:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_INTEGRATION_HUBS:
      return {
        ...state,
        ...action.payload,
      };

    case GET_INTEGRATION_HUBS: {
      return { ...state, integrationHubs: action.payload };
    }
    case GET_HUBS_COUNTRIES: {
      return { ...state, hubsCountries: action.payload };
    }
    case GET_HUBS_CITIES: {
      return { ...state, hubsCities: action.payload };
    }
    case GET_CHANNEL_CONFIGS: {
      return { ...state, signleChannelConfigs: action.payload };
    }
    case GET_INTEGRATED_SHIPPING_PARTNERS: {
      return { ...state, signleChannelShipping: action.payload };
    }
    case SET_ACTIVE_TAP: {
      return {
        ...state,
        activeTap: action.payload,
      };
    }
    case SET_ACTIVATED_TAP: {
      return {
        ...state,
        activatedTaps: [...state.activatedTaps, action.payload],
      };
    }
    case GET_HUBS_COUNTRIES_DDL: {
      const updatedDDL = state.hubsCountriesDDL;
      updatedDDL.data = [...updatedDDL.data, ...action.payload.data];
      updatedDDL.meta = action.payload.meta;
      return { ...state, hubsCountriesDDL: updatedDDL };
    }
    case GET_HUBS_CITIES_DDL: {
      const updatedDDL = state.hubsCitiesDDL;
      updatedDDL.data = [...updatedDDL.data, ...action.payload.data];
      updatedDDL.meta = action.payload.meta;
      return { ...state, hubsCitiesDDL: updatedDDL };
    }
    default: {
      return state;
    }
  }
};

export default ecommerceReducer;
