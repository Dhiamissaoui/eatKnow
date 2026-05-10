import * as types from '../ActionTypes/platTypes';
import { getPlats, getPlatById, createPlat, updatePlat, deletePlat } from '../api';

export const fetchPlats = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_PLATS_REQUEST });
    const response = await getPlats(params);
    dispatch({
      type: types.FETCH_PLATS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_PLATS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch plats',
    });
  }
};

export const fetchPlatById = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_PLAT_REQUEST });
    const response = await getPlatById(id);
    dispatch({
      type: types.FETCH_PLAT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_PLAT_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch plat',
    });
  }
};

export const addPlat = (data) => async (dispatch) => {
  try {
    const response = await createPlat(data);
    dispatch({
      type: types.ADD_PLAT_SUCCESS,
      payload: response.data.data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlatById = (id, data) => async (dispatch) => {
  try {
    const response = await updatePlat(id, data);
    dispatch({
      type: types.UPDATE_PLAT_SUCCESS,
      payload: response.data.data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlatById = (id) => async (dispatch) => {
  try {
    await deletePlat(id);
    dispatch({
      type: types.DELETE_PLAT_SUCCESS,
      payload: id,
    });
  } catch (error) {
    throw error;
  }
};

export const clearSelectedPlat = () => (dispatch) => {
  dispatch({ type: types.CLEAR_SELECTED_PLAT });
};