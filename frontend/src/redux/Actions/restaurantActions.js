import * as types from '../ActionTypes/restaurantTypes';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getRestaurants = (params) => {
  return axios.get(`${API_URL}/restaurants`, { params });
};

const getRestaurantById = (id) => {
  return axios.get(`${API_URL}/restaurants/${id}`);
};

const createRestaurant = (data) => {
  return axios.post(`${API_URL}/restaurants`, data, { headers: getAuthHeader() });
};

const updateRestaurant = (id, data) => {
  return axios.put(`${API_URL}/restaurants/${id}`, data, { headers: getAuthHeader() });
};

const deleteRestaurant = (id) => {
  return axios.delete(`${API_URL}/restaurants/${id}`, { headers: getAuthHeader() });
};

export const fetchRestaurants = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_RESTAURANTS_REQUEST });
    const response = await getRestaurants(params);
    dispatch({
      type: types.FETCH_RESTAURANTS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_RESTAURANTS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch restaurants',
    });
  }
};

export const fetchRestaurantById = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_RESTAURANT_REQUEST });
    const response = await getRestaurantById(id);
    dispatch({
      type: types.FETCH_RESTAURANT_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_RESTAURANT_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch restaurant',
    });
  }
};

export const addRestaurant = (data) => async (dispatch) => {
  try {
    const response = await createRestaurant(data);
    dispatch({
      type: types.ADD_RESTAURANT_SUCCESS,
      payload: response.data.data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRestaurantById = (id, data) => async (dispatch) => {
  try {
    const response = await updateRestaurant(id, data);
    dispatch({
      type: types.UPDATE_RESTAURANT_SUCCESS,
      payload: response.data.data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRestaurantById = (id) => async (dispatch) => {
  try {
    await deleteRestaurant(id);
    dispatch({
      type: types.DELETE_RESTAURANT_SUCCESS,
      payload: id,
    });
  } catch (error) {
    throw error;
  }
};

export const clearSelectedRestaurant = () => (dispatch) => {
  dispatch({ type: types.CLEAR_SELECTED_RESTAURANT });
};