import { axiosInstance } from "../../../network/apis";
import { addLoader, removeLoader } from "../../loaders/loadersActions";
import { store } from "../../storeConfig/store";
import toasters from "../../../utility/toasters";
import { history } from "../../../history";

import {
  GET_LOCATIONS,
  CLEAR_LOCATIONS,
  EXPORT_LOCATIONS,
  IMPORT_LOCATIONS,
  CREATE_LOCATION,
  CLEAR_CREATE_LOCATION,
  VIEW_LOCATION,
  CLEAR_VIEWED_LOCATION,
  EDIT_LOCATION,
  DELETE_LOCATION,
} from "./locationsTypes";
import { listValues } from "../../../utility/constants";

export const getLocations = (params) => async (dispatch) => {
  store.dispatch(addLoader("listlocations"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/hubLocations?per_page=${listValues.PER_PAGE}&sort[by]=order&sort[order]=asc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: GET_LOCATIONS,
      payload: res.data,
    });
    store.dispatch(removeLoader("listlocations"));
  } catch (err) {
    store.dispatch(removeLoader("listlocations"));
  }
};

export const clearLocations = () => async (dispatch) => {
  dispatch({
    type: CLEAR_LOCATIONS,
  });
};

export const sortLocations = (id, name, body) => async (dispatch) => {
  store.dispatch(addLoader("sortLocations"));
  try {
    await axiosInstance.post(`api/v1/client/hubs/${id}/sort-locations`, body, {
      handlerEnabled: true,
    });
    store.dispatch(removeLoader("sortLocations"));
    toasters.Success("Your changes have been saved.");

    setTimeout(() => {
      history.push(`/hubs/locations/${id}/${name}`);
    }, 1000);
  } catch (err) {
    store.dispatch(removeLoader("sortLocations"));
  }
};

export const exportLocations = (params) => async (dispatch) => {
  store.dispatch(addLoader("exportlocations"));
  try {
    const res = await axiosInstance.get(
      `api/v1/client/hubLocations/export?&sort[by]=order&sort[order]=asc`,
      {
        handlerEnabled: true,
        params,
      },
    );
    dispatch({
      type: EXPORT_LOCATIONS,
      payload: res.data,
    });
    store.dispatch(removeLoader("exportlocations"));
    toasters.Success("We will send you the file via email");
  } catch (err) {
    store.dispatch(removeLoader("exportlocations"));
  }
};

export const importLocations = (body) => async (dispatch) => {
  const data = new FormData();
  data.append("file", body.file);
  data.append("hub_id", body.hub_id);
  try {
    const res = await axiosInstance.post(`api/v1/client/hubLocations/import`, data, {
      handlerEnabled: true,
    });
    dispatch({
      type: IMPORT_LOCATIONS,
      payload: res.data,
    });
    store.dispatch(getLocations({ page: 1, hub: body.hub_id, per_page: listValues.PER_PAGE }));
    toasters.Success("Data imported successfully.");
  } catch (err) {
    store.dispatch(removeLoader("importlocations"));
  }
};

//

export const createLocation = (body) => async (dispatch) => {
  store.dispatch(addLoader("createLocation"));
  try {
    const res = await axiosInstance.post(`/api/v1/client/hubLocations`, body, {
      handlerEnabled: true,
    });
    dispatch({
      type: CREATE_LOCATION,
      payload: res.data.data,
    });
    store.dispatch(getLocations({ hub: body.hub_id, per_page: listValues.PER_PAGE }));
    store.dispatch(removeLoader("createLocation"));
    toasters.Success("Your changes have been saved.");
  } catch (err) {
    store.dispatch(removeLoader("createLocation"));
  }
};

export const clearCreatedHub = () => async (dispatch) => {
  dispatch({
    type: CLEAR_CREATE_LOCATION,
  });
};

export const clearViwededLocation = () => async (dispatch) => {
  dispatch({
    type: CLEAR_VIEWED_LOCATION,
  });
};

export const viewLocation = (id) => async (dispatch) => {
  store.dispatch(addLoader("viewLocation"));
  try {
    const res = await axiosInstance.get(`/api/v1/client/hubLocations/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: VIEW_LOCATION,
      payload: res.data.data,
    });

    store.dispatch(removeLoader("viewLocation"));
  } catch (err) {
    store.dispatch(removeLoader("viewLocation"));
  }
};

export const editLocation = (id, body, canViewList) => async (dispatch) => {
  store.dispatch(addLoader("editLocation"));
  try {
    const res = await axiosInstance.put(`/api/v1/client/hubLocations/${id}`, body, {
      handlerEnabled: true,
    });
    dispatch({
      type: EDIT_LOCATION,
      payload: res.data.data,
    });
    store.dispatch(clearViwededLocation());
    if (canViewList)
      store.dispatch(getLocations({ hub: body.hub_id, per_page: listValues.PER_PAGE }));
    store.dispatch(removeLoader("editLocation"));
    toasters.Success("Your changes have been saved.");
  } catch (err) {
    store.dispatch(removeLoader("editLocation"));
  }
};

export const deleteLocation = (id, hubId, canViewList) => async (dispatch) => {
  store.dispatch(addLoader("deleteLocation"));
  try {
    const res = await axiosInstance.delete(`/api/v1/client/hubLocations/${id}`, {
      handlerEnabled: true,
    });
    dispatch({
      type: DELETE_LOCATION,
      payload: res.data.data,
    });
    store.dispatch(removeLoader("deleteLocation"));
    if (canViewList)
      store.dispatch(getLocations({ hub: hubId, page: 1, per_page: listValues.PER_PAGE }));
    toasters.Success("The location has been deleted successfully.");
  } catch (err) {
    store.dispatch(removeLoader("deleteLocation"));
  }
};


export const getLocationsDDLAsync = async (search, loadedOptions, { page,hub }) => {

  const res = await axiosInstance.get(
    `api/v1/client/hubLocations?&sort[by]=created_at&sort[order]=desc&dropdown=1&name=${search}&page=${page}&hub=${hub}`,
    {
      handlerEnabled: true,
      loader: "getLocationsDDLAsync",
    },
  );

  return {
    options: res.data.data.map((ele) => ({
      value: ele.id,
      label: ele.name,
    })),
    hasMore: page < res.data.meta.last_page,
    additional: {
      page: page + 1,
    },
  };
};