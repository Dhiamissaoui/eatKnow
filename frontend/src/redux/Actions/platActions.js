import * as types from '../ActionTypes/platTypes';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchPlats = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_PLATS_REQUEST });
    
    console.log('🔍 Fetching plats with params:', params);
    
    // Build URL with query params
    let url = `${API_URL}/plats`;
    if (params.restaurant_id) {
      url = `${API_URL}/plats?restaurant_id=${params.restaurant_id}`;
    }
    
    console.log('📡 Request URL:', url);
    
    const response = await axios.get(url);
    
    console.log('✅ Response received:', response.data);
    console.log('📦 Plats data:', response.data.data);
    
    dispatch({
      type: types.FETCH_PLATS_SUCCESS,
      payload: response.data.data || [],
    });
  } catch (error) {
    console.error('❌ Fetch plats error:', error);
    dispatch({
      type: types.FETCH_PLATS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch plats',
    });
  }
};

export const fetchPlatById = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_PLAT_REQUEST });
    const response = await axios.get(`${API_URL}/plats/${id}`);
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
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/plats`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
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
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/plats/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
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
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/plats/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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